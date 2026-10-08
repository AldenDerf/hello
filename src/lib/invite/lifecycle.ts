import "server-only";

import { prisma } from "@/lib/prisma";
import { lookupInviteCode } from "./lookup";
import { createSessionToken, hashSessionToken, SESSION_SECONDS, validateSessionToken } from "./session";

export type RedeemResult =
  | { kind: "INVALID" | "ALREADY_ACTIVE" | "COMPLETED" }
  | { kind: "SESSION"; codeType: "TEST" | "INVITE"; inviteId: string; token: string; expiresAt: Date };

function newSession() {
  const token = createSessionToken();
  return {
    token,
    sessionTokenHash: hashSessionToken(token),
    expiresAt: new Date(Date.now() + SESSION_SECONDS * 1000),
  };
}

export async function redeemInviteCode(rawCode: string, existingToken?: string): Promise<RedeemResult> {
  const lookup = await lookupInviteCode(rawCode);
  if (lookup.kind === "INVALID") return { kind: "INVALID" };
  if (lookup.kind === "INVITE_COMPLETED") return { kind: "COMPLETED" };

  if (lookup.kind === "INVITE_ACTIVE" && existingToken) {
    const session = await validateSessionToken(existingToken);
    if (session.kind === "ACTIVE_INVITE_SESSION" && session.inviteId === lookup.inviteId) {
      const invite = await prisma.inviteAccess.findUnique({
        where: { id: lookup.inviteId },
        select: { sessionExpiresAt: true },
      });
      if (invite?.sessionExpiresAt && invite.sessionExpiresAt > new Date()) {
        return { kind: "SESSION", codeType: "INVITE", inviteId: lookup.inviteId, token: existingToken, expiresAt: invite.sessionExpiresAt };
      }
    }
  }

  const session = newSession();
  if (lookup.kind === "TEST") {
    await prisma.inviteAccess.update({
      where: { id: lookup.inviteId },
      data: { sessionTokenHash: session.sessionTokenHash, sessionExpiresAt: session.expiresAt },
    });
    return { kind: "SESSION", codeType: "TEST", inviteId: lookup.inviteId, token: session.token, expiresAt: session.expiresAt };
  }

  const now = new Date();
  const updated = await prisma.inviteAccess.updateMany({
    where: lookup.kind === "INVITE_UNUSED"
      ? { id: lookup.inviteId, codeType: "INVITE", status: "UNUSED" }
      : {
          id: lookup.inviteId,
          codeType: "INVITE",
          status: "ACTIVE",
          OR: [{ sessionExpiresAt: { lte: now } }, { sessionExpiresAt: null }],
        },
    data: lookup.kind === "INVITE_UNUSED"
      ? {
          status: "ACTIVE",
          redeemedAt: now,
          sessionTokenHash: session.sessionTokenHash,
          sessionExpiresAt: session.expiresAt,
        }
      : {
          sessionTokenHash: session.sessionTokenHash,
          sessionExpiresAt: session.expiresAt,
        },
  });

  if (updated.count !== 1) return { kind: "ALREADY_ACTIVE" };
  return { kind: "SESSION", codeType: "INVITE", inviteId: lookup.inviteId, token: session.token, expiresAt: session.expiresAt };
}

export async function completeInviteSession(token?: string) {
  const session = await validateSessionToken(token);
  if (session.kind === "TEST_SESSION") {
    const updated = await prisma.inviteAccess.updateMany({
      where: { id: session.inviteId, codeType: "TEST", sessionTokenHash: hashSessionToken(token!) },
      data: { sessionTokenHash: null, sessionExpiresAt: null },
    });
    return updated.count === 1 ? { kind: "TEST_ENDED" as const } : { kind: "NO_SESSION" as const };
  }
  if (session.kind !== "ACTIVE_INVITE_SESSION") return { kind: "NO_SESSION" as const };

  const updated = await prisma.inviteAccess.updateMany({
    where: {
      id: session.inviteId,
      codeType: "INVITE",
      status: "ACTIVE",
      sessionTokenHash: hashSessionToken(token!),
      sessionExpiresAt: { gt: new Date() },
    },
    data: {
      status: "COMPLETED",
      completedAt: new Date(),
      sessionTokenHash: null,
      sessionExpiresAt: null,
    },
  });
  return updated.count === 1 ? { kind: "COMPLETED" as const } : { kind: "NO_SESSION" as const };
}
