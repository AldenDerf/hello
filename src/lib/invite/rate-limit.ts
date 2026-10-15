import "server-only";

import { createHmac } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { requireInviteEnvironment } from "./code";

const WINDOW_MS = 15 * 60_000;
const MAX_ATTEMPTS = 8;

export async function allowInviteAttempt(ip: string, now = new Date()) {
  const window = Math.floor(now.getTime() / WINDOW_MS);
  const key = createHmac("sha256", requireInviteEnvironment())
    .update(`invite-rate:${window}:${ip}`)
    .digest("hex");
  const expiresAt = new Date((window + 1) * WINDOW_MS);
  const rows = await prisma.$queryRaw<Array<{ attempts: number }>>`
    INSERT INTO "private_app"."invite_rate_limit" ("key", "attempts", "expiresAt")
    VALUES (${key}, 1, ${expiresAt})
    ON CONFLICT ("key") DO UPDATE SET "attempts" = "private_app"."invite_rate_limit"."attempts" + 1
    RETURNING "attempts"
  `;
  return rows[0]?.attempts !== undefined && rows[0].attempts <= MAX_ATTEMPTS;
}

export async function purgeExpiredInviteLimits(now = new Date()) {
  await prisma.inviteRateLimit.deleteMany({ where: { expiresAt: { lt: now } } });
}
