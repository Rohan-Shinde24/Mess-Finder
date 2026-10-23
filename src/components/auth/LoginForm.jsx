"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Mail, Lock, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LoginForm({
  role,
  redirectTo = "auto",
  title = "Welcome back",
  subtitle = "Log in to continue to your MessFinder account.",
  footer = null,
  successMessage = "Account created. You can log in now.",
}) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function destination(userRole) {
    if (redirectTo && redirectTo !== "auto") return redirectTo;
    if (userRole === "admin") return "/admin";
    if (userRole === "owner") return "/owner/dashboard";
    return next || "/";
  }

  async function submit(values) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(role ? { ...values, role } : values),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");
      router.push(destination(data.user?.role));
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5 sm:p-9">
      <h1 className="text-3xl font-black tracking-tight text-slate-950">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>

      {params.get("registered") && (
        <p className="mt-5 flex items-start gap-2 rounded-xl bg-green-50 p-3.5 text-sm font-medium text-green-800">
          <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
          {successMessage}
        </p>
      )}

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(submit)}>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-slate-700">Email</span>
          <span className="relative block">
            <Mail size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="field field-icon"
              {...register("email", { required: "Email is required" })}
            />
          </span>
          {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>}
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-slate-700">Password</span>
          <span className="relative block">
            <Lock size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className="field field-icon"
              {...register("password", { required: "Password is required" })}
            />
          </span>
          {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password.message}</p>}
        </label>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 p-3.5 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <button type="submit" disabled={busy} className="btn w-full">
          {busy ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>

      <div className="mt-5 flex items-center justify-between gap-3 text-sm">
        <Link href="/forgot-password" className="font-semibold text-slate-500 transition hover:text-green-600">
          Forgot password?
        </Link>
      </div>

      {footer && <div className="mt-6 border-t border-slate-100 pt-5 text-sm text-slate-600">{footer}</div>}
    </div>
  );
}
