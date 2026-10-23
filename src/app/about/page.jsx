
import Link from "next/link";
import {
  Search,
  MapPin,
  ArrowRight,
  Star,
  ShieldCheck,
  CalendarDays,
  Utensils,
  Clock3,
  Check,
  Sparkles,
  Heart,
} from "lucide-react";
import ParallaxImage from "../../components/layout/ParallaxImage";
import { openGraph } from "../../lib/seo";

export const metadata = {
  title: "About Us: Find a Mess Near You for Daily Meals & Tiffin",
  description:
    "MessFinder helps you find homely mess and tiffin services near you. Browse verified local listings and compare weekly veg or non-veg meal plans.",
  keywords: [
    "about messfinder",
    "mess near me",
    "tiffin service",
    "daily meal subscription",
    "monthly mess plan",
    "veg mess",
    "non veg mess",
    "home style food",
    "mess finder",
  ],
  alternates: { canonical: "/about" },
  openGraph: openGraph({
    title: "About Us: Find a Mess Near You for Daily Meals & Tiffin",
    description:
      "MessFinder helps you find homely mess and tiffin services near you. Browse verified local listings and compare weekly veg or non-veg meal plans.",
    url: "/about",
  }),
};

const foodImages = {
  veg: "/images/veg.png",
  nonVeg: "/images/nonveg.png",
};

const weeklyMeals = [
  { day: "MON", meal: "Dal & Roti", color: "bg-orange-50 text-orange-700" },
  { day: "TUE", meal: "Veg Thali", color: "bg-green-50 text-green-700" },
  { day: "WED", meal: "Rice & Curry", color: "bg-blue-50 text-blue-700" },
  { day: "THU", meal: "Paneer Meal", color: "bg-yellow-50 text-yellow-700" },
  { day: "FRI", meal: "Special Thali", color: "bg-rose-50 text-rose-700" },
  { day: "SAT", meal: "Weekend Meal", color: "bg-purple-50 text-purple-700" },
];

const steps = [
  {
    number: "01",
    title: "Discover nearby messes",
    description:
      "Explore mess services near your home, college or workplace.",
    icon: MapPin,
    theme: "bg-blue-100 text-blue-700",
    badge: "bg-blue-600",
    tag: "START HERE",
  },
  {
    number: "02",
    title: "Explore meals & menus",
    description:
      "Compare available food options, prices and menu details before deciding.",
    icon: Utensils,
    theme: "bg-orange-100 text-orange-700",
    badge: "bg-orange-500",
    tag: "FIND YOUR FAVOURITE",
  },
  {
    number: "03",
    title: "Choose your mess",
    description:
      "Check available reviews and contact the mess that suits your needs.",
    icon: Check,
    theme: "bg-green-100 text-green-700",
    badge: "bg-green-700",
    tag: "READY TO EAT",
  },
];

function FoodCategory({
  type,
  title,
  description,
  image,
  href,
  accent,
  badge,
  features,
}) {
  return (
    <Link
      href={href}
      className={`group relative isolate flex min-h-[310px] flex-col overflow-hidden rounded-[26px] border ${accent.border} ${accent.background} p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:min-h-[340px] sm:p-7`}
    >
      {/* Decorative background shapes */}
      <div
        aria-hidden="true"
        className={`absolute -right-12 -top-12 -z-10 h-44 w-44 rounded-full ${accent.shape} opacity-60 transition-transform duration-500 group-hover:scale-110`}
      />

      <div
        aria-hidden="true"
        className={`absolute -bottom-12 -left-10 -z-10 h-32 w-32 rounded-full ${accent.smallShape} opacity-70`}
      />

      <div className="relative z-10 flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-2 rounded-full border border-white bg-white/90 px-3 py-1.5 text-[10px] font-bold tracking-wide ${accent.text} shadow-sm sm:text-xs`}
        >
          <span className={`h-2 w-2 rounded-full ${accent.dot}`} />
          {badge}
        </span>

        <span className="text-[10px] font-semibold text-slate-500 sm:text-xs">
          {type}
        </span>
      </div>

      <div className="relative z-10 mt-5 grid flex-1 grid-cols-[minmax(0,1fr)_120px] items-center gap-3 sm:grid-cols-[minmax(0,1fr)_155px] sm:gap-5">
        {/* Category text */}
        <div className="min-w-0 py-1">
          <h3 className="text-xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-2xl lg:text-[28px]">
            {title}
          </h3>

          <p className="mt-2 max-w-[240px] text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">
            {description}
          </p>

          <div className="mt-4 space-y-2">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-2 text-[11px] font-medium leading-5 text-slate-700 sm:text-xs"
              >
                <span
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${accent.checkBg}`}
                >
                  <Check size={10} />
                </span>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <span
            className={`mt-5 inline-flex items-center gap-2 text-xs font-bold sm:text-sm ${accent.text}`}
          >
            Explore meals
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>

        {/* Centered circular food image */}
        <div className="relative mx-auto flex aspect-square w-full max-w-[120px] items-center justify-center sm:max-w-[155px] lg:max-w-[175px]">
          <div
            aria-hidden="true"
            className={`absolute inset-1 translate-x-2 translate-y-2 rounded-full ${accent.ring}`}
          />

          <div className="relative z-10 flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-lg shadow-slate-900/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="block h-full w-full rounded-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          <span className="absolute -bottom-1 -left-2 z-20 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-white shadow-md">
            <Heart size={16} className={accent.heart} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-white text-slate-900">
      {/* HERO */}
      <section className="relative isolate flex min-h-[540px] items-center overflow-hidden bg-[#fffaf2] sm:min-h-[590px] lg:min-h-[630px]">
        <ParallaxImage
          src="/images/homescreenbg.png"
          priority
          speed={0.2}
          scale={1.05}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        

        <div className="absolute inset-0 -z-10 bg-[#fffdf8]/90" />

        <div className="mx-auto w-full max-w-5xl px-5 py-16 text-center sm:px-8 sm:py-20">
         

          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-7xl">
            Your next favourite
            <span className="mt-2 block text-green-700">
              meal is closer.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Find homely food around you. Explore local mess services,
            discover delicious meals and check menus before you decide.
          </p>

          <form
            action="/"
            method="GET"
            className="mx-auto mt-9 flex max-w-2xl flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/5 sm:flex-row sm:items-center sm:rounded-full"
          >
            <label className="flex min-h-12 flex-1 items-center gap-3 px-4">
              <MapPin size={20} className="shrink-0 text-red-500" />
              <span className="sr-only">Enter your city or area</span>
              <input
                type="search"
                name="city"
                placeholder="Enter your city or area"
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </label>

            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-700 px-7 text-sm font-bold text-white transition-colors hover:bg-green-800 sm:rounded-full"
            >
              <Search size={18} />
              Find a mess
            </button>
          </form>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-medium text-slate-600 sm:text-sm">
            <span className="flex items-center gap-2">
              <ShieldCheck size={17} className="text-green-700" />
              Local food options
            </span>
            <span className="flex items-center gap-2">
              <Star size={17} className="fill-yellow-400 text-yellow-500" />
              Ratings and reviews
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays size={17} className="text-blue-600" />
              Weekly meal plans
            </span>
          </div>
        </div>
      </section>

    

      {/* FOOD CATEGORIES */}
      <section className="relative bg-[#fafaf8] px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-9 max-w-2xl text-center sm:mb-11">
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-700">
              Made for your everyday
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              What are you craving?
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              From comforting vegetarian thalis to delicious non-veg meals,
              discover food that feels right for you.
            </p>
          </div>

          <div className="grid items-stretch gap-5 md:grid-cols-2 md:gap-7">
            <FoodCategory
              type="01 / FOOD CATEGORY"
              title="Fresh Veg Meals"
              description="Comforting, everyday meals made for your routine."
              image={foodImages.veg}
              href="/?foodType=veg"
              badge="VEG OPTIONS"
              accent={{
                border: "border-green-200",
                background: "bg-[#eff8ed]",
                shape: "bg-green-200",
                smallShape: "bg-yellow-200",
                text: "text-green-800",
                dot: "bg-green-600",
                ring: "bg-green-200",
                checkBg: "bg-green-100 text-green-800",
                heart: "text-green-600",
              }}
              features={[
                "Homely thalis and daily meals",
                "Dal, roti, rice and sabzi",
              ]}
            />

            <FoodCategory
              type="02 / FOOD CATEGORY"
              title="Tasty Non-Veg"
              description="Explore hearty meals with rich flavours."
              image={foodImages.nonVeg}
              href="/?foodType=nonVeg"
              badge="NON-VEG OPTIONS"
              accent={{
                border: "border-orange-200",
                background: "bg-[#fff2e7]",
                shape: "bg-orange-200",
                smallShape: "bg-rose-200",
                text: "text-orange-800",
                dot: "bg-red-600",
                ring: "bg-orange-200",
                checkBg: "bg-orange-100 text-orange-800",
                heart: "text-orange-600",
              }}
              features={[
                "Chicken meals and curries",
                "Rice, roti and meal combos",
              ]}
            />
          </div>

          {/* WEEKLY MEAL PLANNER */}
          <section className="relative mt-7 overflow-hidden rounded-[26px] border border-blue-200 bg-white shadow-sm sm:mt-9">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-blue-100/80"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-20 left-[35%] h-40 w-40 rounded-full bg-yellow-100/70"
            />

            <div className="relative grid lg:grid-cols-[0.85fr_1.15fr]">
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-9">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-700">
                  <CalendarDays size={15} />
                  YOUR WEEK, PLANNED
                </span>

                <h2 className="mt-5 max-w-md text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl">
                  Good meals.
                  <span className="block text-blue-700">All week long.</span>
                </h2>

                <p className="mt-4 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
                  Know what is on the menu before you choose a mess.
                  Compare meal plans and make your week easier.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-xs font-semibold text-green-800">
                    <Check size={14} />
                    Plan ahead
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-800">
                    <Clock3 size={14} />
                    Save time
                  </span>
                </div>

                <Link
                  href="/?view=weekly-menu"
                  className="mt-7 inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800"
                >
                  Explore meal plans
                  <ArrowRight size={17} />
                </Link>
              </div>

              {/* Weekly planner image and menu preview */}
              <div className="relative flex min-w-0 flex-col justify-center p-5 pt-0 sm:p-7 lg:p-8">
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-5">
                    <div>
                      <p className="text-sm font-extrabold text-slate-900">
                        Weekly meal overview
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        A sample menu layout
                      </p>
                    </div>

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-yellow-700">
                      <Utensils size={19} />
                    </span>
                  </div>

                  {/* Your generated weekly meal planner image */}
                  <div className="relative overflow-hidden bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/menuweekly.png"
                      alt="Weekly meal planner with food for each day"
                      loading="lazy"
                      className="block h-auto max-h-[300px] w-full object-contain object-center"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-5">
                    {weeklyMeals.map((item) => (
                      <div
                        key={item.day}
                        className={`rounded-xl p-3 ${item.color}`}
                      >
                        <p className="text-[10px] font-extrabold tracking-wider opacity-80">
                          {item.day}
                        </p>
                        <p className="mt-2 text-xs font-bold leading-5 sm:text-sm">
                          {item.meal}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-start gap-2 border-t border-slate-100 px-4 py-3 text-xs leading-5 text-slate-500 sm:px-5">
                    <Sparkles size={14} className="mt-0.5 shrink-0 text-orange-500" />
                    Menus depend on each mess. Check individual listings for details.
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative isolate overflow-hidden bg-[#f8fafc] px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-16 -z-10 h-64 w-64 rounded-full bg-green-100/60 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-72 w-72 rounded-full bg-orange-100/60 blur-3xl"
        />

        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.14em] text-green-800 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Easy as 1, 2, 3
            </span>

            <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Your next meal is just
              <span className="text-green-700"> three steps away.</span>
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
              Finding your daily meals should be simple. Discover nearby mess
              services, explore menus and choose what works for you.
            </p>
          </div>

          <div className="relative mt-12 grid gap-5 md:mt-16 md:grid-cols-3 md:gap-6">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[22%] right-[22%] top-[43px] hidden border-t-2 border-dashed border-slate-200 md:block"
            />

            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="group relative rounded-[26px] border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/5 sm:p-7"
                >
                  <div className="relative flex items-center justify-between">
                    <div
                      className={`relative z-10 flex h-[68px] w-[68px] items-center justify-center rounded-[22px] ${step.theme} transition-transform duration-300 group-hover:scale-105`}
                    >
                      <Icon size={29} strokeWidth={1.9} />
                    </div>

                    <span className="text-5xl font-black tracking-tighter text-slate-100 transition-colors group-hover:text-slate-200">
                      {step.number}
                    </span>
                  </div>

                  <div className="mt-7">
                    <span className="text-[10px] font-extrabold tracking-[0.12em] text-slate-400">
                      {step.tag}
                    </span>

                    <h3 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 sm:text-[22px]">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                    <span className="text-xs font-semibold text-slate-500">
                      Step {step.number}
                    </span>

                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${step.theme} transition-transform duration-300 group-hover:translate-x-1`}
                    >
                      <ArrowRight size={17} />
                    </span>
                  </div>

                  <span
                    className={`absolute right-6 top-[78px] h-2.5 w-2.5 rounded-full ${step.badge} ring-4 ring-white`}
                  />
                </article>
              );
            })}
          </div>

          <div className="mx-auto mt-9 flex max-w-2xl flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-5 py-4 text-center sm:flex-row sm:gap-4 sm:text-left">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
              <Sparkles size={20} />
            </span>

            <p className="text-sm leading-6 text-slate-600">
              <span className="font-bold text-slate-900">
                Less searching, more enjoying.
              </span>{" "}
              Find food options that fit your routine and budget.
            </p>

            <Link
              href="/"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-green-700 transition-colors hover:text-green-900"
            >
              Explore messes
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="px-5 pb-14 sm:px-8 sm:pb-16 lg:px-12">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[26px] bg-[#183d32] px-6 py-10 text-center sm:px-12 sm:py-12">
          <div
            aria-hidden="true"
            className="absolute -right-12 -top-20 h-48 w-48 rounded-full border-[28px] border-white/5"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-orange-500/10"
          />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold text-green-100">
              <MapPin size={14} />
              YOUR NEXT MEAL STARTS HERE
            </span>

            <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Ready to find your kind of food?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-green-50/80 sm:text-base">
              Explore nearby mess services and find meal options that fit
              your daily routine.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              Explore mess listings
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
