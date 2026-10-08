"use server";

import { redeemInviteWithCookie } from "@/lib/invite/cookie";

export type AccessResult = { kind: "INVALID" | "ACTIVE" | "TEST" | "COMPLETED" | "ALREADY_ACTIVE" | "ERROR" };

export async function submitInviteCode(rawCode: string): Promise<AccessResult> {
  try {
    const result = await redeemInviteWithCookie(rawCode);
    switch (result.kind) {
      case "TEST":
        return { kind: "TEST" };
      case "ACTIVE_INVITE":
        return { kind: "ACTIVE" };
      case "INVALID":
        return { kind: "INVALID" };
      case "COMPLETED":
        return { kind: "COMPLETED" };
      case "ALREADY_ACTIVE":
        return { kind: "ALREADY_ACTIVE" };
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Invite submission failed:", error);
    }
    return { kind: "ERROR" };
  }
}
