-- First-time setup only. Run in the reviewed production SQL Editor session
-- after 01-production-preflight.sql and a verified backup. Do not rerun.
-- Confirm the intended Supabase project ref in the Dashboard before execution;
-- the postgres database name alone does not identify the project.
-- Every persistent object created here belongs to private_app.
BEGIN;

DO $guard$
BEGIN
  IF current_database() <> 'postgres' THEN
    RAISE EXCEPTION 'Expected production database postgres, got %', current_database();
  END IF;

  IF to_regnamespace('private_app') IS NOT NULL AND (
    EXISTS (SELECT 1 FROM pg_class WHERE relnamespace = to_regnamespace('private_app')) OR
    EXISTS (SELECT 1 FROM pg_type WHERE typnamespace = to_regnamespace('private_app')) OR
    EXISTS (SELECT 1 FROM pg_proc WHERE pronamespace = to_regnamespace('private_app'))
  ) THEN
    RAISE EXCEPTION 'private_app is not empty; inspect it and reconcile manually';
  END IF;

END
$guard$;

CREATE SCHEMA IF NOT EXISTS "private_app";

CREATE TYPE "private_app"."InviteCodeType" AS ENUM ('TEST', 'INVITE');
CREATE TYPE "private_app"."InviteStatus" AS ENUM ('UNUSED', 'ACTIVE', 'COMPLETED');
CREATE TYPE "private_app"."InviteNotificationEvent" AS ENUM ('REDEEMED', 'COMPLETED');

CREATE TABLE "private_app"."invite_access" (
  "id" UUID NOT NULL,
  "codeHash" TEXT NOT NULL,
  "codeType" "private_app"."InviteCodeType" NOT NULL,
  "status" "private_app"."InviteStatus" NOT NULL DEFAULT 'UNUSED',
  "redeemedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "sessionTokenHash" TEXT,
  "sessionExpiresAt" TIMESTAMP(3),
  "returnCount" INTEGER NOT NULL DEFAULT 0,
  "secondVisitChoice" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "invite_access_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "invite_access_codeHash_key"
  ON "private_app"."invite_access"("codeHash");

CREATE TABLE "private_app"."invite_notification" (
  "id" UUID NOT NULL,
  "inviteId" UUID NOT NULL,
  "event" "private_app"."InviteNotificationEvent" NOT NULL,
  "occurredAt" TIMESTAMP(3) NOT NULL,
  "acceptedAt" TIMESTAMP(3),
  "firstAttemptAt" TIMESTAMP(3),
  "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "leaseUntil" TIMESTAMP(3),
  "deadAt" TIMESTAMP(3),
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "invite_notification_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "invite_notification_inviteId_fkey" FOREIGN KEY ("inviteId")
    REFERENCES "private_app"."invite_access"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "invite_notification_inviteId_event_key"
  ON "private_app"."invite_notification"("inviteId", "event");
CREATE INDEX "invite_notification_acceptedAt_nextAttemptAt_idx"
  ON "private_app"."invite_notification"("acceptedAt", "nextAttemptAt");

CREATE TABLE "private_app"."invite_rate_limit" (
  "key" TEXT NOT NULL,
  "attempts" INTEGER NOT NULL DEFAULT 0,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "invite_rate_limit_pkey" PRIMARY KEY ("key")
);
CREATE INDEX "invite_rate_limit_expiresAt_idx"
  ON "private_app"."invite_rate_limit"("expiresAt");

COMMIT;
