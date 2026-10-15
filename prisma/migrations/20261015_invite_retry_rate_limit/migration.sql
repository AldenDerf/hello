ALTER TABLE "private_app"."invite_notification" ADD COLUMN "deadAt" TIMESTAMP(3);

CREATE TABLE "private_app"."invite_rate_limit" (
  "key" TEXT NOT NULL,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "invite_rate_limit_pkey" PRIMARY KEY ("key")
);
CREATE INDEX "invite_rate_limit_expiresAt_idx" ON "private_app"."invite_rate_limit"("expiresAt");
