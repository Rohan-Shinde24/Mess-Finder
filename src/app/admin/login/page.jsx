
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Admin Login | MessFinder",
  description:
    "Restricted administrator access for managing MessFinder listings, reviews, and support requests.",
  robots: { index: false, follow: false },
};

function AdminLoginFallback() {
  return (
    <div
      className="animate-pulse space-y-5"
      aria-label="Loading administrator login"
    >
      <div className="h-4 w-28 rounded bg-slate-200" />
      <div className="h-12 rounded-xl bg-slate-100" />
      <div className="h-12 rounded-xl bg-slate-100" />
      <div className="h-12 rounded-xl bg-emerald-100" />
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <AuthShell variant="admin">
      <main className="min-h-screen bg-white">
        <div className="grid min-h-screen lg:grid-cols-2">

          {/* LEFT: ADMIN BRANDING AND IMAGE */}
          <section className="relative hidden overflow-hidden bg-emerald-950 lg:block">
            <Image
              src="/images/register-food.jpg"
              alt="Fresh Indian meals featured on MessFinder"
              fill
              priority
              sizes="50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-emerald-950/45 to-black/20" />

            {/* Logo */}
            <div className="absolute left-10 top-9 z-10 xl:left-12 xl:top-10">
              <Link
                href="/"
                className="inline-flex items-center gap-3 text-white"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-xl font-black shadow-lg">
                  M
                </span>

                <span className="text-2xl font-extrabold tracking-tight">
                  MessFinder
                </span>
              </Link>
            </div>

            {/* Admin information */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-10 xl:p-14">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Restricted administrator area
              </span>

              <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-white xl:text-5xl">
                Manage your
                <br />
                <span className="text-emerald-300">
                  MessFinder platform.
                </span>
              </h1>

              <p className="mt-5 max-w-md text-base leading-7 text-white/80">
                Manage mess listings, review customer feedback, and
                handle support requests from your administration account.
              </p>

              <div className="mt-8 grid max-w-md grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mb-3 text-emerald-300"
                    aria-hidden="true"
                  >
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-5 5" />
                  </svg>

                  <p className="text-sm font-bold text-white">
                    Platform management
                  </p>
                  <p className="mt-1 text-xs text-white/65">
                    Manage listings and reviews
                  </p>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mb-3 text-emerald-300"
                    aria-hidden="true"
                  >
                    <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>

                  <p className="text-sm font-bold text-white">
                    Controlled access
                  </p>
                  <p className="mt-1 text-xs text-white/65">
                    Administrator sign-in
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT: ADMIN LOGIN FORM */}
          <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-16">
            <div className="w-full max-w-md">

              {/* Mobile logo */}
              <Link
                href="/"
                className="mb-10 inline-flex items-center gap-3 lg:hidden"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-lg font-black text-white">
                  M
                </span>

                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  MessFinder
                </span>
              </Link>

              {/* Admin badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Administrator access
              </div>

              {/* Heading */}
              <div className="mb-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Admin login
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                  Sign in with your authorized administrator account
                  to access the dashboard.
                </p>
              </div>

              {/* Existing authentication logic */}
              <Suspense fallback={<AdminLoginFallback />}>
                <LoginForm
                  role="admin"
                  redirectTo="/admin"
                  title="Admin login"
                  subtitle="Enter your administrator credentials to continue."
                  footer={
                    <div className="border-t border-slate-100 pt-5">
                      <p className="text-center text-sm leading-6 text-slate-600">
                        Not an administrator?{" "}
                        <Link
                          href="/login"
                          className="font-bold text-emerald-700 transition hover:text-emerald-800"
                        >
                          Customer login
                        </Link>
                      </p>
                    </div>
                  }
                />
              </Suspense>

              {/* Security note */}
              <div className="mt-7 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-0.5 shrink-0 text-slate-500"
                  aria-hidden="true"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Secure administrator access
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    This area is intended for authorized administrators only.
                    Never share your login credentials.
                  </p>
                </div>
              </div>

              <p className="mt-7 text-center text-xs text-slate-400">
                © {new Date().getFullYear()} MessFinder. All rights reserved.
              </p>
            </div>
          </section>
        </div>
      </main>
    </AuthShell>
  );
}
