CREATE TYPE "private_app"."InviteNotificationEvent" AS ENUM ('REDEEMED', 'COMPLETED');

CREATE TABLE "private_app"."invite_notification" (
  "id" UUID NOT NULL,
  "inviteId" UUID NOT NULL,
  "event" "private_app"."InviteNotificationEvent" NOT NULL,
  "occurredAt" TIMESTAMP(3) NOT NULL,
  "acceptedAt" TIMESTAMP(3),
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "leaseUntil" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "invite_notification_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "invite_notification_inviteId_event_key" ON "private_app"."invite_notification"("inviteId", "event");
CREATE INDEX "invite_notification_acceptedAt_nextAttemptAt_idx" ON "private_app"."invite_notification"("acceptedAt", "nextAttemptAt");
ALTER TABLE "private_app"."invite_notification" ADD CONSTRAINT "invite_notification_inviteId_fkey" FOREIGN KEY ("inviteId") REFERENCES "private_app"."invite_access"("id") ON DELETE CASCADE ON UPDATE CASCADE;
