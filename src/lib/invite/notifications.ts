import "server-only";

import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const LEASE_MS = 60_000;
const RETRY_MS = 5 * 60_000;
const MAX_ATTEMPTS = 5;
// Resend retains idempotency keys for 24 hours. Stop before that guarantee expires.
const IDEMPOTENCY_WINDOW_MS = 23 * 60 * 60_000;

type SendNotification = (message: { from: string; to: string; subject: string; text: string }, idempotencyKey: string) => Promise<void>;

async function sendWithResend(message: { from: string; to: string; subject: string; text: string }, idempotencyKey: string) {
  const { error } = await new Resend(process.env.RESEND_API_KEY!).emails.send(message, { idempotencyKey });
  if (error) throw new Error("Resend did not accept the notification.");
}

export async function dispatchInviteNotifications(send: SendNotification = sendWithResend) {
  const now = new Date();
  await prisma.inviteNotification.updateMany({
    where: { acceptedAt: null, deadAt: null, OR: [{ attempts: { gte: MAX_ATTEMPTS } }, { firstAttemptAt: { lte: new Date(now.getTime() - IDEMPOTENCY_WINDOW_MS) } }] },
    data: { deadAt: now, leaseUntil: null },
  });
  const pending = await prisma.inviteNotification.findMany({
    where: { acceptedAt: null, deadAt: null, attempts: { lt: MAX_ATTEMPTS }, nextAttemptAt: { lte: now }, OR: [{ leaseUntil: null }, { leaseUntil: { lte: now } }] },
    orderBy: { createdAt: "asc" },
    take: 10,
  });

  for (const notification of pending) {
    const claimed = await prisma.inviteNotification.updateMany({
      where: { id: notification.id, acceptedAt: null, deadAt: null, attempts: { lt: MAX_ATTEMPTS }, nextAttemptAt: { lte: now }, OR: [{ leaseUntil: null }, { leaseUntil: { lte: now } }] },
      data: { leaseUntil: new Date(Date.now() + LEASE_MS), attempts: { increment: 1 }, firstAttemptAt: notification.firstAttemptAt ?? now },
    });
    if (claimed.count !== 1) continue;

    try {
      const apiKey = process.env.RESEND_API_KEY;
      const to = process.env.INVITE_NOTIFICATION_EMAIL;
      const from = process.env.INVITE_EMAIL_FROM;
      if (!apiKey?.trim() || !to?.trim() || !from?.trim()) throw new Error("Notification email configuration is missing.");

      const timestamp = new Intl.DateTimeFormat("en-PH", {
        timeZone: "Asia/Manila", dateStyle: "full", timeStyle: "long",
      }).format(notification.occurredAt);
      const redeemed = notification.event === "REDEEMED";
      await send({
        from, to,
        subject: redeemed ? "HELLO — Invitation Opened 👀" : "HELLO — She Finished the Story 😂",
        text: redeemed
          ? `Event: Invitation Redeemed\nInvitation type: REAL\nTime (Philippine Standard Time): ${timestamp}\n\nShe's entered the experience. 👀`
          : `Event: Story Completed\nTime (Philippine Standard Time): ${timestamp}\n\nThe full experience is complete. 😂`,
      }, `hello-${notification.id}`);
      await prisma.inviteNotification.updateMany({
        where: { id: notification.id, acceptedAt: null },
        data: { acceptedAt: new Date(), leaseUntil: null },
      });
    } catch {
      // Provider messages may contain request details. Log only the failure category.
      console.error("Invite notification dispatch failed.");
      const attempts = notification.attempts + 1;
      const dead = attempts >= MAX_ATTEMPTS || Date.now() - (notification.firstAttemptAt ?? now).getTime() >= IDEMPOTENCY_WINDOW_MS;
      await prisma.inviteNotification.updateMany({
        where: { id: notification.id, acceptedAt: null },
        data: {
          leaseUntil: null,
          deadAt: dead ? new Date() : null,
          nextAttemptAt: new Date(Date.now() + RETRY_MS * 3 ** (attempts - 1)),
        },
      });
    }
  }
}
