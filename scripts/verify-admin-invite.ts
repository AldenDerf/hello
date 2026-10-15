import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { config } from "dotenv";

config({ path: ".env.local", quiet: true });
// This verification must never send a live owner notification.
delete process.env.RESEND_API_KEY;

async function main() {
  if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") {
    throw new Error("Admin invite verification is disabled in production.");
  }
  const url = new URL(process.env.DATABASE_URL ?? "");
  if (!["postgres:", "postgresql:"].includes(url.protocol) || decodeURIComponent(url.pathname.slice(1)) !== "mva_dev") {
    throw new Error("Admin invite verification requires mva_dev.");
  }

  const { POST, OPTIONS } = await import("../src/app/api/admin/invites/route");
  const { hashInviteCode } = await import("../src/lib/invite/code");
  const { redeemInviteCode, completeInviteSession } = await import("../src/lib/invite/lifecycle");
  const { prisma } = await import("../src/lib/prisma");
  assert.equal((await prisma.$queryRaw<Array<{ database: string }>>`SELECT current_database() AS database`)[0]?.database, "mva_dev");

  const secret = randomBytes(32).toString("hex");
  process.env.INVITE_ADMIN_SECRET = secret;
  let codeHash: string | undefined;

  try {
    const request = (authorization?: string) => new Request("http://localhost/api/admin/invites", {
      method: "POST",
      headers: authorization ? { Authorization: authorization } : undefined,
    });
    const missing = await POST(request());
    assert.equal(missing.status, 401);
    assert.equal(missing.headers.get("Cache-Control"), "no-store");
    assert.deepEqual(await missing.json(), { error: "Unauthorized" });
    assert.equal((await POST(request("Bearer wrong"))).status, 401);
    delete process.env.INVITE_ADMIN_SECRET;
    assert.equal((await POST(request(`Bearer ${secret}`))).status, 401);
    process.env.INVITE_ADMIN_SECRET = secret;
    assert.equal(OPTIONS().status, 405);

    const created = await POST(request(`Bearer ${secret}`));
    assert.equal(created.status, 201);
    assert.equal(created.headers.get("Cache-Control"), "no-store");
    const body = await created.json();
    assert.match(body.code, /^HELLO-[2-9A-HJKMNP-Z]{4}-[2-9A-HJKMNP-Z]{4}$/);
    assert.deepEqual({ type: body.type, status: body.status }, { type: "INVITE", status: "UNUSED" });
    assert.deepEqual(Object.keys(body).sort(), ["code", "status", "type"]);

    codeHash = hashInviteCode(body.code);
    const row = await prisma.inviteAccess.findUniqueOrThrow({ where: { codeHash } });
    assert.equal(row.codeHash, codeHash);
    assert.notEqual(row.codeHash, body.code);
    assert.equal(row.codeType, "INVITE");
    assert.equal(row.status, "UNUSED");

    const redeemed = await redeemInviteCode(body.code);
    assert.equal(redeemed.kind, "SESSION");
    if (redeemed.kind === "SESSION") await completeInviteSession(redeemed.token);
    const test = await redeemInviteCode("HELLO-TEST");
    assert.equal(test.kind, "SESSION");
    if (test.kind === "SESSION") await completeInviteSession(test.token);
    console.log("Admin invite verification passed.");
  } finally {
    if (codeHash) await prisma.inviteAccess.deleteMany({ where: { codeHash } });
    await prisma.$disconnect();
    delete process.env.INVITE_ADMIN_SECRET;
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Admin invite verification failed.");
  process.exitCode = 1;
});
