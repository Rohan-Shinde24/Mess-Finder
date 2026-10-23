"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Bell,
  FileDown,
  LayoutList,
  LifeBuoy,
  Megaphone,
  RefreshCw,
  Star,
  Trash2,
  TrendingUp,
  UserCog,
  Users,
} from "lucide-react";
import { BarList, ColumnChart, DonutChart } from "@/components/admin/charts";
import { Notice, Panel, Spinner, StatCard, btnGhost, formatDateTime } from "@/components/admin/ui";

function shortDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/stats");
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || "Could not load analytics");
    setStats(data.stats);
  }, []);

  useEffect(() => {
    let cancelled = false;
    load()
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load analytics");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [load]);

  async function refresh() {
    setBusy(true);
    setError("");
    try {
      await load();
    } catch (err) {
      setError(err.message || "Could not refresh");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <Spinner label="Loading analytics…" />;
  if (error && !stats) return <Notice tone="error">{error}</Notice>;

  const totals = stats?.totals || {};

  return (
    <div className="space-y-6">
      {error && <Notice tone="error">{error}</Notice>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-500">
          Platform health at a glance. All figures are computed live from the database.
        </p>
        <button className={btnGhost} onClick={refresh} disabled={busy}>
          <RefreshCw size={15} className={busy ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={totals.users ?? 0} hint={`${totals.owners ?? 0} mess owners`} icon={Users} />
        <StatCard label="Total listings" value={totals.messes ?? 0} hint={`${totals.published ?? 0} published`} icon={LayoutList} />
        <StatCard label="Pending review" value={totals.pending ?? 0} hint="Awaiting your approval" icon={Activity} />
        <StatCard label="Reviews" value={totals.reviews ?? 0} hint="Rating submissions" icon={Star} />
        <StatCard label="Active ads" value={totals.activeAds ?? 0} hint={`${totals.ads ?? 0} total ads`} icon={Megaphone} />
        <StatCard label="Open support" value={totals.openSupport ?? 0} hint="Tickets needing a reply" icon={LifeBuoy} />
        <StatCard label="Administrators" value={totals.admins ?? 0} hint="Full-access accounts" icon={UserCog} />
        <StatCard
          label="Recycle bin"
          value={(totals.deletedUsers ?? 0) + (totals.deletedMesses ?? 0)}
          hint={`${totals.deletedUsers ?? 0} users · ${totals.deletedMesses ?? 0} listings`}
          icon={Trash2}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="New registrations" description="Accounts created in the last 14 days">
          <ColumnChart
            data={(stats?.registrations || []).map((point) => ({ label: shortDate(point.date), value: point.count }))}
          />
        </Panel>

        <Panel title="Listings created" description="Mess listings submitted in the last 14 days">
          <ColumnChart
            data={(stats?.listingsCreated || []).map((point) => ({ label: shortDate(point.date), value: point.count }))}
          />
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Listings by status">
          <DonutChart
            segments={(stats?.messesByStatus || []).map((row) => ({ label: row.status, value: row.count }))}
          />
        </Panel>

        <Panel title="Top cities" description="Published listings per city">
          <BarList data={(stats?.topCities || []).map((row) => ({ label: row.city, value: row.count }))} />
        </Panel>

        <Panel title="Accounts by role">
          <BarList data={(stats?.usersByRole || []).map((row) => ({ label: row.role, value: row.count }))} />
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="Recent moderation activity"
          description="Latest recorded admin actions"
          actions={
            <Link className={btnGhost} href="/admin/notifications">
              <Bell size={15} />
              Full log
            </Link>
          }
        >
          <ul className="divide-y divide-zinc-100">
            {(stats?.recentAudit || []).map((entry, index) => (
              <li key={`${entry.action}-${index}`} className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-900">{entry.action}</p>
                  <p className="truncate text-xs text-zinc-500">
                    {entry.actor?.name || "Unknown admin"}
                    {entry.actor?.email ? ` · ${entry.actor.email}` : ""}
                  </p>
                </div>
                <span className="shrink-0 text-xs tabular-nums text-zinc-400">{formatDateTime(entry.createdAt)}</span>
              </li>
            ))}
            {!stats?.recentAudit?.length && <li className="py-6 text-center text-sm text-zinc-400">No activity recorded yet.</li>}
          </ul>
        </Panel>

        <div className="space-y-6">
          <Panel title="Support tickets by status">
            <BarList data={(stats?.supportByStatus || []).map((row) => ({ label: row.status, value: row.count }))} />
          </Panel>

          <Panel title="Quick actions">
            <div className="grid gap-2 sm:grid-cols-2">
              <Link className={btnGhost} href="/admin/listings">
                <LayoutList size={15} />
                Moderate listings
              </Link>
              <Link className={btnGhost} href="/admin/users">
                <Users size={15} />
                Manage users
              </Link>
              <Link className={btnGhost} href="/admin/reports">
                <FileDown size={15} />
                Download reports
              </Link>
              <Link className={btnGhost} href="/admin/settings">
                <TrendingUp size={15} />
                Platform settings
              </Link>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
