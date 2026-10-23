import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Notification from "@/models/Notification";
import AuditLog from "@/models/AuditLog";
import { requireAdmin } from "@/lib/auth";
import { ok, fail } from "@/lib/api-response";
import { handleError } from "@/lib/error-handler";

const ROLES = ["user", "owner", "admin"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function publicUser(user) {
  if (!user) return null;
  return {
    _id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || "",
    status: user.status,
    banUntil: user.banUntil || null,
    banReason: user.banReason || "",
    isDeleted: !!user.isDeleted,
    deletedAt: user.deletedAt || null,
    createdAt: user.createdAt,
  };
}

export async function GET(request) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;
    await connectDB();

    const { searchParams } = new URL(request.url);
    const filter = {};
    filter.isDeleted = searchParams.get("deleted") === "1" ? true : { $ne: true };

    const role = searchParams.get("role");
    if (role && ROLES.includes(role)) filter.role = role;

    const status = searchParams.get("status");
    if (status) filter.status = status;

    const q = (searchParams.get("q") || "").trim();
    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ name: rx }, { email: rx }];
    }

    const users = await User.find(filter).select("-password").sort({ createdAt: -1 }).limit(500).lean();
    return ok({ users: users.map(publicUser), total: users.length });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    const body = await request.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const role = body.role || "user";
    const phone = String(body.phone || "").trim().slice(0, 20);

    if (name.length < 2 || name.length > 80) return fail("Name must be between 2 and 80 characters", 400);
    if (!EMAIL_RE.test(email)) return fail("Enter a valid email address", 400);
    if (password.length < 8) return fail("Password must be at least 8 characters", 400);
    if (!ROLES.includes(role)) return fail("Role must be one of: user, owner, admin", 400);

    await connectDB();
    const exists = await User.findOne({ email });
    if (exists) return fail("An account with this email already exists", 409);

    const hash = await bcrypt.hash(password, 12);
    const created = await User.create({ name, email, password: hash, role, phone });
    return ok({ message: "Account created", user: publicUser(created) }, 201);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request) {
  try {
    const { user: admin, response } = await requireAdmin();
    if (response) return response;

    const body = await request.json();
    const { userId, action } = body;
    const actions = ["suspend", "ban", "unsuspend", "soft-delete", "restore", "update", "reset-password"];
    const protectedActions = ["suspend", "ban", "soft-delete", "reset-password"];

    if (!mongoose.isValidObjectId(userId)) return fail("Invalid user ID", 400);
    if (!actions.includes(action)) return fail("Invalid action", 400);

    await connectDB();
    const target = await User.findById(userId);
    if (!target) return fail("User not found", 404);

    const isSelf = String(target._id) === String(admin._id);
    if (protectedActions.includes(action)) {
      if (target.role === "admin") return fail("Administrator accounts are protected", 403);
      if (isSelf && (action === "ban" || action === "soft-delete")) return fail("You cannot ban or delete your own account", 403);
    }

    const update = {};

    if (action === "suspend") {
      const days = Math.max(1, Math.min(365, Number(body.days) || 7));
      update.status = "suspended";
      update.banUntil = new Date(Date.now() + days * 86400000);
      update.banReason = String(body.reason || "").slice(0, 500);
    } else if (action === "ban") {
      update.status = "banned";
      update.banUntil = null;
      update.banReason = String(body.reason || "").slice(0, 500);
    } else if (action === "unsuspend") {
      update.status = "active";
      update.banUntil = null;
      update.banReason = "";
    } else if (action === "soft-delete") {
      update.isDeleted = true;
      update.deletedAt = new Date();
      update.deletedBy = admin._id;
      update.status = "suspended";
    } else if (action === "restore") {
      update.isDeleted = false;
      update.deletedAt = null;
      update.deletedBy = null;
      update.status = "active";
    } else if (action === "update") {
      if (body.name !== undefined) {
        const name = String(body.name).trim();
        if (name.length < 2 || name.length > 80) return fail("Name must be between 2 and 80 characters", 400);
        update.name = name;
      }
      if (body.email !== undefined) {
        const email = String(body.email).trim().toLowerCase();
        if (!EMAIL_RE.test(email)) return fail("Enter a valid email address", 400);
        const duplicate = await User.findOne({ email, _id: { $ne: target._id } });
        if (duplicate) return fail("An account with this email already exists", 409);
        update.email = email;
      }
      if (body.phone !== undefined) update.phone = String(body.phone).trim().slice(0, 20);
      if (body.role !== undefined) {
        if (!ROLES.includes(body.role)) return fail("Role must be one of: user, owner, admin", 400);
        update.role = body.role;
      }
      if (!Object.keys(update).length) return fail("Nothing to update", 400);
    } else if (action === "reset-password") {
      const newPassword = String(body.newPassword || "");
      if (newPassword.length < 8) return fail("Password must be at least 8 characters", 400);
      update.password = await bcrypt.hash(newPassword, 12);
    }

    const updated = await User.findByIdAndUpdate(userId, { $set: update }, { new: true }).select("-password");

    await AuditLog.create({
      actorId: admin._id,
      action: `user.${action}`,
      targetType: "User",
      targetId: String(target._id),
      reason: String(body.reason || "").slice(0, 1000),
      metadata: { role: target.role, email: target.email },
    });

    return ok({ message: "User updated", user: publicUser(updated) });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request) {
  try {
    const { user: admin, response } = await requireAdmin();
    if (response) return response;

    const id = new URL(request.url).searchParams.get("id");
    if (!mongoose.isValidObjectId(id)) return fail("Invalid user ID", 400);

    await connectDB();
    const target = await User.findById(id);
    if (!target) return fail("User not found", 404);
    if (target.role === "admin") return fail("Administrator accounts cannot be deleted", 403);
    if (!target.isDeleted) return fail("Move the user to the recycle bin before deleting permanently", 400);

    await User.deleteOne({ _id: target._id });
    await Notification.deleteMany({ recipientId: target._id });
    await AuditLog.create({
      actorId: admin._id,
      action: "user.purge",
      targetType: "User",
      targetId: String(target._id),
      metadata: { email: target.email, role: target.role },
    });

    return ok({ message: "User permanently deleted" });
  } catch (error) {
    return handleError(error);
  }
}
