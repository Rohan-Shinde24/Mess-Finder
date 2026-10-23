"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Ban, CalendarDays, RefreshCw, RotateCcw, ShieldCheck, Trash2 } from "lucide-react";
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
  formatDateTime,
} from "@/components/admin/ui";

const roleLabel = { user: "User", owner: "Mess owner", admin: "Admin" };
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default function AdminRecycleBinPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/users?deleted=1");
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || "Could not load the recycle bin");
    setUsers(data.users || []);
  }, []);

  useEffect(() => {
    let active = true;
    load()
      .catch((err) => {
        if (active) setError(err.message || "Could not load the recycle bin");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [load]);

  async function refresh() {
    setRefreshing(true);
    setError("");
    try {
      await load();
    } catch (err) {
      setError(err.message || "Could not refresh");
    } finally {
      setRefreshing(false);
    }
  }

  async function restore(user) {
    setBusyId(user._id);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, action: "restore" }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Could not restore the account");
      setNotice(data.message || "User restored");
      await load();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setBusyId("");
    }
  }

  async function purge(user) {
    const confirmed = window.confirm(
      `Permanently delete ${user.name}'s account?\n\nThis cannot be undone — the account and its data will be removed for good.`
    );
    if (!confirmed) return;
    setBusyId(user._id);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/users?id=${encodeURIComponent(user._id)}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Could not delete the account");
      setNotice(data.message || "User permanently deleted");
      await load();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setBusyId("");
    }
  }

  const stats = useMemo(() => {
    const now = Date.now();
    return {
      total: users.length,
      suspended: users.filter((user) => user.status === "suspended").length,
      thisWeek: users.filter((user) => user.deletedAt && now - new Date(user.deletedAt).getTime() <= WEEK_MS).length,
    };
  }, [users]);

  return (
    <div className="space-y-6">
      {error && <Notice tone="error">{error}</Notice>}
      {notice && <Notice tone="success">{notice}</Notice>}

      <Notice tone="info">
        Deleted accounts are hidden from the platform but kept here. You can restore them at any time, or delete them
        permanently — permanent deletion cannot be undone.
      </Notice>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Deleted accounts" value={stats.total} hint="Waiting in the recycle bin" icon={Trash2} />
        <StatCard label="Suspended" value={stats.suspended} hint="Among deleted accounts" icon={Ban} />
        <StatCard label="Deleted this week" value={stats.thisWeek} hint="By deletion date" icon={CalendarDays} />
      </div>

      <Panel
        title="Deleted accounts"
        description="Restore an account to bring it back, or delete it forever. Archived mess listings are handled on the Listings page."
        actions={
          <>
            <Link className={btnGhost} href="/admin/users">
              <ArrowLeft size={15} />
              Back to all users
            </Link>
            <button className={btnGhost} onClick={refresh} disabled={refreshing}>
              <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </>
        }
      >
        {loading ? (
          <Spinner label="Loading the recycle bin…" />
        ) : (
          <TableShell head={["Account", "Role", "Deleted at", "Actions"]}>
            {users.map((user) => (
              <tr key={user._id} className="align-top">
                <td className="px-4 py-4">
                  <p className="font-semibold text-zinc-900">{user.name}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">{user.email}</p>
                </td>
                <td className="px-4 py-4 text-sm text-zinc-700">{roleLabel[user.role] || user.role}</td>
                <td className="px-4 py-4 text-sm tabular-nums text-zinc-600">{formatDateTime(user.deletedAt)}</td>
                <td className="px-4 py-4">
                  {user.role === "admin" ? (
                    <Badge tone="muted">
                      <ShieldCheck size={11} />
                      Protected
                    </Badge>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <button
                        className={btnDark}
                        disabled={busyId === user._id}
                        onClick={() => restore(user)}
                        aria-label={`Restore ${user.name}`}
                      >
                        <RotateCcw size={14} />
                        Restore
                      </button>
                      <button
                        className={btnDanger}
                        disabled={busyId === user._id}
                        onClick={() => purge(user)}
                        aria-label={`Delete ${user.name} forever`}
                      >
                        <Trash2 size={14} />
                        Delete forever
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}

            {!users.length && <EmptyRow colSpan={4}>The recycle bin is empty.</EmptyRow>}
          </TableShell>
        )}

        <p className="mt-4 text-xs text-zinc-500">
          Deleted mess listings are not shown here; archived listings are managed on the Listings page.
        </p>
      </Panel>
    </div>
  );
}
