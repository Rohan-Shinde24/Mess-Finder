"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function RegisterForm({
  role = "user",
  redirectHref = "/login?registered=1",
  title = "Create your account",
  subtitle = "Join MessFinder with your email address.",
  nameLabel = "Full name",
  submitLabel = "Create account",
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function submit(values) {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, role }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
      router.push(redirectHref);
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

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(submit)}>
        <label className="block">
          <span className="mb-1.5 block text-sm font-bold text-slate-700">{nameLabel}</span>
          <span className="relative block">
            <User size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Your name"
              autoComplete="name"
              className="field field-icon"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 2, message: "At least 2 characters" },
              })}
            />
          </span>
          {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name.message}</p>}
        </label>

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
              autoComplete="new-password"
              placeholder="At least 8 characters"
              className="field field-icon"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Use at least 8 characters" },
              })}
            />
          </span>
          {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password.message}</p>}
        </label>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 p-3.5 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <p className="text-xs leading-5 text-slate-500">
          By creating an account you agree to our{" "}
          <Link
            href="/terms"
            className="font-bold text-green-700 underline decoration-green-300 underline-offset-2 transition hover:text-green-800"
          >
            Terms &amp; Conditions
          </Link>{" "}
          and our{" "}
          <Link
            href="/privacy-policy"
            className="font-bold text-green-700 underline decoration-green-300 underline-offset-2 transition hover:text-green-800"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <button type="submit" disabled={busy} className="btn w-full">
          {busy ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
          {busy ? "Creating account…" : submitLabel}
        </button>
      </form>
    </div>
  );
}
