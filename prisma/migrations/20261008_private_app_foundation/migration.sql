-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "private_app";

-- CreateEnum
CREATE TYPE "private_app"."InviteCodeType" AS ENUM ('TEST', 'INVITE');

-- CreateEnum
CREATE TYPE "private_app"."InviteStatus" AS ENUM ('UNUSED', 'ACTIVE', 'COMPLETED');

-- CreateTable
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

-- CreateIndex
CREATE UNIQUE INDEX "invite_access_codeHash_key" ON "private_app"."invite_access"("codeHash");
