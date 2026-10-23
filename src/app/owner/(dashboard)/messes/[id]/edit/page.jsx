"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import MessForm from "@/components/owner/MessForm";

function FormSkeleton() {
  return (
    <div className="mt-6 grid gap-6" aria-busy="true" aria-hidden="true">
      <div className="card grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className={index < 3 ? "sm:col-span-2" : ""}>
            <div className="h-3.5 w-24 animate-pulse rounded-full bg-slate-100" />
            <div className="mt-2 h-[46px] w-full animate-pulse rounded-xl bg-slate-100" />
          </div>
        ))}
      </div>

      <div className="card">
        <div className="h-5 w-40 animate-pulse rounded-full bg-slate-200" />
        <div className="mt-4 h-11 w-40 animate-pulse rounded-xl bg-slate-100" />
      </div>

      <div className="h-11 w-full animate-pulse rounded-xl bg-slate-200 sm:w-40" />
    </div>
  );
}

export default function EditMessPage() {
  const params = useParams();
  const id = params?.id;
  const [mess, setMess] = useState(null);
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(`/api/owner/messes/${id}`);
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || "Could not load listing");
        if (!cancelled) {
          setMess(data.mess);
          setMenu(data.menu || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load listing");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <section className="container max-w-3xl py-8 sm:py-10">
      <Link href="/owner/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700">
        <ArrowLeft size={16} />
        Back to dashboard
      </Link>

      <span className="pill mt-5">
        <Pencil size={14} />
        Edit listing
      </span>
      <h1 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Edit mess listing</h1>
      <p className="muted mt-2 text-sm sm:text-base">Update your listing details, photos and weekly meal plan.</p>

      {loading ? (
        <FormSkeleton />
      ) : error ? (
        <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : (
        <MessForm mode="edit" messId={id} initialMess={mess} initialMenu={menu} />
      )}
    </section>
  );
}
