import Link from "next/link";
import { MapPin, Star, ArrowRight } from "lucide-react";

const foodTypeLabels = {
  veg: "Veg",
  "non-veg": "Non-veg",
  both: "Veg & non-veg",
};

const fallbackCovers = {
  veg: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=overhead%20shot%20of%20a%20fresh%20Indian%20vegetarian%20thali%20on%20a%20stainless%20steel%20plate%20with%20dal%2C%20rice%2C%20roti%2C%20sabzi%20and%20salad%2C%20bright%20natural%20daylight%2C%20professional%20food%20photography&image_size=landscape_4_3",
  "non-veg":
    "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=home%20style%20Indian%20chicken%20curry%20with%20steamed%20rice%20and%20roti%20on%20a%20steel%20plate%2C%20warm%20natural%20light%2C%20professional%20food%20photography&image_size=landscape_4_3",
  both: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Indian%20home%20style%20meal%20with%20dal%2C%20rice%2C%20roti%20and%20mixed%20curries%20on%20a%20steel%20plate%2C%20warm%20natural%20light%2C%20professional%20food%20photography&image_size=landscape_4_3",
};

export default function MessCard({ mess, priority = false }) {
  const cover = mess.images?.[0] || fallbackCovers[mess.foodType] || fallbackCovers.both;
  const location = [mess.area, mess.city].filter(Boolean).join(", ");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-green-900/5 sm:rounded-3xl">
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-green-100 via-green-50 to-green-200 sm:h-48">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={`${mess.name} — ${foodTypeLabels[mess.foodType] || "food"} mess food`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          width={640}
          height={480}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-sm backdrop-blur sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-xs">
          {foodTypeLabels[mess.foodType] || "Food"}
        </span>

        <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-sm backdrop-blur sm:right-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-xs">
          <Star size={13} className="fill-amber-400 text-amber-500" />
          {Number(mess.averageRating || 0).toFixed(1)}
          <span className="font-semibold text-slate-400">({mess.reviewCount || 0})</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="line-clamp-2 text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
          {mess.name}
        </h3>

        <p className="muted mt-2 flex items-start gap-1.5 text-sm">
          <MapPin size={15} className="mt-0.5 shrink-0 text-green-500" />
          <span className="line-clamp-1">{location || "Location not shared"}</span>
        </p>

        <p className="muted mt-3 line-clamp-2 text-sm leading-6">
          {mess.description || "View menu, plans and contact details for this mess."}
        </p>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Starts at</p>
            <p className="text-lg font-black text-green-600 sm:text-xl">
              ₹{mess.startingPrice}
              <span className="text-sm font-semibold text-slate-400">/mo</span>
            </p>
          </div>

          <Link
            className="btn whitespace-nowrap text-sm"
            href={`/messlisting/${mess._id}`}
            aria-label={`View details for ${mess.name}`}
          >
            View details
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
