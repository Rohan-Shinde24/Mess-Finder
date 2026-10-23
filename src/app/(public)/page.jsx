
import Link from "next/link";
import { Search, Utensils, MapPin, SlidersHorizontal, ArrowRight, RotateCcw } from "lucide-react";
import AdvertisementCarousel from "../../components/layout/AdvertisementCarousel";
import MessCard from "../../components/mess/MessCard";
import connectDB from "../../lib/mongodb";
import Mess from "../../models/Mess";
import Advertisement from "../../models/Advertisement";
import { openGraph } from "../../lib/seo";

export const metadata = {
  title: "Find a Mess: Browse Local Tiffin & Meal Services",
  description:
    "Search mess and tiffin services by city, area or pincode. Filter by monthly budget and compare weekly menus for veg and non-veg home style meals.",
  keywords: [
    "mess near me",
    "tiffin service near me",
    "monthly mess plan",
    "daily meal subscription",
    "veg mess",
    "non veg mess",
    "PG mess",
    "meal plan near me",
  ],
  alternates: { canonical: "/" },
  openGraph: openGraph({
    title: "Find a Mess: Browse Local Tiffin & Meal Services",
    description:
      "Search mess and tiffin services by city, area or pincode. Filter by monthly budget and compare weekly menus for veg and non-veg home style meals.",
    url: "/",
  }),
};

export default async function HomePage({ searchParams }) {
  const params = await searchParams;

  const q = String(params?.q || "").trim().slice(0, 100);
  const city = String(params?.city || "").trim().slice(0, 100);
  const area = String(params?.area || "").trim().slice(0, 100);
  const maxPrice = Number(params?.maxPrice);

  let messes = [];
  let ads = [];

  try {
    await connectDB();

    const filter = {
      status: "published",
      isDeleted: false,
    };

    if (q) {
      filter.name = {
        $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      };
    }

    if (city) {
      filter.city = {
        $regex: city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      };
    }

    if (area) {
      filter.area = {
        $regex: area.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      };
    }

    if (
      params?.maxPrice &&
      Number.isFinite(maxPrice) &&
      maxPrice >= 0
    ) {
      filter.startingPrice = { $lte: maxPrice };
    }

    const now = new Date();

    // Listings and ads are fetched together so the page renders in one pass.
    const [messDocs, adDocs] = await Promise.all([
      Mess.find(filter)
        .sort({ averageRating: -1, createdAt: -1 })
        .limit(24)
        .select("-location")
        .lean(),
      Advertisement.find({
        isActive: true,
        isDeleted: false,
        $and: [
          { $or: [{ startsAt: null }, { startsAt: { $lte: now } }] },
          { $or: [{ endsAt: null }, { endsAt: { $gte: now } }] },
        ],
      })
        .sort({ slot: 1 })
        .limit(4)
        .lean(),
    ]);

    messes = messDocs;
    ads = adDocs.map((ad) => ({
      _id: String(ad._id),
      title: ad.title || "",
      imageUrl: ad.imageUrl || "",
      destinationUrl: ad.destinationUrl || "",
      slot: Number(ad.slot) || 0,
    }));
  } catch (error) {
    console.error("Failed to load mess listings:", error);
  }

  const hasFilters = Boolean(q || city || area || params?.maxPrice);

  return (
    <main className="min-h-screen bg-[#f7fbf8]">
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-4 sm:px-6 sm:pb-16 sm:pt-6 lg:px-8">
        {/* Advertisement */}
        <div className="">
          <AdvertisementCarousel initialAds={ads} />
        </div>

        {/* Search panel */}
        <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
              <SlidersHorizontal size={19} />
            </span>

            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                Find your everyday meals
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">
                Search local messes by name, location, and budget.
              </p>
            </div>
          </div>

          <form
            action="/"
            method="GET"
            className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr_auto]"
          >
            <label className="block min-w-0">
              <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                Mess name
              </span>
              <input
                className="field w-full"
                name="q"
                defaultValue={q}
                placeholder="e.g. Shiv Bhojanalaya"
                aria-label="Mess name"
                maxLength={100}
              />
            </label>

            <label className="block min-w-0">
              <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                City
              </span>
              <input
                className="field w-full"
                name="city"
                defaultValue={city}
                placeholder="Enter city"
                aria-label="City"
                maxLength={100}
              />
            </label>

            <label className="block min-w-0">
              <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                Area
              </span>
              <input
                className="field w-full"
                name="area"
                defaultValue={area}
                placeholder="Enter area"
                aria-label="Area"
                maxLength={100}
              />
            </label>

            <label className="block min-w-0">
              <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                Monthly budget
              </span>
              <input
                className="field w-full"
                name="maxPrice"
                type="number"
                min="0"
                max="1000000"
                defaultValue={params?.maxPrice || ""}
                placeholder="Max ₹"
                aria-label="Maximum monthly price"
              />
            </label>

            <div className="flex items-end">
              <button
                type="submit"
                className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition duration-200 hover:bg-green-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 lg:w-auto"
              >
                <Search size={17} />
                Search
              </button>
            </div>
          </form>

          {hasFilters && (
            <div className="mt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition hover:text-green-700"
              >
                <RotateCcw size={13} />
                Clear all filters
              </Link>
            </div>
          )}
        </section>

        {/* Results heading */}
        <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900">
              Explore mess listings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              <span className="font-bold text-green-700">
                {messes.length}
              </span>{" "}
              {messes.length === 1 ? "mess" : "messes"} found
              {hasFilters ? " for your search" : ""}
            </p>
          </div>

          <Link
            href="/list-your-mess"
            className="group inline-flex items-center gap-2 self-start rounded-xl border border-green-200 bg-white px-4 py-2.5 text-sm font-bold text-green-700 shadow-sm transition hover:border-green-700 hover:bg-green-700 hover:text-white sm:self-auto"
          >
            <MapPin size={16} />
            Own a mess? List it
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Listings */}
        {messes.length > 0 ? (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {messes.map((mess, index) => (
              <div key={String(mess._id)} className="h-full">
                <MessCard
                  priority={index < 3}
                  mess={{
                    ...mess,
                    _id: String(mess._id),
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center sm:py-16">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-700">
              <Utensils size={25} />
            </span>

            <h3 className="mt-4 text-lg font-extrabold text-slate-900">
              No messes found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {hasFilters
                ? "Try a different city, area, or monthly budget to discover more options."
                : "There are no published mess listings yet. New listings will appear here after admin approval."}
            </p>

            {hasFilters && (
              <Link
                href="/"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800"
              >
                <RotateCcw size={16} />
                Clear filters
              </Link>
            )}

            {!hasFilters && (
              <Link
                href="/list-your-mess"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800"
              >
                List your mess
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
