import "server-only";

import { createHmac } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { requireInviteEnvironment } from "./code";

const WINDOW_MS = 15 * 60_000;
const MAX_ATTEMPTS = 8;

type InviteRequestContext = {
  nodeEnv: string | undefined;
  vercel: string | undefined;
  vercelEnv: string | undefined;
  databaseUrl: string | undefined;
  vercelForwardedFor: string | null;
};

function isLocalInviteRuntime(context: InviteRequestContext) {
  if (!context.vercel && !context.vercelEnv && context.databaseUrl) {
    try {
      return decodeURIComponent(new URL(context.databaseUrl).pathname.slice(1)) === "mva_dev";
    } catch {
      return false;
    }
  }
  return false;
}

export function resolveInviteRateLimitIdentity(context: InviteRequestContext) {
  // Request headers never establish local status.
  if (!isLocalInviteRuntime(context)) return context.vercelForwardedFor?.trim() || null;
  return context.nodeEnv === "production" ? "local-production" : "local-development";
}

export function shouldRateLimitInviteAttempt(context: InviteRequestContext) {
  // Only a local development process against mva_dev skips throttling.
  return context.nodeEnv === "production" || !isLocalInviteRuntime(context);
}

export async function allowInviteAttempt(ip: string, now = new Date()) {
  const window = Math.floor(now.getTime() / WINDOW_MS);
  const key = createHmac("sha256", requireInviteEnvironment())
    .update(`invite-rate:${window}:${ip}`)
    .digest("hex");
  const expiresAt = new Date((window + 1) * WINDOW_MS);
  const expiresAtSeconds = expiresAt.getTime() / 1000;
  const rows = await prisma.$queryRaw<Array<{ attempts: number }>>`
    INSERT INTO "private_app"."invite_rate_limit" ("key", "attempts", "expiresAt")
    VALUES (${key}, 1, to_timestamp(${expiresAtSeconds}) AT TIME ZONE 'UTC')
    ON CONFLICT ("key") DO UPDATE SET "attempts" = "private_app"."invite_rate_limit"."attempts" + 1
    RETURNING "attempts"
  `;
  return rows[0]?.attempts !== undefined && rows[0].attempts <= MAX_ATTEMPTS;
}

export async function purgeExpiredInviteLimits(now = new Date()) {
  await prisma.inviteRateLimit.deleteMany({ where: { expiresAt: { lt: now } } });
}
