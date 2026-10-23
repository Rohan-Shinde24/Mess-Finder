"use client";

import { useCallback, useEffect, useState } from "react";
import { LifeBuoy, RefreshCw, Send, X } from "lucide-react";
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
  formatDateTime,
  inputClass,
  labelClass,
} from "@/components/admin/ui";

const STATUSES = ["open", "in-progress", "waiting-customer", "resolved", "closed"];

const statusFilters = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "in-progress", label: "In progress" },
  { key: "waiting-customer", label: "Waiting on customer" },
  { key: "resolved", label: "Resolved" },
  { key: "closed", label: "Closed" },
];

const statusTone = {
  open: "alert",
  "in-progress": "neutral",
  "waiting-customer": "muted",
  resolved: "strong",
  closed: "muted",
};

const priorityTone = { urgent: "alert", high: "alert", normal: "neutral", low: "muted" };

function messageText(message) {
  if (!message) return "";
  if (typeof message === "string") return message;
  return message.message || message.body || "";
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [counts, setCounts] = useState({ all: 0, open: 0, "in-progress": 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [replyStatus, setReplyStatus] = useState("open");
  const [submitting, setSubmitting] = useState(false);
  const [closing, setClosing] = useState(false);

  const loadTickets = useCallback(async (status) => {
    const suffix = status && status !== "all" ? `?status=${encodeURIComponent(status)}` : "";
    const response = await fetch(`/api/admin/support${suffix}`);
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || "Could not load tickets");
    return Array.isArray(data.tickets) ? data.tickets : [];
  }, []);

  const loadCounts = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/support");
      const data = await response.json();
      if (!response.ok || !data.success) return;
      const rows = Array.isArray(data.tickets) ? data.tickets : [];
      setCounts({
        all: rows.length,
        open: rows.filter((ticket) => ticket.status === "open").length,
        "in-progress": rows.filter((ticket) => ticket.status === "in-progress").length,
        resolved: rows.filter((ticket) => ticket.status === "resolved").length,
      });
    } catch {
      /* counts are best-effort */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadTickets(filter)
      .then((rows) => {
        if (!cancelled) setTickets(rows);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Could not load tickets");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [filter, loadTickets]);

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  const refreshList = useCallback(async () => {
    const [rows] = await Promise.all([loadTickets(filter), loadCounts()]);
    setTickets(rows);
  }, [filter, loadTickets, loadCounts]);

  function openTicket(ticket) {
    setSelected(ticket);
    setReply("");
    setReplyStatus(ticket.status || "open");
    setError("");
    setNotice("");
  }

  async function sendReply() {
    if (!selected) return;
    const text = reply.trim();
    if (!text) {
      setError("Write a reply before sending.");
      return;
    }
    setSubmitting(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: selected._id, reply: text }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Could not send reply");
      setNotice(data.message || "Reply sent.");
      setReply("");
      if (data.ticket) {
        setSelected(data.ticket);
        setReplyStatus(data.ticket.status || "waiting-customer");
      }
      await refreshList();
    } catch (err) {
      setError(err.message || "Could not send reply");
    } finally {
      setSubmitting(false);
    }
  }

  async function closeTicket() {
    if (!selected) return;
    setClosing(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/support", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: selected._id, status: "closed" }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Could not close ticket");
      setNotice(data.message || "Ticket closed.");
      if (data.ticket) {
        setSelected(data.ticket);
        setReplyStatus("closed");
      }
      await refreshList();
    } catch (err) {
      setError(err.message || "Could not close ticket");
    } finally {
      setClosing(false);
    }
  }

  async function refresh() {
    setError("");
    try {
      await refreshList();
    } catch (err) {
      setError(err.message || "Could not refresh");
    }
  }

  return (
    <div className="space-y-6">
      {error && <Notice tone="error">{error}</Notice>}
      {notice && <Notice tone="success">{notice}</Notice>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total tickets" value={counts.all} icon={LifeBuoy} />
        <StatCard label="Open" value={counts.open} hint="Waiting for a first reply" />
        <StatCard label="In progress" value={counts["in-progress"]} hint="Being handled" />
        <StatCard label="Resolved" value={counts.resolved} hint="Closed out" />
      </div>

      {selected && (
        <Panel
          title={`Ticket ${selected.ticketNumber || ""}`}
          description={selected.subject || "No subject"}
          actions={
            <button className={btnGhost} onClick={() => setSelected(null)} aria-label="Close ticket detail">
              <X size={15} />
              Close
            </button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className={labelClass}>From</p>
              <p className="text-sm font-semibold text-zinc-900">{selected.createdBy?.name || "—"}</p>
              <p className="text-xs text-zinc-500">{selected.createdBy?.email || ""}</p>
            </div>
            <div>
              <p className={labelClass}>Category</p>
              <p className="text-sm capitalize text-zinc-700">{selected.category || "other"}</p>
            </div>
            <div>
              <p className={labelClass}>Priority</p>
              <Badge tone={priorityTone[selected.priority] || "neutral"}>{selected.priority || "normal"}</Badge>
            </div>
            <div>
              <p className={labelClass}>Status</p>
              <Badge tone={statusTone[selected.status] || "muted"}>{selected.status || "open"}</Badge>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Latest message · {selected.messageCount || 0} total
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">
              {messageText(selected.latestMessage) || "No messages on this ticket yet."}
            </p>
            {selected.latestMessage?.createdAt && (
              <p className="mt-2 text-xs text-zinc-400">{formatDateTime(selected.latestMessage.createdAt)}</p>
            )}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div>
              <label className={labelClass} htmlFor="ticket-reply">
                Reply
              </label>
              <textarea
                id="ticket-reply"
                className={`${inputClass} min-h-[120px] resize-y`}
                value={reply}
                maxLength={5000}
                placeholder="Type your response to the customer…"
                onChange={(event) => setReply(event.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="ticket-status">
                Status
              </label>
              <select
                id="ticket-status"
                className={inputClass}
                value={replyStatus}
                onChange={(event) => setReplyStatus(event.target.value)}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-zinc-500">
                Sending a reply moves the ticket to &ldquo;waiting-customer&rdquo; automatically.
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button className={btnDark} onClick={sendReply} disabled={submitting || closing || !reply.trim()}>
              <Send size={15} />
              {submitting ? "Sending…" : "Send reply"}
            </button>
            <button className={btnGhost} onClick={closeTicket} disabled={submitting || closing}>
              {closing ? "Closing…" : "Close ticket"}
            </button>
          </div>
        </Panel>
      )}

      <Panel
        title="Support inbox"
        description="Customer tickets from across the platform."
        actions={
          <button className={btnGhost} onClick={refresh}>
            <RefreshCw size={15} />
            Refresh
          </button>
        }
      >
        <div className="flex flex-wrap gap-1.5">
          {statusFilters.map((item) => (
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
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-5">
          {loading ? (
            <Spinner label="Loading tickets…" />
          ) : (
            <TableShell head={["Ticket", "From", "Category", "Priority", "Status", "Created", "Actions"]}>
              {tickets.map((ticket) => (
                <tr key={ticket._id} className="align-top">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-zinc-900">{ticket.ticketNumber || "—"}</p>
                    <p className="mt-0.5 max-w-[260px] truncate text-xs text-zinc-500">{ticket.subject || "No subject"}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-zinc-600">
                    <p className="font-medium text-zinc-900">{ticket.createdBy?.name || "—"}</p>
                    <p className="text-xs text-zinc-500">{ticket.createdBy?.email || ""}</p>
                  </td>
                  <td className="px-4 py-4 text-sm capitalize text-zinc-600">{ticket.category || "other"}</td>
                  <td className="px-4 py-4">
                    <Badge tone={priorityTone[ticket.priority] || "neutral"}>{ticket.priority || "normal"}</Badge>
                  </td>
                  <td className="px-4 py-4">
                    <Badge tone={statusTone[ticket.status] || "muted"}>{ticket.status || "open"}</Badge>
                  </td>
                  <td className="px-4 py-4 text-sm text-zinc-600">{formatDate(ticket.createdAt)}</td>
                  <td className="px-4 py-4">
                    <button
                      className={btnGhost}
                      onClick={() => openTicket(ticket)}
                      aria-label={`Open ticket ${ticket.ticketNumber || ""}`}
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}

              {!tickets.length && <EmptyRow colSpan={7}>No tickets match this view.</EmptyRow>}
            </TableShell>
          )}
        </div>
      </Panel>
    </div>
  );
}
