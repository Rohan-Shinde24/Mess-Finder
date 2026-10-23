"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  PauseCircle,
  RefreshCw,
  Search,
  Star,
  XCircle,
} from "lucide-react";
import {
  Badge,
  EmptyRow,
  Notice,
  Panel,
  Spinner,
  StatCard,
  TableShell,
  btnDark,
  btnGhost,
  formatDate,
  inputClass,
} from "@/components/admin/ui";

const filters = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "published", label: "Published" },
  { key: "rejected", label: "Rejected" },
  { key: "suspended", label: "Suspended" },
];

const statusTone = {
  published: "strong",
  pending: "alert",
  rejected: "neutral",
  suspended: "muted",
  draft: "muted",
  archived: "muted",
};

export default function AdminListingsPage() {
  const [messes, setMesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [reason, setReason] = useState({});

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/messes");
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || "Could not load listings");
    setMesses(data.messes || []);
  }, []);

  useEffect(() => {
    let cancelled = false;
    load()
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load listings");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [load]);

  async function act(id, action) {
    setBusyId(id);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/messes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, reason: reason[id] || "" }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Action failed");
      await load();
      setNotice(`Listing ${action === "approve" ? "approved and is now live" : `${action}ed`}.`);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setBusyId("");
    }
  }

  const counts = useMemo(
    () => ({
      all: messes.length,
      pending: messes.filter((mess) => mess.status === "pending").length,
      published: messes.filter((mess) => mess.status === "published").length,
      rejected: messes.filter((mess) => mess.status === "rejected").length,
      suspended: messes.filter((mess) => mess.status === "suspended").length,
    }),
    [messes]
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return messes
      .filter((mess) => (filter === "all" ? true : mess.status === filter))
      .filter((mess) => {
        if (!needle) return true;
        return (
          mess.name?.toLowerCase().includes(needle) ||
          mess.city?.toLowerCase().includes(needle) ||
          mess.ownerId?.email?.toLowerCase().includes(needle)
        );
      });
  }, [messes, filter, query]);

  return (
    <div className="space-y-6">
      {error && <Notice tone="error">{error}</Notice>}
      {notice && <Notice tone="success">{notice}</Notice>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="All listings" value={counts.all} />
        <StatCard label="Pending review" value={counts.pending} hint="Needs a decision" />
        <StatCard label="Published" value={counts.published} hint="Visible on the site" />
        <StatCard label="Rejected / suspended" value={counts.rejected + counts.suspended} />
      </div>

      <Panel
        title="Moderation queue"
        description="Approve, reject or suspend mess listings. Add a reason so the owner knows what to fix."
        actions={
          <>
            <button
              className={btnGhost}
              onClick={async () => {
                setError("");
                try {
                  await load();
                } catch (err) {
                  setError(err.message || "Could not refresh");
                }
              }}
            >
              <RefreshCw size={15} />
              Refresh
            </button>
          </>
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex min-w-[200px] flex-1 items-center gap-2">
            <Search size={16} className="shrink-0 text-zinc-400" />
            <input
              className={inputClass}
              placeholder="Search by mess name, city or owner email"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {filters.map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                aria-pressed={filter === item.key}
                className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  filter === item.key
                    ? "bg-zinc-900 text-white"
                    : "border border-zinc-300 bg-white text-zinc-600 hover:border-zinc-900 hover:text-zinc-900"
                }`}
              >
                {item.label} ({counts[item.key] ?? 0})
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          {loading ? (
            <Spinner label="Loading listings…" />
          ) : (
            <TableShell head={["Listing", "Owner", "Type & price", "Status", "Moderation"]}>
              {visible.map((mess) => (
                <tr key={mess._id} className="align-top">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-zinc-900">{mess.name}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {[mess.area, mess.city, mess.pincode].filter(Boolean).join(", ")}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-zinc-400">
                      <Star size={11} />
                      {mess.averageRating ? Number(mess.averageRating).toFixed(1) : "No ratings"} · created{" "}
                      {formatDate(mess.createdAt)}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-sm text-zinc-600">
                    <p className="font-medium text-zinc-900">{mess.ownerId?.name || "—"}</p>
                    <p className="text-xs text-zinc-500">{mess.ownerId?.email || ""}</p>
                  </td>

                  <td className="px-4 py-4 text-sm text-zinc-600">
                    <p className="capitalize">{mess.foodType || "both"}</p>
                    <p className="text-xs text-zinc-500">₹{mess.startingPrice}/month</p>
                  </td>

                  <td className="px-4 py-4">
                    <Badge tone={statusTone[mess.status] || "muted"}>{mess.status}</Badge>
                    {mess.moderationReason && (
                      <p className="mt-2 max-w-[180px] text-xs text-zinc-500">Note: {mess.moderationReason}</p>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <input
                      className={inputClass}
                      placeholder="Reason (optional)"
                      value={reason[mess._id] || ""}
                      onChange={(event) => setReason((prev) => ({ ...prev, [mess._id]: event.target.value }))}
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      <a
                        href={`/messlisting/${mess._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={btnGhost}
                      >
                        <ExternalLink size={14} />
                        View
                      </a>
                      {mess.status !== "published" && (
                        <button className={btnDark} disabled={busyId === mess._id} onClick={() => act(mess._id, "approve")}>
                          <CheckCircle2 size={14} />
                          Approve
                        </button>
                      )}
                      <button className={btnGhost} disabled={busyId === mess._id} onClick={() => act(mess._id, "reject")}>
                        <XCircle size={14} />
                        Reject
                      </button>
                      <button className={btnGhost} disabled={busyId === mess._id} onClick={() => act(mess._id, "suspend")}>
                        <PauseCircle size={14} />
                        Suspend
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!visible.length && <EmptyRow colSpan={5}>No listings match this view.</EmptyRow>}
            </TableShell>
          )}
        </div>
      </Panel>
    </div>
  );
}
