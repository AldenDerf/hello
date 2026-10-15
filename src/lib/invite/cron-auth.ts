import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

export function isAuthorizedCron(authorization: string | null) {
  const secret = process.env.CRON_SECRET;
  const match = authorization?.match(/^Bearer ([^\s]+)$/);
  if (!secret?.trim() || !match) return false;
  return timingSafeEqual(
    createHash("sha256").update(match[1]).digest(),
    createHash("sha256").update(secret).digest(),
  );
}
