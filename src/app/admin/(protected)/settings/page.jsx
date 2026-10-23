"use client";

import { useCallback, useEffect, useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { Notice, Panel, Spinner, btnDark, btnGhost, inputClass, labelClass } from "@/components/admin/ui";

function ToggleRow({ id, label, description, checked, onChange, disabled }) {
  return (
    <label
      htmlFor={id}
      className="flex items-start justify-between gap-4 rounded-lg border border-zinc-200 px-4 py-3 transition hover:border-zinc-300"
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-zinc-900">{label}</span>
        <span className="mt-0.5 block text-xs text-zinc-500">{description}</span>
      </span>
      <input
        id={id}
        type="checkbox"
        className="mt-1 h-4 w-4 shrink-0 rounded border-zinc-300"
        checked={Boolean(checked)}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

const DEFAULTS = {
  siteName: "",
  supportEmail: "",
  supportPhone: "",
  contactName: "",
  adPricePerMonth: 0,
  adSlides: 4,
  maintenanceMode: false,
  allowRegistrations: true,
  autoApproveListings: false,
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState(DEFAULTS);
  const [saved, setSaved] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/settings");
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || "Could not load settings");
    const settings = data.settings || {};
    setForm(settings);
    setSaved(settings);
  }, []);

  useEffect(() => {
    let cancelled = false;
    load()
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load settings");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [load]);

  function update(key, value) {
    setForm((prev) => ({ ...(prev || {}), [key]: value }));
  }

  function reset() {
    if (saved) setForm({ ...saved });
    setError("");
    setNotice("Reverted to the last loaded values.");
  }

  async function save(event) {
    event.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName: form.siteName,
          supportEmail: form.supportEmail,
          supportPhone: form.supportPhone,
          contactName: form.contactName,
          adPricePerMonth: Number(form.adPricePerMonth),
          adSlides: Number(form.adSlides),
          maintenanceMode: Boolean(form.maintenanceMode),
          allowRegistrations: Boolean(form.allowRegistrations),
          autoApproveListings: Boolean(form.autoApproveListings),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Could not save settings");
      const next = data.settings || form;
      setForm(next);
      setSaved(next);
      setNotice(data.message || "Settings saved.");
    } catch (err) {
      setError(err.message || "Could not save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {loading && <Spinner label="Loading settings…" />}
      {error && <Notice tone="error">{error}</Notice>}
      {notice && <Notice tone="success">{notice}</Notice>}

      <p className="text-sm text-zinc-500">
        Platform-wide configuration. Changes apply immediately across the public site and admin console.
      </p>

      <form className="space-y-6" onSubmit={save}>
        <Panel title="General" description="Branding and the primary contact shown to visitors.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="settings-site-name">
                Site name
              </label>
              <input
                id="settings-site-name"
                className={inputClass}
                value={form.siteName || ""}
                minLength={2}
                maxLength={60}
                required
                onChange={(event) => update("siteName", event.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="settings-contact-name">
                Contact name
              </label>
              <input
                id="settings-contact-name"
                className={inputClass}
                value={form.contactName || ""}
                maxLength={80}
                onChange={(event) => update("contactName", event.target.value)}
              />
            </div>
          </div>
        </Panel>

        <Panel title="Contact" description="How customers reach your support team.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="settings-support-email">
                Support email
              </label>
              <input
                id="settings-support-email"
                type="email"
                className={inputClass}
                value={form.supportEmail || ""}
                required
                onChange={(event) => update("supportEmail", event.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="settings-support-phone">
                Support phone
              </label>
              <input
                id="settings-support-phone"
                className={inputClass}
                value={form.supportPhone || ""}
                maxLength={20}
                onChange={(event) => update("supportPhone", event.target.value)}
              />
            </div>
          </div>
        </Panel>

        <Panel title="Advertising" description="Pricing and the number of rotating homepage slides.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="settings-ad-price">
                Price per month (₹)
              </label>
              <input
                id="settings-ad-price"
                type="number"
                min={0}
                className={inputClass}
                value={form.adPricePerMonth ?? 0}
                onChange={(event) => update("adPricePerMonth", event.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="settings-ad-slides">
                Ad slides
              </label>
              <select
                id="settings-ad-slides"
                className={inputClass}
                value={String(form.adSlides ?? 4)}
                onChange={(event) => update("adSlides", event.target.value)}
              >
                {[1, 2, 3, 4].map((count) => (
                  <option key={count} value={String(count)}>
                    {count} slide{count === 1 ? "" : "s"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Panel>

        <Panel title="Features" description="Turn platform capabilities on or off.">
          <div className="space-y-3">
            <ToggleRow
              id="settings-maintenance"
              label="Maintenance mode"
              description="Show a maintenance notice and pause the public site."
              checked={form.maintenanceMode}
              disabled={saving}
              onChange={(value) => update("maintenanceMode", value)}
            />
            <ToggleRow
              id="settings-registrations"
              label="Allow registrations"
              description="Let new mess owners and members create accounts."
              checked={form.allowRegistrations}
              disabled={saving}
              onChange={(value) => update("allowRegistrations", value)}
            />
            <ToggleRow
              id="settings-auto-approve"
              label="Auto-approve listings"
              description="Publish new listings without manual moderation."
              checked={form.autoApproveListings}
              disabled={saving}
              onChange={(value) => update("autoApproveListings", value)}
            />
          </div>
        </Panel>

        <div className="flex flex-wrap gap-2">
          <button type="submit" className={btnDark} disabled={saving || loading}>
            <Save size={15} />
            {saving ? "Saving…" : "Save settings"}
          </button>
          <button type="button" className={btnGhost} onClick={reset} disabled={saving || loading || !saved}>
            <RotateCcw size={15} />
            Reset to loaded values
          </button>
        </div>
      </form>
    </div>
  );
}
