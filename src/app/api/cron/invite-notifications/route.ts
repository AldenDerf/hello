import { isAuthorizedCron } from "@/lib/invite/cron-auth";
import { dispatchInviteNotifications } from "@/lib/invite/notifications";
import { purgeExpiredInviteLimits } from "@/lib/invite/rate-limit";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAuthorizedCron(request.headers.get("authorization"))) {
    return Response.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  try {
    await dispatchInviteNotifications();
    await purgeExpiredInviteLimits();
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Unable to process notifications" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
