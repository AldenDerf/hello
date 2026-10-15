"use server";

import { completeInviteWithCookie, redeemInviteWithCookie } from "@/lib/invite/cookie";
import { allowInviteAttempt } from "@/lib/invite/rate-limit";
import { headers } from "next/headers";

export type AccessResult = { kind: "INVALID" | "ACTIVE" | "TEST" | "COMPLETED" | "ALREADY_ACTIVE" | "ERROR" };

export async function submitInviteCode(rawCode: string): Promise<AccessResult> {
  try {
    if (typeof rawCode !== "string" || rawCode.length > 64) return { kind: "INVALID" };
    const requestHeaders = await headers();
    const ip = process.env.NODE_ENV === "production"
      ? requestHeaders.get("x-vercel-forwarded-for")
      : requestHeaders.get("x-vercel-forwarded-for") ?? requestHeaders.get("x-forwarded-for") ?? "local";
    if (!ip || !(await allowInviteAttempt(ip))) return { kind: "INVALID" };
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

export async function finishFirstRun(): Promise<{ kind: "DONE" | "NO_SESSION" | "ERROR" }> {
  try {
    const result = await completeInviteWithCookie();
    return { kind: result.kind === "COMPLETED" || result.kind === "TEST_ENDED" ? "DONE" : "NO_SESSION" };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("Invite completion failed:", error);
    return { kind: "ERROR" };
  }
}
