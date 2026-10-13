import { Resend } from "resend";

import { isAuthorizedAdmin } from "@/lib/admin/auth";

export const runtime = "nodejs";

const headers = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  if (!isAuthorizedAdmin(request.headers.get("authorization"))) {
    return Response.json({ error: "Unauthorized" }, { status: 401, headers });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INVITE_NOTIFICATION_EMAIL;
  const from = process.env.INVITE_EMAIL_FROM;
  if (!apiKey?.trim() || !to?.trim() || !from?.trim()) {
    return Response.json({ error: "Unable to send test email" }, { status: 500, headers });
  }

  try {
    const { error } = await new Resend(apiKey).emails.send({
      to,
      from,
      subject: "Hello email test",
      text: "Hello — Resend email setup is working.",
    });
    if (error) throw new Error("Resend rejected the test email.");
    return Response.json({ ok: true }, { status: 200, headers });
  } catch {
    return Response.json({ error: "Unable to send test email" }, { status: 500, headers });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 405, headers: { ...headers, Allow: "POST" } });
}
