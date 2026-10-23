"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, X } from "lucide-react";

const MAX_IMAGES = 3;

const textFields = [
  { name: "city", label: "City", required: true, placeholder: "e.g. Pune" },
  { name: "area", label: "Area", placeholder: "e.g. Kothrud" },
  { name: "state", label: "State", placeholder: "e.g. Maharashtra" },
  { name: "pincode", label: "PIN code", required: true, placeholder: "e.g. 411038" },
  { name: "phone", label: "Phone", placeholder: "Contact number" },
  { name: "whatsappNumber", label: "WhatsApp number", placeholder: "WhatsApp number" },
];

// Displayed Monday..Sunday; the value is the real Date.getDay() number.
const DAYS = [
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
  { value: 0, label: "Sunday" },
];

const SLOTS = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "night", label: "Night" },
];

function emptySlot() {
  return { dishes: "", time: "", foodType: "both" };
}

function buildMenuState(initialMenu) {
  const state = {};
  for (const day of DAYS) {
    state[day.value] = {};
    for (const slot of SLOTS) state[day.value][slot.value] = emptySlot();
  }
  for (const entry of initialMenu || []) {
    if (state[entry.dayOfWeek] && state[entry.dayOfWeek][entry.mealSlot]) {
      state[entry.dayOfWeek][entry.mealSlot] = {
        dishes: Array.isArray(entry.dishes) ? entry.dishes.join(", ") : "",
        time: entry.time || "",
        foodType: entry.foodType || "both",
      };
    }
  }
  return state;
}

export default function MessForm({ mode = "create", messId, initialMess = null, initialMenu = [] }) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const [images, setImages] = useState(() => (Array.isArray(initialMess?.images) ? initialMess.images : []));
  const [uploading, setUploading] = useState([]);
  const [imageError, setImageError] = useState("");
  const [imageNotice, setImageNotice] = useState("");
  const [menu, setMenu] = useState(() => buildMenuState(initialMenu));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    setImageError("");
    setImageNotice("");

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      setImageNotice("You can add up to 3 images");
      return;
    }

    const chosen = files.slice(0, remaining);
    if (files.length > remaining) setImageNotice("You can add up to 3 images");

    for (const file of chosen) {
      setUploading((current) => [...current, file.name]);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message || "Could not upload the image");
        setImages((current) => [...current, data.url]);
      } catch (err) {
        setImageError(err.message);
      } finally {
        setUploading((current) => current.filter((name) => name !== file.name));
      }
    }
  }

  function pickFiles(event) {
    handleFiles(event.target.files);
    event.target.value = "";
  }

  function removeImage(index) {
    setImages((current) => current.filter((_, i) => i !== index));
    setImageError("");
    setImageNotice("");
  }

  function updateSlot(day, slot, key, value) {
    setMenu((current) => ({
      ...current,
      [day]: {
        ...current[day],
        [slot]: { ...current[day][slot], [key]: value },
      },
    }));
  }

  function clearDay(day) {
    setMenu((current) => {
      const cleared = {};
      for (const slot of SLOTS) cleared[slot.value] = emptySlot();
      return { ...current, [day]: cleared };
    });
  }

  function buildWeeklyMenu() {
    const entries = [];
    for (const day of DAYS) {
      for (const slot of SLOTS) {
        const entry = menu[day.value][slot.value];
        const dishes = entry.dishes.split(",").map((dish) => dish.trim()).filter(Boolean);
        const time = entry.time.trim();
        if (!dishes.length && !time) continue;
        entries.push({
          dayOfWeek: Number(day.value),
          mealSlot: slot.value,
          dishes,
          time,
          foodType: entry.foodType || "both",
        });
      }
    }
    return entries;
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      description: formData.get("description"),
      address: formData.get("address"),
      city: formData.get("city"),
      area: formData.get("area"),
      state: formData.get("state"),
      pincode: formData.get("pincode"),
      phone: formData.get("phone"),
      whatsappNumber: formData.get("whatsappNumber"),
      startingPrice: Number(formData.get("startingPrice")),
      foodType: formData.get("foodType"),
      images,
      weeklyMenu: buildWeeklyMenu(),
    };

    try {
      const response = await fetch(isEdit ? `/api/owner/messes/${messId}` : "/api/messes", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Could not submit listing");
      router.push("/owner/dashboard");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  const atLimit = images.length >= MAX_IMAGES;

  return (
    <form className="mt-6 grid gap-6" onSubmit={submit}>
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3.5 text-sm font-medium text-red-700">
          {error}
        </p>
      )}

      {isEdit && (
        <p className="rounded-xl bg-amber-50 p-3.5 text-sm font-medium text-amber-900">
          Saving sends this listing back to the admin for re-approval.
        </p>
      )}

      <div className="card grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-bold text-slate-700" htmlFor="name">
            Mess name *
          </label>
          <input
            id="name"
            required
            name="name"
            className="field"
            minLength="2"
            maxLength="120"
            defaultValue={initialMess?.name || ""}
            placeholder="e.g. Annapurna Mess"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-bold text-slate-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="field"
            rows="4"
            maxLength="3000"
            defaultValue={initialMess?.description || ""}
            placeholder="Tell customers about your food, timings and what makes your mess special."
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-bold text-slate-700" htmlFor="address">
            Address *
          </label>
          <input
            id="address"
            required
            name="address"
            className="field"
            defaultValue={initialMess?.address || ""}
            placeholder="Street, building, landmark"
          />
        </div>

        {textFields.map(({ name, label, required, placeholder }) => (
          <div key={name}>
            <label className="mb-1.5 block text-sm font-bold text-slate-700" htmlFor={name}>
              {label}
              {required ? " *" : ""}
            </label>
            <input
              id={name}
              required={required}
              name={name}
              className="field"
              defaultValue={initialMess?.[name] || ""}
              placeholder={placeholder}
            />
          </div>
        ))}

        <div>
          <label className="mb-1.5 block text-sm font-bold text-slate-700" htmlFor="startingPrice">
            Starting monthly price (₹) *
          </label>
          <input
            id="startingPrice"
            required
            name="startingPrice"
            type="number"
            min="0"
            className="field"
            defaultValue={initialMess?.startingPrice ?? ""}
            placeholder="e.g. 2500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-bold text-slate-700" htmlFor="foodType">
            Food type
          </label>
          <select id="foodType" name="foodType" className="field" defaultValue={initialMess?.foodType || "both"}>
            <option value="both">Veg and non-veg</option>
            <option value="veg">Vegetarian</option>
            <option value="non-veg">Non-vegetarian</option>
          </select>
        </div>
      </div>

      <section className="card">
        <h2 className="text-lg font-extrabold">Photos (up to 3)</h2>
        <p className="muted mt-1 text-sm">Show customers your food and space. JPG, PNG, WEBP, GIF or AVIF, max 5 MB each.</p>

        {atLimit ? (
          <p className="mt-4 rounded-xl bg-amber-50 p-3.5 text-sm font-medium text-amber-800">
            You can add up to 3 images
          </p>
        ) : (
          <label htmlFor="photo-input" className="btn btn-secondary mt-4 w-full cursor-pointer sm:w-auto">
            <ImagePlus size={17} />
            {uploading.length ? "Uploading…" : "Choose photos"}
          </label>
        )}
        <input
          id="photo-input"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={atLimit || uploading.length > 0}
          onChange={pickFiles}
        />

        {uploading.length > 0 && (
          <div className="mt-3 grid gap-1.5">
            {uploading.map((name, index) => (
              <p key={`${name}-${index}`} className="flex items-center gap-2 text-sm text-slate-600">
                <Loader2 size={15} className="animate-spin" />
                Uploading {name}…
              </p>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {images.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Listing photo ${index + 1}`} className="h-24 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  aria-label={`Remove photo ${index + 1}`}
                  className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1 text-slate-700 shadow transition hover:bg-red-50 hover:text-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {imageNotice && (
          <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm font-medium text-amber-800">{imageNotice}</p>
        )}
        {imageError && (
          <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
            {imageError}
          </p>
        )}
      </section>

      <section className="card">
        <h2 className="text-lg font-extrabold">Weekly meal plan</h2>
        <p className="muted mt-1 text-sm">Set what you serve each day. Leave a slot empty to skip it.</p>

        <div className="mt-5 grid gap-4">
          {DAYS.map((day) => (
            <div key={day.value} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-slate-900">{day.label}</h3>
                <button
                  type="button"
                  onClick={() => clearDay(day.value)}
                  className="text-xs font-bold text-slate-500 transition hover:text-red-600"
                >
                  Clear day
                </button>
              </div>

              <div className="mt-3 grid gap-3">
                {SLOTS.map((slot) => (
                  <div
                    key={slot.value}
                    className="grid gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-[64px_1fr_1fr_120px] sm:items-center sm:gap-3 sm:bg-transparent sm:p-0"
                  >
                    <span className="text-sm font-bold text-slate-700">{slot.label}</span>
                    <input
                      className="field"
                      value={menu[day.value][slot.value].dishes}
                      onChange={(event) => updateSlot(day.value, slot.value, "dishes", event.target.value)}
                      placeholder="Dishes (comma separated)"
                      aria-label={`${day.label} ${slot.label} dishes`}
                    />
                    <input
                      className="field"
                      value={menu[day.value][slot.value].time}
                      onChange={(event) => updateSlot(day.value, slot.value, "time", event.target.value)}
                      placeholder="Time e.g. 8:00 AM - 10:00 AM"
                      aria-label={`${day.label} ${slot.label} time`}
                    />
                    <select
                      className="field"
                      value={menu[day.value][slot.value].foodType}
                      onChange={(event) => updateSlot(day.value, slot.value, "foodType", event.target.value)}
                      aria-label={`${day.label} ${slot.label} type`}
                    >
                      <option value="veg">Veg</option>
                      <option value="non-veg">Non-veg</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div>
        <button className="btn w-full sm:w-auto" disabled={busy || uploading.length > 0}>
          {busy && <Loader2 size={18} className="animate-spin" />}
          {busy
            ? isEdit
              ? "Saving…"
              : "Submitting…"
            : isEdit
              ? "Save changes"
              : "Submit for approval"}
        </button>
      </div>
    </form>
  );
}
