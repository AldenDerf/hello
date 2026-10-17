import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const SESSION_SECONDS = 60 * 60;

export type SessionResult =
  | { kind: "NO_SESSION" }
  | { kind: "EXPIRED" }
  | { kind: "TEST_SESSION"; inviteId: string }
  | { kind: "ACTIVE_INVITE_SESSION"; inviteId: string };

export function createSessionToken() {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export async function validateSessionToken(token?: string): Promise<SessionResult> {
  if (!token) return { kind: "NO_SESSION" };

  const invite = await prisma.inviteAccess.findFirst({
    where: { sessionTokenHash: hashSessionToken(token) },
    select: { id: true, codeType: true, status: true, sessionExpiresAt: true },
  });

  if (!invite) return { kind: "NO_SESSION" };
  if (!invite.sessionExpiresAt || invite.sessionExpiresAt <= new Date()) {
    return { kind: "EXPIRED" };
  }
  if (invite.codeType === "TEST") return { kind: "TEST_SESSION", inviteId: invite.id };
  if (invite.status === "ACTIVE") {
    return { kind: "ACTIVE_INVITE_SESSION", inviteId: invite.id };
  }
  return { kind: "NO_SESSION" };
}
