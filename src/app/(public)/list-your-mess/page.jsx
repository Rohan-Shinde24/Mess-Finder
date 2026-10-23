import Link from "next/link";
import {
  Store,
  ClipboardCheck,
  ImagePlus,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Utensils,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Clock3,
  Star,
  ChevronRight,
} from "lucide-react";
import { openGraph } from "../../../lib/seo";

export const metadata = {
  title: "List Your Mess Free and Reach Nearby Diners Daily",
  description:
    "List your mess on MessFinder for free and get admin approval. Show your weekly menu, meal plans and prices to people searching for food nearby.",
  keywords: [
    "list your mess",
    "add mess listing",
    "register tiffin service",
    "mess owner signup",
    "free mess listing",
    "promote tiffin business",
    "mess listing india",
    "list food business online",
  ],
  alternates: { canonical: "/list-your-mess" },
  openGraph: openGraph({
    title: "List Your Mess Free and Reach Nearby Diners Daily",
    description:
      "List your mess on MessFinder for free and get admin approval. Show your weekly menu, meal plans and prices to people searching for food nearby.",
    url: "/list-your-mess",
  }),
};

const benefits = [
  {
    icon: Store,
    number: "01",
    title: "Create your listing",
    description:
      "Add your mess name, location, contact information, meal plans and prices.",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: ImagePlus,
    number: "02",
    title: "Showcase your food",
    description:
      "Add food photos, weekly menus and meal options to help customers explore your offerings.",
    color: "bg-orange-50 text-orange-700",
  },
  {
    icon: ClipboardCheck,
    number: "03",
    title: "Get reviewed",
    description:
      "Your listing is reviewed by the MessFinder team before it appears publicly.",
    color: "bg-blue-50 text-blue-700",
  },
];

const highlights = [
  "Reach people searching for nearby mess services",
  "Show your food, menu and prices",
  "Help customers make informed choices",
  "Keep your business details in one place",
];

export default function ListYourMessPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#faf9f6]">
        <div
          aria-hidden="true"
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-12 lg:py-24">
          {/* LEFT CONTENT */}
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3.5 py-2 text-xs font-bold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              FOR MESS OWNERS
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-[60px]">
              Turn your food into
              <span className="block text-emerald-700">
                a local favourite.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              Bring your mess online with MessFinder. Show people what you
              serve, share your meal plans and make it easier for nearby
              customers to find you.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/owner/register"
                className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
              >
                List your mess
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/owner/login"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50"
              >
                Already registered? Log in
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-t border-slate-200 pt-6 text-xs font-medium text-slate-600 sm:text-sm">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-700" />
                Simple setup
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-emerald-700" />
                Listing review
              </span>
              <span className="flex items-center gap-2">
                <Clock3 size={17} className="text-emerald-700" />
                Easy to manage
              </span>
            </div>
          </div>

          {/* LISTING PREVIEW */}
          <div className="relative mx-auto w-full max-w-lg lg:ml-auto">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/[0.06]">
              {/* Preview header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    MessFinder
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Example business listing
                  </p>
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Preview
                </span>
              </div>

              {/* Food image */}
              <div className="relative h-52 overflow-hidden bg-[#f0eee7] sm:h-64">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/veg.png"
                  alt="Indian vegetarian meal served in a thali"
                  className="h-full w-full object-cover object-center"
                />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-5 pb-5 pt-12">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                    <span className="h-2 w-2 rounded-full bg-emerald-600" />
                    FOOD LISTING
                  </span>
                  <p className="mt-2 text-xl font-bold text-white sm:text-2xl">
                    Your Mess Name
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-white/90">
                    <MapPin size={14} />
                    Your area, your city
                  </p>
                </div>
              </div>

              {/* Preview details */}
              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      What you can display
                    </p>
                    <p className="mt-1.5 text-sm font-bold text-slate-900">
                      Food, menus and meal plans
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
                    <Star size={14} />
                    Customer reviews
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2.5">
                  <div className="rounded-xl bg-emerald-50/80 p-3">
                    <Utensils size={20} className="text-emerald-700" />
                    <p className="mt-3 text-xs font-bold text-slate-900">
                      Meal plans
                    </p>
                    <p className="mt-1 text-[10px] leading-4 text-slate-500">
                      Your offerings
                    </p>
                  </div>

                  <div className="rounded-xl bg-orange-50/80 p-3">
                    <ImagePlus size={20} className="text-orange-700" />
                    <p className="mt-3 text-xs font-bold text-slate-900">
                      Food photos
                    </p>
                    <p className="mt-1 text-[10px] leading-4 text-slate-500">
                      Your dishes
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-50/80 p-3">
                    <TrendingUp size={20} className="text-blue-700" />
                    <p className="mt-3 text-xs font-bold text-slate-900">
                      Visibility
                    </p>
                    <p className="mt-1 text-[10px] leading-4 text-slate-500">
                      Local discovery
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-slate-200 px-3.5 py-3">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-700"
                  />
                  <p className="text-xs leading-5 text-slate-600">
                    Your listing will be reviewed before becoming publicly
                    visible.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-3 text-center text-xs text-slate-400">
              Illustrative preview. Actual listings depend on submitted details.
            </p>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
              Getting started
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Your mess, online in three steps
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Set up your business listing with the information customers
              need to make their choice.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3">
            {benefits.map(({ icon: Icon, number, title, description, color }) => (
              <article
                key={number}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-900/[0.04] sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}
                  >
                    <Icon size={23} strokeWidth={1.8} />
                  </span>

                  <span className="text-3xl font-extrabold tracking-tight text-slate-200">
                    {number}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-bold tracking-tight text-slate-900">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <span>Step {number}</span>
                  <ChevronRight size={15} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHY JOIN */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid overflow-hidden rounded-3xl bg-[#173e32] lg:grid-cols-[1fr_0.9fr]">
            <div className="p-7 sm:p-10 lg:p-14">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
                <Sparkles size={14} />
                For local food businesses
              </span>

              <h2 className="mt-5 max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
                Help more people discover your food.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-emerald-50/80 sm:text-base">
                Give nearby customers a clear view of your food options,
                pricing and meal plans so they can decide whether your mess
                is right for them.
              </p>

              <Link
                href="/owner/register"
                className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-900 transition hover:bg-emerald-50"
              >
                Get started
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="flex items-center bg-white/[0.04] p-6 sm:p-9 lg:p-10">
              <div className="grid w-full gap-3 sm:grid-cols-2">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.05] p-4"
                  >
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-emerald-300"
                    />
                    <p className="text-sm leading-6 text-white/90">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-slate-200 bg-[#faf9f6] px-5 py-14 text-center sm:px-8 sm:py-16">
        <div className="mx-auto max-w-2xl">
          <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-emerald-700">
            Start today
          </span>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Ready to list your mess?
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
            Create your account and share your food business with people
            looking for meals nearby.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/owner/register"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-800"
            >
              Create an account
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/owner/login"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}