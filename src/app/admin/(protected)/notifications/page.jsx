"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, Bell, RefreshCw, Search, Send } from "lucide-react";
import {
  Badge,
  Notice,
  Panel,
  Spinner,
  StatCard,
  btnDark,
  btnGhost,
  formatDateTime,
  inputClass,
  labelClass,
} from "@/components/admin/ui";

export default function AdminNotificationsPage() {
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [totals, setTotals] = useState({ activities: 0, notifications: 0, unread: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(15);
  const [message, setMessage] = useState("");
  const [href, setHref] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/notifications");
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || "Could not load activity");
    setActivities(Array.isArray(data.activities) ? data.activities : []);
    setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
    setTotals(data.totals || { activities: 0, notifications: 0, unread: 0 });
  }, []);

  useEffect(() => {
    let cancelled = false;
    load()
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load activity");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [load]);

  const filteredActivities = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return activities;
    return activities.filter((entry) => {
      const actorName = entry.actorId?.name || entry.actor?.name || "";
      const actorEmail = entry.actorId?.email || entry.actor?.email || "";
      return (
        String(entry.action || "").toLowerCase().includes(needle) ||
        actorName.toLowerCase().includes(needle) ||
        actorEmail.toLowerCase().includes(needle)
      );
    });
  }, [activities, query]);

  const visibleActivities = filteredActivities.slice(0, limit);

  async function broadcast(event) {
    event.preventDefault();
    const text = message.trim();
    if (!text) {
      setError("Write a message to broadcast.");
      return;
    }
    setSending(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, href: href.trim() }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Could not send the notification");
      setNotice(`Notification sent to ${data.sent ?? 0} users.`);
      setMessage("");
      setHref("");
      await load();
    } catch (err) {
      setError(err.message || "Could not send the notification");
    } finally {
      setSending(false);
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

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Activity entries" value={totals.activities ?? 0} icon={Activity} hint="Recorded admin actions" />
        <StatCard label="Notifications" value={totals.notifications ?? 0} icon={Bell} hint="Delivered to users" />
        <StatCard label="Unread" value={totals.unread ?? 0} hint="Not opened yet" />
      </div>

      <Panel
        title="Broadcast a notification"
        description="Send an in-app notification to every active user on the platform."
      >
        <form className="space-y-4" onSubmit={broadcast}>
          <div>
            <div className="flex items-center justify-between">
              <label className={labelClass} htmlFor="broadcast-message">
                Message
              </label>
              <span className="mb-1.5 text-xs tabular-nums text-zinc-400">{message.length}/500</span>
            </div>
            <textarea
              id="broadcast-message"
              className={`${inputClass} min-h-[110px] resize-y`}
              value={message}
              maxLength={500}
              placeholder="Tell everyone about a new feature or scheduled maintenance…"
              onChange={(event) => setMessage(event.target.value.slice(0, 500))}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="broadcast-href">
              Link (optional)
            </label>
            <input
              id="broadcast-href"
              className={inputClass}
              value={href}
              placeholder="/admin/reports"
              onChange={(event) => setHref(event.target.value)}
            />
          </div>

          <button type="submit" className={btnDark} disabled={sending || !message.trim()}>
            <Send size={15} />
            {sending ? "Sending…" : "Send to all users"}
          </button>
        </form>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel
          title="Admin activity"
          description="Newest recorded admin actions."
          actions={
            <button className={btnGhost} onClick={refresh}>
              <RefreshCw size={15} />
              Refresh
            </button>
          }
        >
          <div className="mb-4 flex items-center gap-2">
            <Search size={16} className="shrink-0 text-zinc-400" />
            <input
              className={inputClass}
              placeholder="Filter by action or admin"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setLimit(15);
              }}
            />
          </div>

          {loading ? (
            <Spinner label="Loading activity…" />
          ) : (
            <>
              <ul className="divide-y divide-zinc-100">
                {visibleActivities.map((entry) => (
                  <li key={entry._id} className="flex items-start justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-zinc-900">{entry.action || "Unknown action"}</p>
                      <p className="truncate text-xs text-zinc-500">
                        {entry.actorId?.name || entry.actor?.name || "Unknown admin"}
                        {entry.actorId?.email || entry.actor?.email
                          ? ` · ${entry.actorId?.email || entry.actor?.email}`
                          : ""}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs tabular-nums text-zinc-400">{formatDateTime(entry.createdAt)}</span>
                  </li>
                ))}
                {!visibleActivities.length && (
                  <li className="py-6 text-center text-sm text-zinc-400">No activity matches this filter.</li>
                )}
              </ul>

              {filteredActivities.length > limit && (
                <button className={`${btnGhost} mt-4`} onClick={() => setLimit((prev) => prev + 15)}>
                  Show more
                </button>
              )}
            </>
          )}
        </Panel>

        <Panel title="Notifications sent" description="The 50 most recent notifications delivered to users.">
          {loading ? (
            <Spinner label="Loading notifications…" />
          ) : (
            <ul className="divide-y divide-zinc-100">
              {notifications.map((item) => (
                <li key={item._id} className="py-3">
                  <div className="flex items-start justify-between gap-4">
                    <p className="min-w-0 flex-1 text-sm text-zinc-700">{item.message || "—"}</p>
                    <Badge tone={item.readAt ? "muted" : "strong"}>{item.readAt ? "Read" : "Unread"}</Badge>
                  </div>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-zinc-500">
                    <span className="capitalize">{item.type || "notification"}</span>
                    <span>·</span>
                    <span>{item.recipientId?.name || "Unknown"}</span>
                    {item.recipientId?.email ? <span>· {item.recipientId.email}</span> : null}
                  </p>
                  <p className="mt-0.5 text-xs tabular-nums text-zinc-400">{formatDateTime(item.createdAt)}</p>
                </li>
              ))}
              {!notifications.length && (
                <li className="py-6 text-center text-sm text-zinc-400">No notifications have been sent yet.</li>
              )}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
