import Link from "next/link";
import { isAuth0Configured } from "@/lib/auth/auth0";

type LoginPageProps = {
  searchParams?: Promise<{
    returnTo?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const requestedReturnTo = Array.isArray(params.returnTo)
    ? params.returnTo[0]
    : params.returnTo;
  const returnTo =
    requestedReturnTo && requestedReturnTo.startsWith("/")
      ? requestedReturnTo
      : "/pocketDashboard";
  const loginHref = `/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
  const signupHref = `/auth/login?screen_hint=signup&returnTo=${encodeURIComponent(
    returnTo,
  )}`;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-375 items-center px-3 py-6 md:px-5">
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-6">
        <section className="panel-surface hidden rounded-3xl p-6 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="soft-text text-xs font-semibold uppercase tracking-[0.16em]">
              Orlogo Zarlaga
            </p>
            <h1 className="mt-3 text-3xl font-semibold leading-tight text-[#173a30]">
              Welcome back
            </h1>
            <p className="soft-text mt-2 max-w-sm text-sm leading-6">
              Use Auth0 Universal Login so sign-in, sign-up, and password reset stay
              outside your app and remain easy to maintain.
            </p>
          </div>

          <div className="rounded-2xl border border-[#cfe0d6] bg-white/70 p-4 text-sm text-[#2d4b3f]">
            After authentication you will be returned to your dashboard.
          </div>
        </section>

        <section className="panel-surface rounded-3xl p-4 sm:p-6">
          <div className="mb-5">
            <p className="soft-text text-xs font-semibold uppercase tracking-[0.16em]">
              Sign in
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-[#173a30]">Login</h2>
          </div>

          {isAuth0Configured ? (
            <div className="space-y-3">
              <a
                href={loginHref}
                className="block w-full rounded-xl bg-linear-to-r from-[#2f8f70] to-[#2a7262] py-2.5 text-center text-sm font-semibold text-white shadow-[0_12px_24px_rgba(35,108,86,0.25)] hover:brightness-105">
                Continue with Auth0
              </a>

              <p className="text-center text-sm text-[#4a6559]">
                New here?{" "}
                <a
                  href={signupHref}
                  className="font-medium text-[#2e7964] hover:underline">
                  Create account
                </a>
              </p>

              <p className="text-center text-sm text-[#4a6559]">
                Need password help?{" "}
                <Link
                  href="/forgot-pass"
                  className="font-medium text-[#2e7964] hover:underline">
                  Forgot password
                </Link>
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#ead9b7] bg-[#fff9eb] p-4 text-sm text-[#6c5830]">
              `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`,
              `AUTH0_SECRET`, `APP_BASE_URL` env-үүдээ нэмсний дараа Auth0 login
              идэвхжинэ.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
