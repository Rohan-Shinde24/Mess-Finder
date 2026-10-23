import Link from "next/link";
import {
  Megaphone,
  Phone,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  ImagePlus,
  Link2,
  MapPin,
  Clock3,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Star,
} from "lucide-react";
import { PlaceholderSlide } from "../../../components/layout/AdvertisementCarousel";
import { openGraph } from "../../../lib/seo";

export const metadata = {
  title: "Advertise Your Food Business for ₹500 a Month",
  description:
    "Promote your mess or local food business with a rotating ad slide on the Find-A-Mess page. Reach people searching for meals nearby for ₹500 a month.",
  keywords: [
    "advertise your mess",
    "mess advertising",
    "promote tiffin service",
    "local food business ads",
    "banner ad for mess",
    "mess marketing india",
    "advertise food business",
    "mess ad slot",
  ],
  alternates: { canonical: "/advertise" },
  openGraph: openGraph({
    title: "Advertise Your Food Business for ₹500 a Month",
    description:
      "Promote your mess or local food business with a rotating ad slide on the Find-A-Mess page. Reach people searching for meals nearby for ₹500 a month.",
    url: "/advertise",
  }),
};

const included = [
  "One of the 4 rotating slides on the Find-A-Mess page",
  "Your image and headline, front and centre",
  "A link to your website or phone number",
  "Visible to every visitor who browses messes",
  'A clear "Sponsored" label to build trust',
];

const steps = [
  {
    icon: Phone,
    number: "01",
    title: "Call or WhatsApp us",
    description: "Tell us what you do and we'll confirm your slot. It takes a couple of minutes.",
  },
  {
    icon: ImagePlus,
    number: "02",
    title: "Send us your image and link",
    description: "Share a clear banner image plus the website or phone number you want people to reach.",
  },
  {
    icon: TrendingUp,
    number: "03",
    title: "We publish your slide on rotation",
    description: "Your ad goes live on the homepage carousel and rotates automatically for every visitor.",
  },
];

const slots = [1, 2, 3, 4];

export default function AdvertisePage() {
  return (
    <main className="bg-[#f7fdf9]">
      {/* Hero */}
      <section className="container py-12">
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-green-100 px-6 py-12 sm:px-10 sm:py-16" data-reveal>
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-green-50 via-white to-emerald-50/70" />
          <div className="absolute -right-20 -top-16 -z-10 h-64 w-64 rounded-full bg-green-200/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 -z-10 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl" />

          <div className="relative max-w-3xl">
            <span className="pill">
              <Megaphone size={14} />
              ADVERTISE ON MESSFINDER
            </span>

            <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Reach hungry
              <span className="block text-green-600">local diners.</span>
            </h1>

            <p className="muted mt-5 max-w-2xl text-base leading-8 sm:text-lg">
              Every day people come to MessFinder to find their next meal. Put your business in front of
              them with a bright, rotating ad slide at the top of the Find-A-Mess page.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="tel:9529942455" className="btn">
                <Phone size={18} />
                Call 9529942455
              </a>
              <a
                href="https://wa.me/919529942455"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <MessageCircle size={18} />
                WhatsApp us
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-green-600" />
                No long contracts
              </span>
              <span className="flex items-center gap-2">
                <Sparkles size={17} className="text-green-600" />
                Live within a day
              </span>
              <span className="flex items-center gap-2">
                <Star size={17} fill="currentColor" className="text-amber-500" />
                Simple monthly pricing
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container pb-4" data-reveal>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="eyebrow">Simple pricing</span>
          <h2 className="section-title mt-3">One plan, everything included</h2>
          <p className="subtitle mx-auto mt-4">
            No setup fees, no hidden charges. Just a single monthly rate to keep your business in front of
            local diners.
          </p>
        </div>

        <div className="relative mx-auto max-w-xl overflow-hidden rounded-[2rem] border-2 border-green-500 bg-white p-8 shadow-2xl shadow-green-900/10 sm:p-10">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-green-100/60 blur-3xl" />

          <span className="absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-green-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
            <Star size={13} fill="currentColor" />
            Recommended
          </span>

          <div className="relative">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
              <Megaphone size={24} />
            </span>

            <p className="mt-5 flex items-end gap-2">
              <span className="text-5xl font-black tracking-tight text-slate-950">₹500</span>
              <span className="pb-1 text-sm font-bold text-slate-500">/ month</span>
            </p>

            <p className="muted mt-2 text-sm">Homepage banner slot on the Find-A-Mess page.</p>

            <ul className="mt-7 space-y-3">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-700">
                  <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-green-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="tel:9529942455" className="btn flex-1">
                <Phone size={18} />
                Call 9529942455
              </a>
              <a
                href="https://wa.me/919529942455"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex-1"
              >
                <MessageCircle size={18} />
                WhatsApp us
              </a>
            </div>

            <p className="muted mt-4 text-center text-xs">
              Slots are limited to 4 at a time and rotate automatically.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container py-16" data-reveal>
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">How it works</span>
          <h2 className="section-title mt-3">Your ad live in 3 easy steps</h2>
          <p className="subtitle mx-auto mt-4">
            You don&apos;t need a design team or an account. We handle the setup for you.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map(({ icon: Icon, number, title, description }) => (
            <article
              key={number}
              className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-green-900/5 sm:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                  <Icon size={25} strokeWidth={1.8} />
                </span>
                <span className="text-3xl font-black text-slate-100">{number}</span>
              </div>
              <h3 className="mt-6 text-xl font-extrabold text-slate-900">{title}</h3>
              <p className="muted mt-3 text-sm leading-7">{description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Where your ad appears */}
      <section className="container pb-16" data-reveal>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="eyebrow">Where your ad appears</span>
          <h2 className="section-title mt-3">Four prime spots, one rotating banner</h2>
          <p className="subtitle mx-auto mt-4">
            This is exactly how the carousel looks on the Find-A-Mess page. Your slide takes one of the
            four spaces shown below.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {slots.map((slot) => (
            <div key={slot} className="relative overflow-hidden rounded-[2rem] shadow-lg shadow-slate-900/5">
              <div className="h-[220px]">
                <PlaceholderSlide />
              </div>
              <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm">
                <MapPin size={13} />
                Slot {slot}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="container pb-20" data-reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-green-950 px-6 py-12 text-white sm:px-10 sm:py-14 lg:px-14">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-green-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-green-300">
                <Phone size={14} />
                Talk to us today
              </span>

              <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
                Ready to book your slide?
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-green-50/80">
                Get in touch and we&apos;ll have your ad rotating on the Find-A-Mess page in no time.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="tel:9529942455" className="btn">
                  <Phone size={18} />
                  Call 9529942455
                </a>
                <a
                  href="https://wa.me/919529942455"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/5"
                >
                  <MessageCircle size={18} />
                  WhatsApp us
                </a>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-300">Contact person</p>
              <p className="mt-3 text-2xl font-black">Rohan Shinde</p>

              <div className="mt-5 space-y-3">
                <a
                  href="tel:9529942455"
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.08]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/15 text-green-300">
                    <Phone size={19} />
                  </span>
                  <span>
                    <span className="block text-xs text-green-50/60">Phone</span>
                    <span className="font-bold">9529942455</span>
                  </span>
                </a>

                <a
                  href="https://wa.me/919529942455"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.08]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/15 text-green-300">
                    <MessageCircle size={19} />
                  </span>
                  <span>
                    <span className="block text-xs text-green-50/60">WhatsApp</span>
                    <span className="font-bold">Chat with us</span>
                  </span>
                </a>
              </div>

              <p className="mt-5 flex items-start gap-2 text-sm leading-6 text-green-50/70">
                <Clock3 size={17} className="mt-0.5 shrink-0 text-green-300" />
                Available every day, 9 AM – 9 PM IST. Leave a message and we&apos;ll call you back.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom link back to browsing */}
      <section className="border-t border-slate-200 bg-white">
        <div className="container flex flex-col gap-4 py-12 sm:flex-row sm:items-center sm:justify-between" data-reveal>
          <div className="flex items-start gap-3">
            <ImagePlus size={20} className="mt-0.5 shrink-0 text-green-600" />
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Still browsing?</h2>
              <p className="muted mt-1 max-w-xl text-sm leading-6">
                See how your ad will sit alongside real mess listings on the Find-A-Mess page.
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold text-green-700 hover:text-green-800"
          >
            <Link2 size={17} />
            View the Find-A-Mess page
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
