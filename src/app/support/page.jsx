
"use client";

import { useState } from "react";
import {
  Headphones,
  MessageSquareText,
  UserRound,
  Store,
  Star,
  Wrench,
  Megaphone,
  CircleHelp,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Clock3,
  Send,
  TicketCheck,
} from "lucide-react";

const categories = [
  { value: "account", label: "Account", icon: UserRound },
  { value: "listing", label: "Mess listing", icon: Store },
  { value: "review", label: "Review", icon: Star },
  { value: "technical", label: "Technical issue", icon: Wrench },
  { value: "advertisement", label: "Advertisement", icon: Megaphone },
  { value: "other", label: "Other", icon: CircleHelp },
];

export default function SupportPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");
  const [busy, setBusy] = useState(false);
  const [category, setCategory] = useState("other");

  async function submit(e) {
    e.preventDefault();

    if (busy) return;

    setBusy(true);
    setError("");
    setSuccess("");
    setTicketNumber("");

    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      const r = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });

      const d = await r.json();

      if (!r.ok) {
        throw new Error(d.message || "Could not create ticket.");
      }

      const number = d.ticket?.ticketNumber;

      setTicketNumber(number || "");
      setSuccess(
        number
          ? `Ticket ${number} created successfully.`
          : "Your support ticket has been created successfully."
      );

      form.reset();
      setCategory("other");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7fdf9] text-slate-900">
      {/* Hero */}
      <section className="relative border-b border-green-100 bg-gradient-to-br from-green-50 via-white to-emerald-50">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-green-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-4 py-2 text-sm font-semibold text-green-700 shadow-sm">
            <Headphones size={17} />
            MessFinder Help Center
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            How can we
            <span className="text-green-600"> help you?</span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Having trouble with your account, mess listing, or something else?
            Tell us what happened and our support team will help you.
          </p>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
            <span className="flex items-center gap-2">
              <ShieldCheck size={17} className="text-green-600" />
              Private support requests
            </span>
            <span className="flex items-center gap-2">
              <TicketCheck size={17} className="text-green-600" />
              Track your ticket number
            </span>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10 lg:px-12">
        {/* Form */}
        <div className="min-w-0">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex items-start gap-4 border-b border-slate-100 pb-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                <MessageSquareText size={24} />
              </div>

              <div>
                <h2 className="text-xl font-extrabold sm:text-2xl">
                  Create a support ticket
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Describe your issue below. Fields marked with * are required.
                </p>
              </div>
            </div>

            <form onSubmit={submit} className="mt-7 space-y-6">
              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Subject <span className="text-green-600">*</span>
                </label>

                <input
                  id="subject"
                  required
                  minLength={3}
                  maxLength={160}
                  name="subject"
                  placeholder="Briefly describe your issue"
                  className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Keep it short and specific.
                </p>
              </div>

              {/* Category */}
              <fieldset>
                <legend className="mb-3 text-sm font-bold text-slate-800">
                  What do you need help with?{" "}
                  <span className="text-green-600">*</span>
                </legend>

                <input
                  type="hidden"
                  name="category"
                  value={category}
                />

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {categories.map(({ value, label, icon: Icon }) => {
                    const selected = category === value;

                    return (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setCategory(value)}
                        className={`relative flex min-h-[94px] flex-col items-start justify-between gap-3 rounded-2xl border p-4 text-left transition ${
                          selected
                            ? "border-green-500 bg-green-50 text-green-800 ring-2 ring-green-500/10"
                            : "border-slate-200 bg-white text-slate-600 hover:border-green-200 hover:bg-green-50/50"
                        }`}
                      >
                        <Icon size={21} />
                        <span className="text-xs font-bold sm:text-sm">
                          {label}
                        </span>

                        {selected && (
                          <CheckCircle2
                            size={16}
                            className="absolute right-3 top-3 text-green-600"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Tell us more <span className="text-green-600">*</span>
                </label>

                <textarea
                  id="message"
                  required
                  minLength={3}
                  maxLength={5000}
                  name="message"
                  rows={6}
                  placeholder="Explain what happened, what you expected, and any steps you have already tried..."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                />

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Please avoid sharing passwords or other sensitive
                  information.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  <AlertCircle size={20} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold">Unable to submit your ticket</p>
                    <p className="mt-1 leading-6">{error}</p>
                  </div>
                </div>
              )}

              {/* Success */}
              {success && (
                <div
                  role="status"
                  aria-live="polite"
                  className="rounded-2xl border border-green-200 bg-green-50 p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                      <CheckCircle2 size={23} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-extrabold text-green-900">
                        Ticket created successfully!
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-green-800">
                        {success}
                      </p>

                      {ticketNumber && (
                        <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-3 py-2 text-sm font-bold text-green-900">
                          <TicketCheck size={17} />
                          {ticketNumber}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="border-t border-slate-100 pt-5">
                <button
                  type="submit"
                  disabled={busy}
                  className="group inline-flex min-h-13 w-full items-center justify-center gap-3 rounded-xl bg-green-600 px-6 py-4 font-bold text-white shadow-lg shadow-green-600/15 transition hover:bg-green-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {busy ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Creating ticket...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Submit support ticket
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>

                <p className="mt-3 text-xs leading-5 text-slate-400">
                  You must be logged in to create a support ticket.
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          <div className="rounded-3xl bg-slate-950 p-6 text-white sm:p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/15 text-green-400">
              <Headphones size={26} />
            </div>

            <h2 className="mt-5 text-xl font-extrabold">
              We're here to help
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-300">
              Give us the details of your problem so your request can be
              reviewed by the support team.
            </p>

            <div className="mt-6 flex items-start gap-3 border-t border-white/10 pt-5">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-green-400"
              />
              <div>
                <p className="text-sm font-bold">Your request matters</p>
                <p className="mt-1 text-xs leading-6 text-slate-400">
                  Include clear details to help the team understand your issue.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7">
            <h3 className="font-extrabold">Before submitting</h3>

            <div className="mt-5 space-y-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <MessageSquareText size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold">Be specific</p>
                  <p className="mt-1 text-xs leading-6 text-slate-500">
                    Explain the issue and include any relevant details.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <TicketCheck size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold">Keep your ticket number</p>
                  <p className="mt-1 text-xs leading-6 text-slate-500">
                    Save it after submission for future reference.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Clock3 size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold">Allow time for review</p>
                  <p className="mt-1 text-xs leading-6 text-slate-500">
                    The support team may need time to review your request.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-green-100 bg-green-50/70 p-5">
            <div className="flex items-center gap-2 text-green-800">
              <ShieldCheck size={19} />
              <p className="text-sm font-bold">Account protection</p>
            </div>
            <p className="mt-2 text-xs leading-6 text-slate-600">
              Never include your password, OTP, payment PIN, or other
              confidential credentials in a support message.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}
