
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Log In | MessFinder",
  description:
    "Log in to MessFinder to discover local mess services, review meals, and manage your favourite food options.",
  robots: { index: false, follow: false },
};

function LoginFallback() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="h-4 w-24 rounded bg-slate-200" />
      <div className="h-12 rounded-xl bg-slate-100" />
      <div className="h-12 rounded-xl bg-slate-100" />
      <div className="h-12 rounded-xl bg-emerald-100" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthShell variant="user" mode="login">
      <main className="min-h-screen bg-white">
        <div className="grid min-h-screen lg:grid-cols-2">

          {/* LEFT: FOOD IMAGE */}
          <section className="relative hidden overflow-hidden bg-emerald-950 lg:block">
            <Image
              src="/images/register-food.jpg"
              alt="Freshly prepared Indian food and tiffin meals"
              fill
              priority
              sizes="50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-emerald-950/35 to-black/10" />

            {/* Brand */}
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

            {/* Image content */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-10 xl:p-14">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Good food, closer to you
              </span>

              <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-white xl:text-5xl">
                Welcome back.
                <br />
                <span className="text-emerald-300">
                  Your next meal awaits.
                </span>
              </h1>

              <p className="mt-5 max-w-md text-base leading-7 text-white/80">
                Find trusted mess and tiffin services, explore meal
                options, and make everyday dining easier with MessFinder.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-emerald-950 bg-amber-200 text-sm">
                    🍱
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-emerald-950 bg-orange-200 text-sm">
                    🍛
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-emerald-950 bg-lime-200 text-sm">
                    🥗
                  </span>
                </div>

                <p className="text-sm text-white/85">
                  Your local food guide
                </p>
              </div>
            </div>
          </section>

          {/* RIGHT: LOGIN FORM */}
          <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-16">
            <div className="w-full max-w-md">

              {/* Mobile brand */}
              <Link
                href="/"
                className="mb-9 inline-flex items-center gap-3 lg:hidden"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-lg font-black text-white">
                  M
                </span>

                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  MessFinder
                </span>
              </Link>

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
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <path d="m10 17 5-5-5-5" />
                    <path d="M15 12H3" />
                  </svg>
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Welcome back
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                  Log in to discover great meals and manage your
                  MessFinder account.
                </p>
              </div>

              {/* Existing login component */}
              <Suspense fallback={<LoginFallback />}>
                <LoginForm
                  redirectTo="auto"
                  title="Welcome back"
                  subtitle="Enter your details to continue."
                  footer={
                    <div className="flex flex-col items-start gap-4 border-t border-slate-100 pt-5 text-sm sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-slate-600">
                        New to MessFinder?{" "}
                        <Link
                          href="/register"
                          className="font-bold text-emerald-700 transition hover:text-emerald-800"
                        >
                          Create an account
                        </Link>
                      </p>

                      <Link
                        href="/owner/login"
                        className="font-semibold text-slate-500 transition hover:text-emerald-700"
                      >
                        Mess owner login
                      </Link>
                    </div>
                  }
                />
              </Suspense>

              {/* Bottom note */}
              <p className="mt-8 text-center text-xs leading-5 text-slate-400">
                Find your everyday meals, all in one place.
              </p>
            </div>
          </section>
        </div>
      </main>
    </AuthShell>
  );
}
