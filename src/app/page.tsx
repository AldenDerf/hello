import { ExperienceEntry } from "@/components/invite/ExperienceEntry";
import { validateInviteCookie } from "@/lib/invite/cookie";

export default async function Home() {
  const session = await validateInviteCookie();
  const hasSession = session.kind === "TEST_SESSION" || session.kind === "ACTIVE_INVITE_SESSION";

  return <ExperienceEntry hasSession={hasSession} />;
}
