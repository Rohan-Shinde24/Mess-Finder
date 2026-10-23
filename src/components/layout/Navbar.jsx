
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ArrowRight,
  MapPin,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
} from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "List Your Mess", href: "/list-your-mess" },
  { label: "Support", href: "/support" },
];

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function NavLabel({ label, active = false }) {
  return (
    <span className="relative inline-flex items-center">
      <span
        className={`transition-colors duration-200 ${
          active
            ? "text-green-700"
            : "text-slate-700 group-hover:text-green-700"
        }`}
      >
        {label}
      </span>

      <span
        aria-hidden="true"
        className={`ml-1 font-bold text-green-700 transition-opacity duration-200 ${
          active
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100"
        }`}
      >
        ]
      </span>

      <span
        aria-hidden="true"
        className={`absolute -left-2 font-bold text-green-700 transition-opacity duration-200 ${
          active
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100"
        }`}
      >
        [
      </span>
    </span>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const accountRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) {
          setUser(data.success ? data.user : null);
        }
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    function onClickOutside(event) {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setAccountOpen(false);
      }
    }

    document.addEventListener("mousedown", onClickOutside);

    return () => {
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  function closeMenu() {
    setOpen(false);
  }

  async function logout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUser(null);
      setAccountOpen(false);
      setOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Unable to log out:", error);
    }
  }

  const dashboard =
    user?.role === "admin"
      ? { href: "/admin", label: "Admin panel" }
      : user?.role === "owner"
        ? { href: "/owner/dashboard", label: "Dashboard" }
        : null;

  function isActive(href) {
    return (
      pathname === href ||
      (href !== "/" && pathname.startsWith(`${href}/`))
    );
  }

  const navLinkClass =
    "group relative inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        {/* Website logo */}
        <Link
          href="/"
          onClick={closeMenu}
          aria-label="MessFinder home"
          className="group flex shrink-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
        >
          <Image
            src="/images/weblogo.png"
            alt="MessFinder — find mess and tiffin services near you"
            width={160}
            height={54}
            priority
            className="h-auto max-h-12 w-auto max-w-[145px] object-contain transition-opacity duration-200 group-hover:opacity-80 sm:max-w-[160px]"
          />
        </Link>

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          {links.map(({ label, href }) => {
            const active = isActive(href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`${navLinkClass} ${
                  active ? "bg-green-50" : "hover:bg-green-50/70"
                }`}
              >
                <NavLabel label={label} active={active} />
              </Link>
            );
          })}

          <span
            aria-hidden="true"
            className="mx-2 h-7 w-px bg-slate-200"
          />

          {!ready ? (
            <span className="h-10 w-24 animate-pulse rounded-xl bg-slate-100" />
          ) : user ? (
            <>
              {dashboard && (
                <Link
                  href={dashboard.href}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive(dashboard.href)
                      ? "bg-green-50 text-green-700"
                      : "text-slate-700 hover:bg-green-50 hover:text-green-700"
                  }`}
                >
                  {user.role === "admin" ? (
                    <ShieldCheck size={17} />
                  ) : (
                    <LayoutDashboard size={17} />
                  )}
                  {dashboard.label}
                </Link>
              )}

              <div className="relative ml-1" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => setAccountOpen((prev) => !prev)}
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white py-2 pl-2 pr-3 transition hover:border-green-300 hover:bg-green-50"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-700 text-xs font-bold text-white">
                    {initials(user.name) || "U"}
                  </span>

                  <span className="max-w-32 truncate text-sm font-semibold text-slate-800">
                    {user.name}
                  </span>

                  <ChevronDown
                    size={15}
                    className={`text-slate-500 transition-transform ${
                      accountOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {accountOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10"
                  >
                    <div className="px-3 py-2.5">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-slate-500">
                        {user.email}
                      </p>

                      <span className="mt-2 inline-flex rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold capitalize text-green-700">
                        {user.role === "owner" ? "Mess owner" : user.role}
                      </span>
                    </div>

                    <div className="my-1 h-px bg-slate-100" />

                    {dashboard && (
                      <Link
                        href={dashboard.href}
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-green-50 hover:text-green-700"
                      >
                        <LayoutDashboard size={16} />
                        {dashboard.label}
                      </Link>
                    )}

                    <Link
                      href="/"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-green-50 hover:text-green-700"
                    >
                      <MapPin size={16} />
                      Browse messes
                    </Link>

                    <button
                      type="button"
                      onClick={logout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={`${navLinkClass} hover:bg-green-50/70`}
              >
                <NavLabel label="Log in" />
              </Link>

              {/* Get Started: white to green on hover */}
              <Link
                href="/register"
                className="group ml-1 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-green-700 bg-white px-5 py-2.5 text-sm font-bold text-green-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-700 hover:text-white hover:shadow-lg hover:shadow-green-700/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
              >
                Get Started
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={`flex h-11 w-11 items-center justify-center rounded-xl border transition md:hidden ${
            open
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-slate-200 bg-white text-slate-700 hover:border-green-300 hover:text-green-700"
          }`}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {/* Mobile navigation */}
      <div
        id="mobile-navigation"
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out md:hidden ${
          open
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0"
        }`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="min-h-0 overflow-hidden">
          <nav
            className="border-t border-slate-100 bg-white px-5 pb-5 pt-4 sm:px-8"
            aria-label="Mobile navigation"
          >
            {user && (
              <div className="mb-4 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-700 text-sm font-bold text-white">
                  {initials(user.name) || "U"}
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {user.name}
                  </p>
                  <p className="truncate text-xs capitalize text-slate-500">
                    {user.role === "owner" ? "Mess owner" : user.role}
                  </p>
                </div>
              </div>
            )}

            {!user && (
              <div className="mb-4 flex items-center gap-3 rounded-2xl bg-green-50 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-green-700">
                  <MapPin size={20} />
                </span>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Find your everyday meals
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Explore local meal options.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-1">
              {links.map(({ label, href }) => {
                const active = isActive(href);

                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={`group flex min-h-12 items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-green-50 text-green-700"
                        : "text-slate-700 hover:bg-green-50 hover:text-green-700"
                    }`}
                  >
                    <NavLabel label={label} active={active} />

                    <ChevronRight
                      size={17}
                      className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 "
                    />
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
              {user ? (
                <div className="grid gap-3">
                  {dashboard && (
                    <Link
                      href={dashboard.href}
                      onClick={closeMenu}
                      className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-bold text-white transition"
                    >
                      {user.role === "admin" ? (
                        <ShieldCheck size={16} />
                      ) : (
                        <LayoutDashboard size={16} />
                      )}
                      {dashboard.label}
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={logout}
                    className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-green-300 "
                  >
                    Log in
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="group flex min-h-12 items-center justify-center gap-2 rounded-xl border border-green-700 bg-white px-4 py-3 text-sm font-bold text-green-700 transition hover: hover:text-white"
                  >
                    Get Started
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
