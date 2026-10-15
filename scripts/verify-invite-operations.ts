import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { config } from "dotenv";

config({ path: ".env.local", quiet: true });
delete process.env.RESEND_API_KEY;

async function main() {
  if (process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production") throw new Error("Development verification only.");
  const url = new URL(process.env.DATABASE_URL ?? "");
  if (decodeURIComponent(url.pathname.slice(1)) !== "mva_dev") throw new Error("Verification requires mva_dev.");

  const { prisma } = await import("../src/lib/prisma");
  const { allowInviteAttempt } = await import("../src/lib/invite/rate-limit");
  const { isAuthorizedCron } = await import("../src/lib/invite/cron-auth");
  const { GET } = await import("../src/app/api/cron/invite-notifications/route");
  const ip = `test-${randomBytes(16).toString("hex")}`;
  const secret = randomBytes(32).toString("hex");
  process.env.CRON_SECRET = secret;
  const existingKeys = new Set((await prisma.inviteRateLimit.findMany({ select: { key: true } })).map((row) => row.key));

  try {
    assert.equal(isAuthorizedCron(null), false);
    assert.equal(isAuthorizedCron("Bearer wrong"), false);
    assert.equal(isAuthorizedCron(`Bearer ${secret}`), true);
    const unauthorized = await GET(new Request("http://localhost/api/cron/invite-notifications"));
    assert.equal(unauthorized.status, 401);
    assert.equal(unauthorized.headers.get("Cache-Control"), "no-store");
    const allowed = await Promise.all(Array.from({ length: 12 }, () => allowInviteAttempt(ip)));
    assert.equal(allowed.filter(Boolean).length, 8);
    assert.equal(allowed.filter((value) => !value).length, 4);
    assert.equal(await allowInviteAttempt(`${ip}-other`), true);
    const rows = await prisma.inviteRateLimit.findMany();
    assert.ok(rows.every((row) => !row.key.includes(ip)));
    console.log("Invite operations verification passed.");
  } finally {
    const newKeys = (await prisma.inviteRateLimit.findMany({ select: { key: true } }))
      .map((row) => row.key).filter((key) => !existingKeys.has(key));
    await prisma.inviteRateLimit.deleteMany({ where: { key: { in: newKeys } } });
    await prisma.$disconnect();
    delete process.env.CRON_SECRET;
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Operations verification failed.");
  process.exitCode = 1;
});
