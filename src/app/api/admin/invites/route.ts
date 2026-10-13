import { isAuthorizedAdmin } from "@/lib/admin/auth";
import { hashInviteCode } from "@/lib/invite/code";
import { generateInviteCode } from "@/lib/invite/generate";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const headers = { "Cache-Control": "no-store" };
const MAX_ATTEMPTS = 5;

export async function POST(request: Request) {
  if (!isAuthorizedAdmin(request.headers.get("authorization"))) {
    return Response.json({ error: "Unauthorized" }, { status: 401, headers });
  }

  try {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const code = generateInviteCode();
      const codeHash = hashInviteCode(code);
      const existing = await prisma.inviteAccess.findUnique({
        where: { codeHash },
        select: { id: true },
      });
      if (existing) continue;

      try {
        await prisma.inviteAccess.create({
          data: { codeHash, codeType: "INVITE", status: "UNUSED" },
          select: { id: true },
        });
      } catch (error) {
        if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
          continue;
        }
        throw error;
      }

      return Response.json({ code, type: "INVITE", status: "UNUSED" }, { status: 201, headers });
    }
  } catch {
    // Keep database and configuration details out of the API response and logs.
  }

  return Response.json({ error: "Unable to create invite" }, { status: 500, headers });
}

export function OPTIONS() {
  return new Response(null, { status: 405, headers: { ...headers, Allow: "POST" } });
}
