
import Link from "next/link";
import Image from "next/image";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Create an Account | MessFinder",
  description:
    "Join MessFinder to discover local mess services, rate meals, write reviews, and save your favourite food options.",
  robots: { index: false, follow: false },
};

export default async function RegisterPage({ searchParams }) {
  const params = await searchParams;

  const next =
    typeof params?.next === "string" &&
    params.next.startsWith("/") &&
    !params.next.startsWith("//")
      ? params.next
      : "";

  const redirectHref = next
    ? `/login?registered=1&next=${encodeURIComponent(next)}`
    : "/login?registered=1";

  return (
    <AuthShell variant="user" mode="register">
      <main className="min-h-screen bg-white">
        <div className="grid min-h-screen lg:grid-cols-2">

          {/* LEFT: FOOD IMAGE */}
          <section className="relative hidden overflow-hidden bg-emerald-950 lg:block">
            <Image
              src="/images/register-food.jpg"
              alt="Freshly prepared Indian meals"
              fill
              priority
              sizes="50vw"
              className="object-cover"
            />

            {/* Image overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/95 via-emerald-950/30 to-black/10" />

            <div className="absolute left-12 top-10 z-10">
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

            <div className="absolute inset-x-0 bottom-0 z-10 p-10 xl:p-14">
              <span className="mb-5 inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                <span className="mr-2 h-2 w-2 rounded-full bg-emerald-400" />
                Your next favourite meal awaits
              </span>

              <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight text-white xl:text-5xl">
                Good food.
                <br />
                Honest reviews.
                <br />
                <span className="text-emerald-300">
                  Better everyday meals.
                </span>
              </h1>

              <p className="mt-5 max-w-md text-base leading-7 text-white/80">
                Discover trusted local mess and tiffin services, explore
                meal options, and find food that feels right for you.
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
                  Find meals that fit your lifestyle
                </p>
              </div>
            </div>
          </section>

          {/* RIGHT: REGISTRATION FORM */}
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

              {/* Form heading */}
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
                    <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="10" cy="7" r="4" />
                    <path d="M20 8v6" />
                    <path d="M23 11h-6" />
                  </svg>
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Create your account
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                  Join MessFinder to rate messes, review your meals, and
                  save your favourites.
                </p>
              </div>

              {/* Existing authentication form */}
              <RegisterForm
                role="user"
                redirectHref={redirectHref}
                title="Create your account"
                subtitle="It only takes a minute to get started."
                nameLabel="Full name"
                submitLabel="Create account"
              />

              {/* Login link */}
              <p className="mt-7 text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-emerald-700 transition hover:text-emerald-800"
                >
                  Log in
                </Link>
              </p>

              {/* Owner registration */}
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-center">
                <p className="text-sm font-semibold text-slate-800">
                  Own a mess or tiffin service?
                </p>

                <Link
                  href="/owner/register"
                  className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-emerald-700 transition hover:text-emerald-800"
                >
                  Register as a mess owner
                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              {/* Footer */}
              <p className="mt-8 text-center text-xs leading-5 text-slate-400">
                By creating an account, you agree to use MessFinder
                responsibly.
              </p>
            </div>
          </section>
        </div>
      </main>
    </AuthShell>
  );
}
