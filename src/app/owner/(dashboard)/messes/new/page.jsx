import Link from "next/link";
import { ArrowLeft, Store } from "lucide-react";
import MessForm from "@/components/owner/MessForm";

export default function NewMessPage() {
  return (
    <section className="container max-w-3xl py-10">
      <Link href="/owner/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-green-600 hover:text-green-700">
        <ArrowLeft size={16} />
        Back to dashboard
      </Link>

      <span className="pill mt-5">
        <Store size={14} />
        New listing
      </span>
      <h1 className="mt-3 text-3xl font-black tracking-tight">Create a mess listing</h1>
      <p className="muted mt-2">Your listing is reviewed by an admin before it becomes visible to customers.</p>

      <MessForm mode="create" />
    </section>
  );
}
