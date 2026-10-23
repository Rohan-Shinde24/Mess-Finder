"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, Check, X } from "lucide-react";

const COOKIE_NAME = "messfinder_cookie_choice";
const MAX_AGE = 60 * 60 * 24 * 180;

function readChoice() {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!readChoice()) setVisible(true);
  }, []);

  function choose(value) {
    document.cookie = `${COOKIE_NAME}=${value}; max-age=${MAX_AGE}; path=/; SameSite=Lax`;
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-4 bottom-4 z-[60] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:max-w-md"
    >
      <div className="rounded-3xl border border-green-100 bg-white/95 p-5 shadow-2xl shadow-green-900/10 backdrop-blur-xl sm:p-6">
        <div className="flex items-start gap-3.5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-600">
            <Cookie size={21} strokeWidth={2} />
          </span>

          <div className="min-w-0">
            <p className="text-sm font-black text-slate-900">A quick note about cookies</p>
            <p className="mt-1.5 text-sm leading-6 text-slate-600">
              We use cookies to keep you signed in and to understand how the site is used. You can
              accept them or carry on with only the essential ones. Read our{" "}
              <Link
                href="/cookie-policy"
                className="font-bold text-green-700 underline decoration-green-300 underline-offset-2 transition hover:text-green-800"
              >
                Cookie Policy
              </Link>
              .
            </p>
          </div>

          <button
            type="button"
            onClick={() => choose("declined")}
            aria-label="Close and use essential cookies only"
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row-reverse">
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-700"
          >
            <Check size={16} />
            Accept all
          </button>

          <button
            type="button"
            onClick={() => choose("declined")}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
