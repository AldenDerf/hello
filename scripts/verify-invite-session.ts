import { randomBytes } from "node:crypto";
import assert from "node:assert/strict";
import { config } from "dotenv";

config({ path: ".env.local", quiet: true });
// This verification must never send a live owner notification.
delete process.env.RESEND_API_KEY;

async function main() {
  if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") {
    throw new Error("Session verification is disabled in production.");
  }
  const url = new URL(process.env.DATABASE_URL ?? "");
  if (!["postgres:", "postgresql:"].includes(url.protocol) || decodeURIComponent(url.pathname.slice(1)) !== "mva_dev") {
    throw new Error("Session verification requires mva_dev.");
  }

  const { hashInviteCode, requireInviteEnvironment } = await import("../src/lib/invite/code");
  const { prisma } = await import("../src/lib/prisma");
  const { redeemInviteCode, completeInviteSession } = await import("../src/lib/invite/lifecycle");
  const { dispatchInviteNotifications } = await import("../src/lib/invite/notifications");
  const { validateSessionToken, hashSessionToken } = await import("../src/lib/invite/session");
  requireInviteEnvironment();

  const identity = await prisma.$queryRaw<Array<{ database: string }>>`SELECT current_database() AS database`;
  assert.equal(identity[0]?.database, "mva_dev");

  const fixtureCode = `VERIFY-${randomBytes(24).toString("hex")}`;
  const fixture = await prisma.inviteAccess.create({
    data: { codeHash: hashInviteCode(fixtureCode), codeType: "INVITE", status: "UNUSED" },
    select: { id: true },
  });

  try {
    const before = await prisma.inviteAccess.count();
    assert.deepEqual(await redeemInviteCode("INVALID-VERIFY-CODE"), { kind: "INVALID" });
    assert.equal(await prisma.inviteAccess.count(), before);

    const test = await redeemInviteCode("HELLO-TEST");
    assert.equal(test.kind, "SESSION");
    if (test.kind !== "SESSION") throw new Error("TEST session was not created.");
    assert.equal((await validateSessionToken(test.token)).kind, "TEST_SESSION");
    assert.deepEqual(await completeInviteSession(test.token), { kind: "TEST_ENDED" });
    assert.equal(await prisma.inviteNotification.count({ where: { inviteId: test.inviteId } }), 0);
    const testAgain = await redeemInviteCode("HELLO-TEST");
    assert.equal(testAgain.kind, "SESSION");
    assert.equal((await prisma.inviteAccess.findUnique({ where: { id: test.inviteId } }))?.status, "UNUSED");
    if (testAgain.kind === "SESSION") await completeInviteSession(testAgain.token);

    const attempts = await Promise.all([redeemInviteCode(fixtureCode), redeemInviteCode(fixtureCode)]);
    assert.equal(attempts.filter((result) => result.kind === "SESSION").length, 1);
    const redeemedNotice = await prisma.inviteNotification.findUniqueOrThrow({ where: { inviteId_event: { inviteId: fixture.id, event: "REDEEMED" } } });
    assert.equal(redeemedNotice.acceptedAt, null);
    assert.equal(await prisma.inviteNotification.count({ where: { inviteId: fixture.id } }), 1);
    const first = attempts.find((result) => result.kind === "SESSION");
    if (!first || first.kind !== "SESSION") throw new Error("No first session.");
    assert.equal((await validateSessionToken(first.token)).kind, "ACTIVE_INVITE_SESSION");
    assert.equal((await redeemInviteCode(fixtureCode, first.token)).kind, "SESSION");
    assert.equal((await redeemInviteCode(fixtureCode)).kind, "ALREADY_ACTIVE");
    assert.equal((await validateSessionToken("invalid-token")).kind, "NO_SESSION");
    const active = await prisma.inviteAccess.findUniqueOrThrow({ where: { id: fixture.id } });
    assert.equal(active.sessionTokenHash, hashSessionToken(first.token));
    assert.notEqual(active.sessionTokenHash, first.token);

    await prisma.inviteAccess.update({
      where: { id: fixture.id },
      data: { sessionExpiresAt: new Date(Date.now() - 1000) },
    });
    assert.equal((await validateSessionToken(first.token)).kind, "EXPIRED");
    const recovered = await redeemInviteCode(fixtureCode);
    assert.equal(recovered.kind, "SESSION");
    if (recovered.kind !== "SESSION") throw new Error("Recovery failed.");
    const afterRecovery = await prisma.inviteAccess.findUniqueOrThrow({ where: { id: fixture.id } });
    assert.equal(afterRecovery.status, "ACTIVE");
    assert.equal(afterRecovery.redeemedAt?.getTime(), active.redeemedAt?.getTime());
    assert.notEqual(afterRecovery.sessionTokenHash, active.sessionTokenHash);
    assert.equal(await prisma.inviteNotification.count({ where: { inviteId: fixture.id } }), 1);
    assert.equal((await validateSessionToken(first.token)).kind, "NO_SESSION");

    assert.deepEqual(await completeInviteSession(recovered.token), { kind: "COMPLETED" });
    assert.deepEqual(await completeInviteSession(recovered.token), { kind: "NO_SESSION" });
    assert.equal(await prisma.inviteNotification.count({ where: { inviteId: fixture.id } }), 2);
    process.env.RESEND_API_KEY = "mock-only";
    const sent: string[] = [];
    await prisma.inviteNotification.updateMany({ where: { inviteId: fixture.id }, data: { nextAttemptAt: new Date(0) } });
    await dispatchInviteNotifications(async (_message, key) => { sent.push(key); throw new Error("Mock provider failure"); });
    assert.equal(sent.length, 2);
    assert.equal(await prisma.inviteNotification.count({ where: { inviteId: fixture.id, acceptedAt: null } }), 2);
    await prisma.inviteNotification.updateMany({ where: { inviteId: fixture.id }, data: { nextAttemptAt: new Date(0) } });
    const accept = async (message: { text: string }, key: string) => {
      assert.match(message.text, /Philippine Standard Time/);
      assert.ok(!message.text.includes(fixtureCode));
      sent.push(key);
    };
    await Promise.all([dispatchInviteNotifications(accept), dispatchInviteNotifications(accept)]);
    assert.equal(sent.length, 4);
    assert.equal(new Set(sent).size, 2);
    assert.equal(await prisma.inviteNotification.count({ where: { inviteId: fixture.id, acceptedAt: null } }), 0);
    await dispatchInviteNotifications(async () => { throw new Error("Already accepted notification was resent."); });
    await prisma.inviteNotification.update({
      where: { id: redeemedNotice.id },
      data: { acceptedAt: null, attempts: 5, nextAttemptAt: new Date(0) },
    });
    await dispatchInviteNotifications(async () => { throw new Error("Permanent failure was retried."); });
    assert.ok((await prisma.inviteNotification.findUniqueOrThrow({ where: { id: redeemedNotice.id } })).deadAt);
    const completed = await prisma.inviteAccess.findUniqueOrThrow({ where: { id: fixture.id } });
    assert.equal(completed.status, "COMPLETED");
    assert.ok(completed.completedAt);
    assert.equal(completed.sessionTokenHash, null);
    assert.equal(completed.sessionExpiresAt, null);
    assert.deepEqual(await redeemInviteCode(fixtureCode), { kind: "COMPLETED" });
    assert.equal((await validateSessionToken(recovered.token)).kind, "NO_SESSION");
    console.log("Invite session verification passed.");
  } finally {
    await prisma.inviteAccess.delete({ where: { id: fixture.id } });
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Session verification failed.");
  process.exitCode = 1;
});
