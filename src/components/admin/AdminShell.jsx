"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  BarChart3,
  Bell,
  ChevronRight,
  ExternalLink,
  FileDown,
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  LogOut,
  Megaphone,
  Menu,
  Settings,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/listings", label: "Listings", icon: ListChecks },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/recycle-bin", label: "Recycle bin", icon: Trash2 },
  { href: "/admin/ads", label: "Ads", icon: Megaphone },
  { href: "/admin/support", label: "Support", icon: LifeBuoy },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/reports", label: "Reports", icon: FileDown },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminShell({ children }) {
  const pathname = usePathname() || "/admin";
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeHref =
    nav
      .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
      .sort((a, b) => b.href.length - a.href.length)[0]?.href || "/admin";

  const current = nav.find((item) => item.href === activeHref);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-zinc-800 px-5 py-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-700 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.jpg" alt="" className="h-full w-full object-cover" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold tracking-tight text-white">MessFinder</span>
          <span className="mt-0.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            <ShieldCheck size={11} />
            Admin console
          </span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = href === activeHref;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-white text-zinc-900" : "text-white hover:bg-zinc-900"
              }`}
            >
              <Icon size={17} className={active ? "text-zinc-900" : "text-white"} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-zinc-800 px-3 py-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-900"
        >
          <ExternalLink size={17} className="text-white" />
          View public site
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-900"
        >
          <LogOut size={17} className="text-white" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-zinc-800 bg-zinc-950 lg:block">{sidebar}</aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-zinc-950/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-zinc-800 bg-zinc-950 lg:hidden">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-4 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-900 hover:text-white"
            >
              <X size={18} />
            </button>
            {sidebar}
          </aside>
        </>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur">
          <div className="flex items-center gap-4 px-5 py-3.5 sm:px-8">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
              className="rounded-lg border border-zinc-300 p-2 text-zinc-600 transition hover:border-zinc-900 hover:text-zinc-900 lg:hidden"
            >
              <Menu size={18} />
            </button>

            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Admin
                <ChevronRight size={11} />
                {current?.label || "Dashboard"}
              </p>
              <h1 className="truncate text-lg font-bold tracking-tight text-zinc-900">
                {current?.label || "Dashboard"}
              </h1>
            </div>

            <span className="hidden items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 sm:inline-flex">
              <Activity size={13} />
              Live
            </span>
            <Link
              href="/admin/reports"
              className="hidden items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900 sm:inline-flex"
            >
              <BarChart3 size={14} />
              Reports
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-5 py-7 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
