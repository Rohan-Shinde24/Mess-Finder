import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Star,
  Phone,
  MessageCircle,
  LifeBuoy,
  Clock,
  Utensils,
  ShieldCheck,
  Lock,
  UserPlus,
} from "lucide-react";
import connectDB from "../../../../lib/mongodb";
import { getCurrentUser } from "../../../../lib/auth";
import Mess from "../../../../models/Mess";
import MealPlan from "../../../../models/MealPlan";
import WeeklyMenu from "../../../../models/WeeklyMenu";
import Review from "../../../../models/Review";
import ReviewForm from "../../../../components/mess/ReviewForm";
import { openGraph } from "../../../../lib/seo";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const slots = ["breakfast", "morning-snacks", "lunch", "evening-snacks", "dinner"];

const foodTypeLabels = {
  veg: "Vegetarian",
  "non-veg": "Non-vegetarian",
  both: "Veg & non-veg",
};

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    await connectDB();
    const mess = await Mess.findOne({ _id: id, status: "published", isDeleted: false }).select("name city description").lean();
    const title = mess ? `${mess.name} in ${mess.city}` : "Mess details";
    const description =
      mess?.description ||
      "View the weekly menu, meal plans, prices and contact details for this mess on MessFinder.";
    return {
      title,
      description,
      keywords: [
        "mess near me",
        "tiffin service",
        "daily meal subscription",
        "monthly mess plan",
        "veg mess",
        "non veg mess",
        "home style food",
      ],
      alternates: { canonical: `/messlisting/${id}` },
      openGraph: openGraph({ title, description, url: `/messlisting/${id}` }),
    };
  } catch {
    return { title: "Mess details" };
  }
}

export default async function MessDetailsPage({ params }) {
  const { id } = await params;
  let mess;
  let plans = [];
  let menu = [];
  let reviews = [];
  let user = null;
  let adminPreview = false;

  try {
    await connectDB();
    user = await getCurrentUser();
    adminPreview = user?.role === "admin";
    mess = await Mess.findOne(
      adminPreview
        ? { _id: id, isDeleted: false }
        : { _id: id, status: "published", isDeleted: false }
    ).lean();
    if (!mess) notFound();
    [plans, menu, reviews] = await Promise.all([
      MealPlan.find({ messId: id, isDeleted: false, isAvailable: true }).lean(),
      WeeklyMenu.find({ messId: id, isDeleted: false, isAvailable: true }).sort({ dayOfWeek: 1 }).lean(),
      Review.find({ messId: id, isDeleted: false, status: "visible" }).populate("userId", "name").sort({ createdAt: -1 }).limit(30).lean(),
    ]);
  } catch {
    notFound();
  }

  const phone = String(mess.phone || "").replace(/[^\d+]/g, "");
  const wa = String(mess.whatsappNumber || mess.phone || "").replace(/\D/g, "");
  const reviewHref = `/messlisting/${id}`;

  const streetAddress = [mess.address, mess.area].filter(Boolean).join(", ");
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: mess.name,
    servesCuisine: "Indian",
    priceRange: "₹",
  };

  if (mess.description) {
    jsonLd.description = mess.description;
  }

  if (streetAddress || mess.city || mess.state || mess.pincode) {
    jsonLd.address = { "@type": "PostalAddress" };
    if (streetAddress) jsonLd.address.streetAddress = streetAddress;
    if (mess.city) jsonLd.address.addressLocality = mess.city;
    if (mess.state) jsonLd.address.addressRegion = mess.state;
    if (mess.pincode) jsonLd.address.postalCode = mess.pincode;
    jsonLd.address.addressCountry = "IN";
  }

  if (mess.phone) {
    jsonLd.telephone = String(mess.phone);
  }

  if (Number.isFinite(Number(mess.startingPrice))) {
    jsonLd.offers = {
      "@type": "Offer",
      price: Number(mess.startingPrice),
      priceCurrency: "INR",
    };
  }

  return (
    <div className="container py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700">
        <ArrowLeft size={16} />
        Back to listings
      </Link>

      {adminPreview && mess.status !== "published" && (
        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <ShieldCheck size={16} className="shrink-0" />
          <span className="font-semibold">Admin preview</span>
          <span className="text-amber-800">
            — this listing is not publicly visible (status: {mess.status}).
          </span>
        </div>
      )}

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Main column */}
        <div>
          {mess.images?.length ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {mess.images.slice(0, 4).map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${mess.name} photo ${index + 1}`}
                  className={`w-full rounded-2xl object-cover ${index === 0 ? "h-72 sm:col-span-2" : "h-40"}`}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 via-green-50 to-green-200 text-green-400">
              <Utensils size={62} strokeWidth={1.4} />
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="pill">{foodTypeLabels[mess.foodType] || mess.foodType}</span>
            <span className="badge-success inline-flex items-center gap-1.5">
              <ShieldCheck size={13} />
              Verified listing
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{mess.name}</h1>

          <p className="muted mt-3 flex items-center gap-2">
            <MapPin size={17} className="shrink-0 text-green-500" />
            {[mess.address, mess.area, mess.city, mess.state, mess.pincode].filter(Boolean).join(", ")}
          </p>

          <div className="mt-4 flex items-center gap-2 text-lg font-bold">
            <Star size={20} className="fill-amber-400 text-amber-500" />
            {Number(mess.averageRating || 0).toFixed(1)}
            <span className="muted text-sm font-normal">({mess.reviewCount || 0} reviews)</span>
          </div>

          <p className="mt-5 whitespace-pre-wrap leading-7 text-slate-700">
            {mess.description || "Contact the mess to learn more about meals and availability."}
          </p>

          {/* Meal plans */}
          <section className="mt-12">
            <h2 className="text-2xl font-extrabold">Meal plans</h2>
            {plans.length ? (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {plans.map((plan) => (
                  <div className="card card-hover" key={String(plan._id)}>
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                    <p className="mt-2 text-2xl font-black text-green-600">₹{plan.price}</p>
                    <p className="muted flex items-center gap-1.5 text-sm">
                      <Clock size={14} />
                      {plan.durationDays} days
                    </p>
                    {plan.description && <p className="mt-3 text-sm leading-6">{plan.description}</p>}
                    <p className="muted mt-3 text-sm">
                      Includes: {(plan.includedMeals || []).join(", ") || "Contact owner"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted mt-3">No plans have been added yet.</p>
            )}
          </section>

          {/* Weekly menu */}
          <section className="mt-12">
            <h2 className="text-2xl font-extrabold">Weekly menu</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {days.map((day, index) => (
                <div className="card" key={day}>
                  <h3 className="font-bold">{day}</h3>
                  {slots.map((slot) => {
                    const entry = menu.find((item) => item.dayOfWeek === index && item.mealSlot === slot);
                    return (
                      <div className="mt-2 border-t border-slate-100 pt-2 text-sm" key={slot}>
                        <span className="font-semibold capitalize">{slot.replace("-", " ")}: </span>
                        <span className="muted">{entry?.dishes?.join(", ") || "Not specified"}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>

          {/* Reviews */}
          <section className="mt-12">
            <h2 className="text-2xl font-extrabold">Customer reviews</h2>

            {reviews.length ? (
              <div className="mt-4 space-y-3">
                {reviews.map((review) => (
                  <div className="card" key={String(review._id)}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-bold">{review.userId?.name || "Customer"}</p>
                      <span className="flex items-center gap-1 text-sm font-bold text-amber-600">
                        <Star size={15} className="fill-amber-400 text-amber-500" />
                        {review.rating}.0
                      </span>
                    </div>
                    <p className="mt-2 leading-7 text-slate-700">{review.comment}</p>
                    {review.ownerResponse && (
                      <p className="muted mt-3 border-l-2 border-green-200 pl-3 text-sm">
                        Owner response: {review.ownerResponse}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted mt-3">No reviews yet. Be the first to share your experience.</p>
            )}
          </section>
        </div>

        {/* Aside */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-4">
          <div className="card">
            <p className="muted text-sm">Starting monthly price</p>
            <p className="mt-1 text-4xl font-black text-green-600">₹{mess.startingPrice}</p>
            <p className="muted mt-2 text-sm">Food type: {foodTypeLabels[mess.foodType] || mess.foodType}</p>

            <div className="mt-5 grid gap-3">
              {phone && (
                <a className="btn w-full" href={`tel:${phone}`}>
                  <Phone size={17} />
                  Call mess
                </a>
              )}
              {wa && (
                <a className="btn btn-secondary w-full" target="_blank" rel="noreferrer" href={`https://wa.me/${wa}`}>
                  <MessageCircle size={17} />
                  WhatsApp
                </a>
              )}
              <Link className="btn btn-secondary w-full" href="/support">
                <LifeBuoy size={17} />
                Ask support
              </Link>
            </div>

            <p className="muted mt-4 text-xs leading-5">
              Contact details and plans are provided by the listing owner. Confirm availability and terms directly.
            </p>
          </div>

          {user ? (
            <ReviewForm messId={id} />
          ) : (
            <div className="card">
              <h3 className="text-lg font-extrabold">Write a review</h3>
              <p className="muted mt-2 text-sm leading-6">
                Log in to rate this mess and share your experience with other customers.
              </p>
              <div className="mt-4 grid gap-3">
                <Link className="btn w-full" href={`/register?next=${encodeURIComponent(reviewHref)}`}>
                  <UserPlus size={17} />
                  Create an account
                </Link>
                <Link className="btn btn-secondary w-full" href={`/login?next=${encodeURIComponent(reviewHref)}`}>
                  <Lock size={17} />
                  Log in to review
                </Link>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
