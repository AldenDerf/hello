import "server-only";

import { createHmac } from "node:crypto";

export function requireInviteEnvironment() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const secret = process.env.INVITE_CODE_SECRET;
  if (!secret?.trim()) {
    throw new Error("INVITE_CODE_SECRET is not configured.");
  }

  return secret;
}

export function normalizeInviteCode(input: string) {
  return input.trim().toUpperCase();
}

export function hashInviteCode(input: string) {
  const secret = requireInviteEnvironment();
  return createHmac("sha256", secret)
    .update(normalizeInviteCode(input), "utf8")
    .digest("hex");
}
