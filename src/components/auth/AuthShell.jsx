import Link from "next/link";
import { CheckCircle2, ShieldCheck, User, Store } from "lucide-react";

const variants = {
  user: {
    eyebrow: "Customer account",
    title: "Find your next favourite mess.",
    subtitle:
      "Create a free account to rate and review the messes you eat at, and help others find good food nearby.",
    points: [
      "Browse verified mess listings in your area",
      "Rate and review every meal you try",
      "Save your favourites and compare plans",
    ],
    accent: "from-green-700 via-green-600 to-emerald-500",
    badge: "For food lovers",
  },
  owner: {
    eyebrow: "Mess owner account",
    title: "Turn your kitchen into a brand.",
    subtitle:
      "List your mess, publish your weekly menu and meal plans, and reach people searching for good food nearby.",
    points: [
      "Create and manage your mess listing",
      "Publish menus, plans and monthly prices",
      "Reviewed by our team before going live",
    ],
    accent: "from-green-800 via-green-700 to-emerald-600",
    badge: "For mess owners",
  },
  admin: {
    eyebrow: "Administrator access",
    title: "Keep the marketplace trustworthy.",
    subtitle:
      "Approve new listings, suspend anything that breaks the rules, and keep an audit trail of every action.",
    points: [
      "Approve or reject pending listings",
      "Suspend or restore messes instantly",
      "Full moderation history is recorded",
    ],
    accent: "from-slate-900 via-slate-800 to-slate-700",
    badge: "Restricted area",
  },
};

const accountTypes = {
  user: {
    label: "User",
    hint: "Find and review messes",
    login: "/login",
    register: "/register",
    icon: User,
  },
  owner: {
    label: "Mess owner",
    hint: "List your mess",
    login: "/owner/login",
    register: "/owner/register",
    icon: Store,
  },
};

export default function AuthShell({ variant = "user", mode = "login", children }) {
  const config = variants[variant] ?? variants.user;
  const isAdmin = variant === "admin";

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f4fbf7]">
      {/* Background artwork */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/homescreenbg.png" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/90 to-[#eefaf2]" />
        <div className="absolute -left-28 top-8 h-72 w-72 rounded-full bg-green-200/40 blur-3xl" />
        <div className="absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
      </div>

      {/* Top bar — logo links home */}
      <header className="relative z-10 border-b border-green-100/80 bg-white/75 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
          <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="MessFinder home">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg shadow-green-600/15 ring-1 ring-green-100 transition duration-300 group-hover:-rotate-3 group-hover:ring-green-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.jpg"
                alt="MessFinder logo"
                width={44}
                height={44}
                className="h-full w-full object-cover"
              />
            </span>

            <span className="text-[21px] font-black tracking-tight text-slate-950 sm:text-2xl">
              Mess<span className="text-green-600">Finder</span>
              <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Find food. Feel good.
              </span>
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-600 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
          >
            <span className="hidden sm:inline">Back to home</span>
            <span className="sm:hidden">Home</span>
          </Link>
        </div>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-5 pb-12 pt-8 sm:px-8 lg:pb-16 lg:pt-10">
        {/* Account type / restricted banner */}
        {isAdmin ? (
          <div className="mx-auto flex max-w-xl items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500 shadow-sm backdrop-blur">
            <ShieldCheck size={15} className="shrink-0 text-slate-400" />
            Restricted administrator area
          </div>
        ) : (
          <div className="mx-auto max-w-xl">
            <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-green-700">
              {mode === "register" ? "Create your account" : "Choose your account type"}
            </p>

            <div
              role="tablist"
              aria-label="Account type"
              className="mt-3 grid grid-cols-2 gap-2 rounded-2xl border border-green-100 bg-white/90 p-2 shadow-sm backdrop-blur"
            >
              {Object.entries(accountTypes).map(([key, account]) => {
                const active = key === variant;
                const Icon = account.icon;
                return (
                  <Link
                    key={key}
                    href={mode === "register" ? account.register : account.login}
                    role="tab"
                    aria-selected={active}
                    className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2.5 text-center transition duration-200 ${
                      active
                        ? "bg-green-600 text-white shadow-md shadow-green-600/20"
                        : "text-slate-600 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    <span className="flex items-center gap-2 text-sm font-bold">
                      <Icon size={16} />
                      {account.label}
                    </span>
                    <span className={`text-[11px] font-medium ${active ? "text-white/80" : "text-slate-400"}`}>
                      {account.hint}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Brand + form */}
        <div className="mt-8 grid w-full gap-8 lg:grid-cols-2 lg:gap-12">
          <aside className="relative hidden overflow-hidden rounded-[2rem] p-10 text-white shadow-xl shadow-green-900/10 lg:flex lg:flex-col lg:justify-between">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/tiffenimage.png"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${config.accent} opacity-[0.88]`} />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em]">
                <ShieldCheck size={14} />
                {config.badge}
              </span>

              <h2 className="mt-8 text-4xl font-black leading-[1.1] tracking-tight">{config.title}</h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/85">{config.subtitle}</p>
            </div>

            <ul className="relative mt-10 space-y-4">
              {config.points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-white/90" />
                  <span className="text-sm leading-6 text-white/90">{point}</span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Compact image for small screens */}
              <div className="mb-6 overflow-hidden rounded-3xl shadow-lg shadow-green-900/5 lg:hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/tiffenimage.png"
                  alt="Home style meals served at a local mess"
                  className="h-40 w-full object-cover sm:h-48"
                />
              </div>

              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
