"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Store, PlusCircle, LifeBuoy, LogOut, Star, MapPin, Clock, CheckCircle2, Pencil } from "lucide-react";

const statusStyles = {
  published: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  suspended: "bg-slate-100 text-slate-700 border-slate-200",
  draft: "bg-slate-100 text-slate-700 border-slate-200",
  archived: "bg-slate-100 text-slate-500 border-slate-200",
};

function StatSkeleton() {
  return (
    <div className="card" aria-hidden="true">
      <div className="h-4 w-28 animate-pulse rounded-full bg-slate-100" />
      <div className="mt-3 h-8 w-16 animate-pulse rounded-lg bg-slate-200" />
    </div>
  );
}

function ListingSkeleton() {
  return (
    <div className="card" aria-hidden="true">
      <div className="flex items-start justify-between gap-3">
        <div className="h-5 w-40 animate-pulse rounded-full bg-slate-200" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
      </div>
      <div className="mt-3 h-4 w-1/2 animate-pulse rounded-full bg-slate-100" />
      <div className="mt-3 h-4 w-2/3 animate-pulse rounded-full bg-slate-100" />
      <div className="mt-4 h-10 w-full animate-pulse rounded-xl bg-slate-100" />
      <div className="mt-4 h-11 w-32 animate-pulse rounded-xl bg-slate-100" />
    </div>
  );
}

export default function OwnerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [messes, setMesses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const meRes = await fetch("/api/auth/me");
        const me = await meRes.json();
        if (!me.success) {
          router.replace("/owner/login");
          return;
        }
        const listRes = await fetch("/api/owner/messes");
        const list = await listRes.json();
        if (!cancelled) {
          setUser(me.user);
          setMesses(list.success ? list.messes || [] : []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load your dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const published = messes.filter((m) => m.status === "published").length;
  const pending = messes.filter((m) => m.status === "pending").length;

  return (
    <section className="container py-8 sm:py-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <span className="pill">
            <Store size={14} />
            Owner area
          </span>
          <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
            {user ? `Welcome, ${user.name}` : "Owner dashboard"}
          </h1>
          <p className="muted mt-2 text-sm sm:text-base">Manage your mess listings, menus and approval status.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
          <Link className="btn col-span-2 w-full sm:col-span-1 sm:w-auto" href="/owner/messes/new">
            <PlusCircle size={17} />
            Create listing
          </Link>
          <Link className="btn btn-secondary w-full sm:w-auto" href="/support">
            <LifeBuoy size={17} />
            Support
          </Link>
          <button className="btn btn-secondary w-full sm:w-auto" onClick={logout}>
            <LogOut size={17} />
            Log out
          </button>
        </div>
      </div>

      {error && <div role="alert" className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-900 sm:text-base">{error}</div>}

      <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-3">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : (
          <>
            <div className="card">
              <p className="muted text-sm font-semibold">Total listings</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{messes.length}</p>
            </div>
            <div className="card">
              <p className="muted text-sm font-semibold">Live listings</p>
              <p className="mt-2 text-3xl font-black text-green-600">{published}</p>
            </div>
            <div className="card">
              <p className="muted text-sm font-semibold">Awaiting approval</p>
              <p className="mt-2 text-3xl font-black text-amber-600">{pending}</p>
            </div>
          </>
        )}
      </div>

      <h2 className="mt-9 text-lg font-extrabold sm:mt-10 sm:text-xl">Your listings</h2>

      {loading ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2" aria-busy="true">
          <ListingSkeleton />
          <ListingSkeleton />
        </div>
      ) : messes.length ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {messes.map((mess) => (
            <article className="card card-hover" key={mess._id}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="min-w-0 text-lg font-bold">{mess.name}</h3>
                <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${statusStyles[mess.status] || statusStyles.draft}`}>
                  {mess.status}
                </span>
              </div>

              <p className="muted mt-2 flex items-start gap-1.5 text-sm">
                <MapPin size={15} className="mt-0.5 shrink-0" />
                {[mess.area, mess.city].filter(Boolean).join(", ") || "Location not set"}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Star size={15} className="fill-amber-400 text-amber-500" />
                  {Number(mess.averageRating || 0).toFixed(1)}
                  <span className="muted font-normal">({mess.reviewCount || 0})</span>
                </span>
                <span className="muted flex items-center gap-1.5">
                  <Clock size={15} />
                  ₹{mess.startingPrice}/month
                </span>
              </div>

              {mess.status === "published" ? (
                <p className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-sm font-medium text-green-800">
                  <CheckCircle2 size={16} className="shrink-0" />
                  Visible to customers
                </p>
              ) : mess.moderationReason ? (
                <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800">{mess.moderationReason}</p>
              ) : (
                <p className="mt-4 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  Waiting for admin review before it goes live.
                </p>
              )}

              <div className="mt-4">
                <Link className="btn btn-secondary w-full sm:w-auto" href={`/owner/messes/${mess._id}/edit`}>
                  <Pencil size={16} />
                  Edit listing
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="card mt-4 text-center">
          <h3 className="text-lg font-bold">No listings yet</h3>
          <p className="muted mt-2">Create your first mess listing and submit it for approval.</p>
          <Link className="btn mt-4 w-full sm:w-auto" href="/owner/messes/new">
            <PlusCircle size={17} />
            Create your first listing
          </Link>
        </div>
      )}
    </section>
  );
}
