import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { preferencesCookieKey } from "@/features/settings/preferences";
import { getServerPreferences } from "@/features/settings/server-preferences";

export default async function Home() {
  const cookieStore = await cookies();
  const preferences = getServerPreferences(
    cookieStore.get(preferencesCookieKey)?.value,
  );
  const landingPage = preferences?.landingPage ?? "/pocketDashboard";

  redirect(`/login?returnTo=${encodeURIComponent(landingPage)}`);
}
