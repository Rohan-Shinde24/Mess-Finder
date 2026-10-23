"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ImagePlus, Plus, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import {
  Badge,
  EmptyRow,
  Notice,
  Panel,
  Spinner,
  StatCard,
  TableShell,
  btnDark,
  btnDanger,
  btnGhost,
  formatDate,
  inputClass,
  labelClass,
} from "@/components/admin/ui";

const emptyForm = { title: "", slot: "1", destinationUrl: "", imageUrl: "", isActive: true };

export default function AdminAdsPage() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/ads");
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || "Could not load ads");
    setAds(Array.isArray(data.ads) ? data.ads : []);
  }, []);

  useEffect(() => {
    let cancelled = false;
    load()
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load ads");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [load]);

  const stats = useMemo(() => {
    const live = ads.filter((ad) => ad.isActive).length;
    const slots = new Set(ads.filter((ad) => ad.isActive).map((ad) => ad.slot));
    return { total: ads.length, live, paused: ads.length - live, slots: slots.size };
  }, [ads]);

  async function handleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success || !data.url) throw new Error(data.message || "Could not upload the image");
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (err) {
      setUploadError(err.message || "Could not upload the image");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function createAd(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slot: Number(form.slot),
          destinationUrl: form.destinationUrl,
          imageUrl: form.imageUrl,
          isActive: form.isActive,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Could not create ad");
      setNotice(data.message || "Ad created.");
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err.message || "Could not create ad");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(ad) {
    setBusyId(ad._id);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/ads/${ad._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !ad.isActive }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Could not update ad");
      setNotice(`Ad ${ad.isActive ? "paused" : "activated"}.`);
      await load();
    } catch (err) {
      setError(err.message || "Could not update ad");
    } finally {
      setBusyId("");
    }
  }

  async function archive(ad) {
    if (!window.confirm(`Archive "${ad.title}"? It will be removed from the homepage rotation.`)) return;
    setBusyId(ad._id);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/ads/${ad._id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Could not archive ad");
      setNotice(data.message || "Ad archived.");
      await load();
    } catch (err) {
      setError(err.message || "Could not archive ad");
    } finally {
      setBusyId("");
    }
  }

  async function refresh() {
    setError("");
    try {
      await load();
    } catch (err) {
      setError(err.message || "Could not refresh");
    }
  }

  return (
    <div className="space-y-6">
      {error && <Notice tone="error">{error}</Notice>}
      {notice && <Notice tone="success">{notice}</Notice>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total ads" value={stats.total} hint="All non-archived slides" />
        <StatCard label="Live ads" value={stats.live} hint="Currently rotating" />
        <StatCard label="Paused ads" value={stats.paused} hint="Hidden from the rotation" />
        <StatCard label="Slots filled" value={`${stats.slots} / 4`} hint="Distinct live slots" />
      </div>

      <Notice tone="info">
        The four homepage slots rotate automatically on the public Find-A-Mess page. Any empty slot shows the
        &ldquo;Your ad here&rdquo; placeholder that links to <span className="font-semibold">/advertise</span>.
      </Notice>

      <Panel
        title="Create ad"
        description="Upload a banner, pick a slot and point it at any destination link. New ads go live immediately unless you untick the option below."
      >
        <form className="space-y-4" onSubmit={createAd}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="ad-title">
                Title
              </label>
              <input
                id="ad-title"
                className={inputClass}
                value={form.title}
                maxLength={120}
                required
                placeholder="Weekend thali offer"
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="ad-slot">
                Slot
              </label>
              <select
                id="ad-slot"
                className={inputClass}
                value={form.slot}
                onChange={(event) => setForm((prev) => ({ ...prev, slot: event.target.value }))}
              >
                {[1, 2, 3, 4].map((slot) => (
                  <option key={slot} value={String(slot)}>
                    Slot {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="ad-destination">
              Destination URL
            </label>
            <input
              id="ad-destination"
              type="url"
              className={inputClass}
              value={form.destinationUrl}
              required
              placeholder="https://example.com/offer"
              onChange={(event) => setForm((prev) => ({ ...prev, destinationUrl: event.target.value }))}
            />
          </div>

          <div>
            <span className={labelClass}>Banner image</span>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
                {form.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.imageUrl} alt="Selected banner preview" className="h-full w-full object-cover" />
                ) : (
                  <ImagePlus size={20} className="text-zinc-400" />
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="ad-image" className={`${btnGhost} cursor-pointer`}>
                  <UploadCloud size={15} />
                  {uploading ? "Uploading…" : "Choose image"}
                  <input
                    id="ad-image"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    disabled={uploading}
                    onChange={handleFile}
                  />
                </label>
                <p className="text-xs text-zinc-500">
                  {form.imageUrl ? "Image ready." : "JPG, PNG, WEBP, GIF or AVIF up to 5 MB."}
                </p>
                {uploadError && <p className="text-xs text-red-600">{uploadError}</p>}
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-zinc-300"
              checked={form.isActive}
              onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
            />
            Publish as a live slide immediately
          </label>

          <div className="flex items-center gap-3">
            <button type="submit" className={btnDark} disabled={submitting || uploading || !form.imageUrl}>
              <Plus size={15} />
              {submitting ? "Creating…" : "Create ad"}
            </button>
            {uploading && <Spinner label="Uploading image…" />}
          </div>
        </form>
      </Panel>

      <Panel
        title="Ad slides"
        description="Everything currently scheduled to rotate on the homepage."
        actions={
          <button className={btnGhost} onClick={refresh}>
            <RefreshCw size={15} />
            Refresh
          </button>
        }
      >
        {loading ? (
          <Spinner label="Loading ads…" />
        ) : (
          <TableShell head={["Slide", "Slot", "Destination", "Status", "Window", "Created", "Actions"]}>
            {ads.map((ad) => (
              <tr key={ad._id} className="align-top">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-16 shrink-0 overflow-hidden rounded border border-zinc-200 bg-zinc-100">
                      {ad.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={ad.imageUrl} alt="" className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <span className="max-w-[200px] truncate font-semibold text-zinc-900">{ad.title || "Untitled"}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-zinc-600">Slot {ad.slot}</td>
                <td className="px-4 py-4 text-sm">
                  {ad.destinationUrl ? (
                    <a
                      href={ad.destinationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block max-w-[200px] truncate text-zinc-600 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-900"
                    >
                      {ad.destinationUrl}
                    </a>
                  ) : (
                    <span className="text-zinc-400">—</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <Badge tone={ad.isActive ? "strong" : "muted"}>{ad.isActive ? "Live" : "Paused"}</Badge>
                </td>
                <td className="px-4 py-4 text-sm text-zinc-600">
                  {ad.startsAt || ad.endsAt
                    ? `${ad.startsAt ? formatDate(ad.startsAt) : "—"} – ${ad.endsAt ? formatDate(ad.endsAt) : "—"}`
                    : "Always"}
                </td>
                <td className="px-4 py-4 text-sm text-zinc-600">{formatDate(ad.createdAt)}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button className={btnGhost} disabled={busyId === ad._id} onClick={() => toggleActive(ad)}>
                      {ad.isActive ? "Pause" : "Activate"}
                    </button>
                    <button className={btnDanger} disabled={busyId === ad._id} onClick={() => archive(ad)}>
                      <Trash2 size={14} />
                      Archive
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!ads.length && <EmptyRow colSpan={7}>No ads yet. Create your first slide above.</EmptyRow>}
          </TableShell>
        )}
      </Panel>
    </div>
  );
}
