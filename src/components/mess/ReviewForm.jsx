"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Loader2, CheckCircle2, Send } from "lucide-react";

export default function ReviewForm({ messId }) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(event) {
    event.preventDefault();
    if (!rating) {
      setError("Pick a star rating first.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/messes/${messId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not submit review");
      setDone(true);
      setRating(0);
      setComment("");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const active = hover || rating;

  return (
    <form onSubmit={submit} className="card mt-5">
      <h3 className="text-lg font-extrabold">Share your experience</h3>
      <p className="muted mt-1 text-sm">Your review helps other customers choose the right mess.</p>

      <div className="mt-4 flex items-center gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onMouseEnter={() => setHover(value)}
            onClick={() => setRating(value)}
            aria-label={`Rate ${value} star${value > 1 ? "s" : ""}`}
            className="rounded-lg p-0.5 transition hover:scale-110"
          >
            <Star
              size={30}
              className={active >= value ? "fill-amber-400 text-amber-500" : "text-slate-300"}
            />
          </button>
        ))}
        <span className="ml-2 text-sm font-bold text-slate-600">
          {rating ? `${rating}.0 / 5` : "Tap to rate"}
        </span>
      </div>

      <textarea
        className="field mt-4"
        rows="4"
        maxLength="1500"
        placeholder="How was the food, hygiene and service? (at least 5 characters)"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />

      {error && (
        <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3.5 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      {done && (
        <p className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 p-3.5 text-sm font-medium text-green-800">
          <CheckCircle2 size={17} />
          Thanks! Your review has been published.
        </p>
      )}

      <button className="btn mt-4" disabled={busy}>
        {busy ? <Loader2 size={18} className="animate-spin" /> : <Send size={17} />}
        {busy ? "Posting…" : "Post review"}
      </button>
    </form>
  );
}
