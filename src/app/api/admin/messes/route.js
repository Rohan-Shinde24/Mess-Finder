import mongoose from "mongoose";
import connectDB from "../../../../lib/mongodb";
import Mess from "../../../../models/Mess";
import AuditLog from "../../../../models/AuditLog";
import { requireAdmin } from "../../../../lib/auth";
import { ok, fail } from "../../../../lib/api-response";
import { handleError } from "../../../../lib/error-handler";

export async function GET() {
  try {
    const { user, response } = await requireAdmin();
    if (response) return response;
    await connectDB();
    const messes = await Mess.find({ isDeleted: false }).populate("ownerId", "name email").sort({ createdAt: -1 }).limit(200).lean();
    return ok({ messes });
  } catch (error) { return handleError(error); }
}

export async function PATCH(request) {
  try {
    const { user, response } = await requireAdmin();
    if (response) return response;
    const { id, action, reason = "" } = await request.json();
    if (!mongoose.isValidObjectId(id)) return fail("Invalid mess ID", 400);
    if (!["approve", "reject", "suspend", "restore", "soft-delete"].includes(action)) return fail("Invalid moderation action", 400);
    await connectDB();
    const mess = await Mess.findById(id);
    if (!mess || mess.isDeleted) return fail("Mess not found", 404);
    if (action === "approve") { mess.status = "published"; mess.moderationReason = ""; mess.reviewedBy = user._id; mess.reviewedAt = new Date(); }
    if (action === "reject") { mess.status = "rejected"; mess.moderationReason = String(reason).slice(0, 1000); mess.reviewedBy = user._id; mess.reviewedAt = new Date(); }
    if (action === "suspend") { mess.status = "suspended"; mess.moderationReason = String(reason).slice(0, 1000); }
    if (action === "restore") { mess.status = "pending"; mess.moderationReason = "Restored; awaiting approval."; }
    if (action === "soft-delete") { mess.isDeleted = true; mess.deletedAt = new Date(); mess.deletedBy = user._id; }
    await mess.save();
    await AuditLog.create({ actorId: user._id, action: `mess.${action}`, targetType: "Mess", targetId: String(mess._id), reason: String(reason).slice(0, 1000) });
    return ok({ message: "Moderation action completed", mess });
  } catch (error) { return handleError(error); }
}
