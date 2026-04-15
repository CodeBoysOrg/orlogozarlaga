import { cookies } from "next/headers";
import Link from "next/link";
import { preferencesCookieKey } from "@/features/settings/preferences";
import { getServerPreferences } from "@/features/settings/server-preferences";
import { isAuth0Configured } from "@/lib/auth/auth0";

export default async function ForgotPassPage() {
  const cookieStore = await cookies();
  const preferences = getServerPreferences(
    cookieStore.get(preferencesCookieKey)?.value,
  );
  const loginHref = `/auth/login?returnTo=${encodeURIComponent(
    preferences?.landingPage ?? "/pocketDashboard",
  )}`;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-375 items-center px-3 py-6 md:px-5">
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-6">
        <section className="panel-surface hidden rounded-3xl p-6 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="soft-text text-xs font-semibold uppercase tracking-[0.16em]">
              Password recovery
            </p>
            <h1 className="theme-heading mt-3 text-3xl font-semibold leading-tight">
              {isAuth0Configured
                ? "Reset password through Auth0"
                : "Reset your password"}
            </h1>
            <p className="soft-text mt-2 max-w-sm text-sm leading-6">
              {isAuth0Configured
                ? "Auth0 Universal Login already includes password recovery, so the reset flow stays outside your app code."
                : "Configure Auth0 to use hosted password reset through Universal Login."}
            </p>
          </div>

          <div className="theme-user-card theme-text rounded-2xl p-4 text-sm">
            {isAuth0Configured
              ? "Open the hosted login screen and use the built-in Forgot password action there."
              : "After reset, sign in again to continue your dashboard."}
          </div>
        </section>

        <section className="panel-surface rounded-3xl p-4 sm:p-6">
          <div className="mb-5">
            <p className="soft-text text-xs font-semibold uppercase tracking-[0.16em]">
              Recovery
            </p>
            <h2 className="theme-heading mt-1 text-2xl font-semibold">
              Forgot password
            </h2>
          </div>

          {isAuth0Configured ? (
            <div className="space-y-3">
              <p className="theme-muted text-sm leading-6">
                Continue to Auth0 login, then click the built-in password reset link.
              </p>

              <a
                href={loginHref}
                className="theme-button-primary block w-full rounded-xl py-2.5 text-center text-sm font-semibold">
                Continue to Auth0
              </a>
            </div>
          ) : (
            <div className="theme-status-warning rounded-2xl p-4 text-sm leading-6">
              Password reset is handled only by Auth0 Universal Login. Add the Auth0
              environment variables, then use the hosted login screen.
            </div>
          )}

          <p className="theme-muted mt-4 text-center text-sm">
            Back to{" "}
            <Link href="/login" className="theme-icon font-medium hover:underline">
              Login
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
