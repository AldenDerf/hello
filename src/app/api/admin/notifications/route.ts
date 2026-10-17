import { isAuthorizedAdmin } from "@/lib/admin/auth";
import { dispatchInviteNotifications } from "@/lib/invite/notifications";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAuthorizedAdmin(request.headers.get("authorization"))) {
    return Response.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  try {
    await dispatchInviteNotifications();
    return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Unable to process notifications" }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
