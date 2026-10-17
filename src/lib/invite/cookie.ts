import "server-only";

import { cookies } from "next/headers";
import { completeInviteSession, redeemInviteCode } from "./lifecycle";
import { validateSessionToken } from "./session";

const COOKIE_NAME = "hello_invite_session";

export async function redeemInviteWithCookie(rawCode: string) {
  const store = await cookies();
  const result = await redeemInviteCode(rawCode, store.get(COOKIE_NAME)?.value);
  if (result.kind === "SESSION") {
    store.set(COOKIE_NAME, result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: result.expiresAt,
    });
    return { kind: result.codeType === "TEST" ? "TEST" as const : "ACTIVE_INVITE" as const };
  }
  return result;
}

export async function validateInviteCookie() {
  const store = await cookies();
  return validateSessionToken(store.get(COOKIE_NAME)?.value);
}

export async function completeInviteWithCookie() {
  const store = await cookies();
  const result = await completeInviteSession(store.get(COOKIE_NAME)?.value);
  store.delete(COOKIE_NAME);
  return result;
}
