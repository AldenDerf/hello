import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

export function isAuthorizedAdmin(authorization: string | null) {
  const secret = process.env.INVITE_ADMIN_SECRET;
  const match = authorization?.match(/^Bearer ([^\s]+)$/);
  if (!secret?.trim() || !match) return false;

  const supplied = createHash("sha256").update(match[1]).digest();
  const expected = createHash("sha256").update(secret).digest();
  return timingSafeEqual(supplied, expected);
}
