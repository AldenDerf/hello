import "server-only";

import { prisma } from "@/lib/prisma";
import { hashInviteCode, normalizeInviteCode, requireInviteEnvironment } from "./code";
import type { InviteLookupResult } from "./types";

export async function lookupInviteCode(rawCode: string): Promise<InviteLookupResult> {
  requireInviteEnvironment();

  if (!normalizeInviteCode(rawCode)) {
    return { kind: "INVALID" };
  }

  const invite = await prisma.inviteAccess.findUnique({
    where: { codeHash: hashInviteCode(rawCode) },
    select: { id: true, codeType: true, status: true },
  });

  if (!invite) {
    return { kind: "INVALID" };
  }

  if (invite.codeType === "TEST") {
    return { kind: "TEST", inviteId: invite.id };
  }

  switch (invite.status) {
    case "UNUSED":
      return { kind: "INVITE_UNUSED", inviteId: invite.id };
    case "ACTIVE":
      return { kind: "INVITE_ACTIVE", inviteId: invite.id };
    case "COMPLETED":
      return { kind: "INVITE_COMPLETED", inviteId: invite.id };
  }
}
