"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Ban,
  KeyRound,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
  UserPlus,
  Users,
  Store,
  X,
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
  btnDanger,
  btnGhost,
  formatDate,
  formatDateTime,
  inputClass,
  labelClass,
} from "@/components/admin/ui";

const roleLabel = { user: "User", owner: "Mess owner", admin: "Admin" };
const statusTone = { active: "strong", suspended: "alert", banned: "neutral" };
const emptyCreate = { name: "", email: "", password: "", phone: "", role: "user" };

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, owners: 0, suspended: 0, admins: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [query, setQuery] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [newestFirst, setNewestFirst] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreate);

  const [selected, setSelected] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", role: "user" });
  const [newPassword, setNewPassword] = useState("");
  const [reason, setReason] = useState("");

  const firstLoad = useRef(true);

  const loadList = useCallback(async () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (role) params.set("role", role);
    if (status) params.set("status", status);
    const response = await fetch(`/api/admin/users?${params.toString()}`);
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || "Could not load accounts");
    setUsers(data.users || []);
  }, [query, role, status]);

  const loadStats = useCallback(async () => {
    const response = await fetch("/api/admin/users");
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(data.message || "Could not load account totals");
    const list = data.users || [];
    setStats({
      total: list.length,
      owners: list.filter((item) => item.role === "owner").length,
      suspended: list.filter((item) => item.status === "suspended").length,
      admins: list.filter((item) => item.role === "admin").length,
    });
  }, []);

  const reload = useCallback(async () => {
    await Promise.all([loadList(), loadStats()]);
  }, [loadList, loadStats]);

  useEffect(() => {
    let active = true;
    const handle = setTimeout(
      async () => {
        try {
          await loadList();
        } catch (err) {
          if (active) setError(err.message || "Could not load accounts");
        } finally {
          if (active) setLoading(false);
        }
      },
      firstLoad.current ? 0 : 350
    );
    firstLoad.current = false;
    return () => {
      active = false;
      clearTimeout(handle);
    };
  }, [loadList]);

  useEffect(() => {
    let active = true;
    loadStats().catch((err) => {
      if (active) setError(err.message || "Could not load account totals");
    });
    return () => {
      active = false;
    };
  }, [loadStats]);

  async function refresh() {
    setRefreshing(true);
    setError("");
    try {
      await reload();
    } catch (err) {
      setError(err.message || "Could not refresh");
    } finally {
      setRefreshing(false);
    }
  }

  async function act(userId, action, extra = {}) {
    setBusyId(userId);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action, ...extra }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Action failed");

      if (action === "soft-delete") {
        setSelected(null);
        setNewPassword("");
      } else if (data.user && selected && selected._id === userId) {
        setSelected(data.user);
        setEditForm({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          role: data.user.role || "user",
        });
      }

      setNotice(data.message || "User updated");
      try {
        await reload();
      } catch (err) {
        setError(err.message || "Could not refresh accounts");
      }
      return data;
    } catch (err) {
      setError(err.message || "Something went wrong");
      return null;
    } finally {
      setBusyId("");
    }
  }

  function selectUser(user) {
    setSelected(user);
    setEditForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "user",
    });
    setNewPassword("");
  }

  function closeManage() {
    setSelected(null);
    setNewPassword("");
  }

  function confirmDelete(user) {
    const confirmed = window.confirm(
      `Move ${user.name}'s account to the Recycle bin?\n\nThis hides the account from the platform but does not permanently delete it — you can restore it later from the Recycle bin.`
    );
    if (confirmed) act(user._id, "soft-delete");
  }

  async function saveChanges() {
    if (!selected) return;
    await act(selected._id, "update", {
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      role: editForm.role,
    });
  }

  async function resetPassword() {
    if (!selected || newPassword.length < 8) return;
    const result = await act(selected._id, "reset-password", { newPassword });
    if (result) setNewPassword("");
  }

  async function createAccount(event) {
    event.preventDefault();
    if (creating) return;
    setCreating(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Could not create account");
      setNotice(data.message || "Account created");
      setCreateForm(emptyCreate);
      setShowCreate(false);
      try {
        await reload();
      } catch (err) {
        setError(err.message || "Could not refresh accounts");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setCreating(false);
    }
  }

  const visible = useMemo(() => {
    const list = [...users];
    list.sort((a, b) => {
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return newestFirst ? -diff : diff;
    });
    return list;
  }, [users, newestFirst]);

  return (
    <div className="space-y-6">
      {error && <Notice tone="error">{error}</Notice>}
      {notice && <Notice tone="success">{notice}</Notice>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total accounts" value={stats.total} hint="Registered accounts" icon={Users} />
        <StatCard label="Mess owners" value={stats.owners} hint="Accounts that list messes" icon={Store} />
        <StatCard label="Suspended" value={stats.suspended} hint="Currently restricted" icon={Ban} />
        <StatCard label="Admins" value={stats.admins} hint="Full-access accounts" icon={UserCog} />
      </div>

      {selected && (
        <Panel
          title="Manage account"
          description={`Editing ${selected.email}`}
          actions={
            <button className={btnGhost} onClick={closeManage}>
              <X size={15} />
              Close
            </button>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="manage-name">
                Name
              </label>
              <input
                id="manage-name"
                className={inputClass}
                value={editForm.name}
                onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="manage-email">
                Email
              </label>
              <input
                id="manage-email"
                type="email"
                className={inputClass}
                value={editForm.email}
                onChange={(event) => setEditForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="manage-phone">
                Phone
              </label>
              <input
                id="manage-phone"
                className={inputClass}
                value={editForm.phone}
                placeholder="Optional"
                onChange={(event) => setEditForm((prev) => ({ ...prev, phone: event.target.value }))}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="manage-role">
                Role
              </label>
              <select
                id="manage-role"
                className={inputClass}
                value={editForm.role}
                onChange={(event) => setEditForm((prev) => ({ ...prev, role: event.target.value }))}
              >
                <option value="user">User</option>
                <option value="owner">Mess owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button className={btnDark} disabled={busyId === selected._id} onClick={saveChanges}>
              <Save size={15} />
              Save changes
            </button>
          </div>

          <div className="mt-5 space-y-4 border-t border-zinc-200 pt-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="manage-password">
                  New password
                </label>
                <input
                  id="manage-password"
                  type="password"
                  minLength={8}
                  className={inputClass}
                  value={newPassword}
                  placeholder="At least 8 characters"
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </div>
              <div className="flex items-end">
                <button
                  className={btnDanger}
                  disabled={busyId === selected._id || newPassword.length < 8}
                  onClick={resetPassword}
                >
                  <KeyRound size={15} />
                  Reset password
                </button>
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="manage-reason">
                Moderation reason
              </label>
              <input
                id="manage-reason"
                className={inputClass}
                value={reason}
                placeholder="Sent with Suspend or Ban actions"
                onChange={(event) => setReason(event.target.value)}
              />
            </div>
          </div>
        </Panel>
      )}

      {showCreate && (
        <Panel
          title="Add account"
          description="Create a new user, mess owner or administrator account."
          actions={
            <button className={btnGhost} onClick={() => setShowCreate(false)}>
              <X size={15} />
              Cancel
            </button>
          }
        >
          <form onSubmit={createAccount} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="create-name">
                  Name
                </label>
                <input
                  id="create-name"
                  required
                  minLength={2}
                  className={inputClass}
                  value={createForm.name}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="create-email">
                  Email
                </label>
                <input
                  id="create-email"
                  type="email"
                  required
                  className={inputClass}
                  value={createForm.email}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="create-password">
                  Password
                </label>
                <input
                  id="create-password"
                  type="password"
                  required
                  minLength={8}
                  className={inputClass}
                  value={createForm.password}
                  placeholder="At least 8 characters"
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, password: event.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="create-phone">
                  Phone
                </label>
                <input
                  id="create-phone"
                  className={inputClass}
                  value={createForm.phone}
                  placeholder="Optional"
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, phone: event.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="create-role">
                  Role
                </label>
                <select
                  id="create-role"
                  className={inputClass}
                  value={createForm.role}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, role: event.target.value }))}
                >
                  <option value="user">User</option>
                  <option value="owner">Mess owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <button className={btnDark} type="submit" disabled={creating}>
              <UserPlus size={15} />
              {creating ? "Creating…" : "Create account"}
            </button>
          </form>
        </Panel>
      )}

      <Panel
        title="Accounts"
        description="Search, filter and moderate platform accounts. Suspended and banned accounts are locked out of login."
        actions={
          <>
            <button className={btnGhost} onClick={refresh} disabled={refreshing}>
              <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
            <button className={showCreate ? btnGhost : btnDark} onClick={() => setShowCreate((prev) => !prev)}>
              {showCreate ? (
                <>
                  <X size={15} />
                  Cancel
                </>
              ) : (
                <>
                  <UserPlus size={15} />
                  Add account
                </>
              )}
            </button>
          </>
        }
      >
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <label className={labelClass} htmlFor="user-search">
              Search
            </label>
            <div className="flex items-center gap-2">
              <Search size={16} className="shrink-0 text-zinc-400" />
              <input
                id="user-search"
                className={inputClass}
                placeholder="Search by name or email"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>
          <div>
            <label className={labelClass} htmlFor="role-filter">
              Role
            </label>
            <select
              id="role-filter"
              className={inputClass}
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="">All roles</option>
              <option value="user">User</option>
              <option value="owner">Mess owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="status-filter">
              Status
            </label>
            <select
              id="status-filter"
              className={inputClass}
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="banned">Banned</option>
            </select>
          </div>
          <div>
            <span className={labelClass}>Sort by registered</span>
            <button className={btnGhost} onClick={() => setNewestFirst((prev) => !prev)}>
              {newestFirst ? "Newest first" : "Oldest first"}
            </button>
          </div>
        </div>

        <div className="mt-5">
          {loading ? (
            <Spinner label="Loading accounts…" />
          ) : (
            <TableShell head={["Account", "Role", "Status", "Phone", "Registered", "Actions"]}>
              {visible.map((user) => (
                <tr key={user._id} className="align-top">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-zinc-900">{user.name}</p>
                    <p className="mt-0.5 text-xs text-zinc-500">{user.email}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-zinc-700">{roleLabel[user.role] || user.role}</td>
                  <td className="px-4 py-4">
                    <Badge tone={statusTone[user.status] || "neutral"}>{user.status}</Badge>
                    {user.banUntil && <p className="mt-1 text-xs text-zinc-500">Until {formatDate(user.banUntil)}</p>}
                    {user.banReason && <p className="mt-1 max-w-[180px] text-xs text-zinc-500">Reason: {user.banReason}</p>}
                  </td>
                  <td className="px-4 py-4 text-sm text-zinc-600">{user.phone || "—"}</td>
                  <td className="px-4 py-4 text-sm tabular-nums text-zinc-600">{formatDateTime(user.createdAt)}</td>
                  <td className="px-4 py-4">
                    {user.role === "admin" ? (
                      <Badge tone="muted">
                        <ShieldCheck size={11} />
                        Protected
                      </Badge>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <button
                          className={btnGhost}
                          disabled={busyId === user._id}
                          onClick={() => selectUser(user)}
                          aria-label={`Manage ${user.name}`}
                        >
                          Manage
                        </button>
                        {user.status === "active" ? (
                          <>
                            <button
                              className={btnGhost}
                              disabled={busyId === user._id}
                              onClick={() => act(user._id, "suspend", { days: 7, reason })}
                              aria-label={`Suspend ${user.name} for 7 days`}
                            >
                              Suspend 7 days
                            </button>
                            <button
                              className={btnGhost}
                              disabled={busyId === user._id}
                              onClick={() => act(user._id, "ban", { reason })}
                              aria-label={`Ban ${user.name}`}
                            >
                              Ban
                            </button>
                          </>
                        ) : (
                          <button
                            className={btnDark}
                            disabled={busyId === user._id}
                            onClick={() => act(user._id, "unsuspend")}
                            aria-label={`Unsuspend ${user.name}`}
                          >
                            Unsuspend
                          </button>
                        )}
                        <button
                          className={btnDanger}
                          disabled={busyId === user._id}
                          onClick={() => confirmDelete(user)}
                          aria-label={`Delete ${user.name}`}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {!visible.length && <EmptyRow colSpan={6}>No accounts match this view.</EmptyRow>}
            </TableShell>
          )}
        </div>
      </Panel>
    </div>
  );
}
