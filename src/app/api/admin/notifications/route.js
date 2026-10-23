import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Notification from "@/models/Notification";
import AuditLog from "@/models/AuditLog";
import { requireAdmin } from "@/lib/auth";
import { ok, fail } from "@/lib/api-response";
import { handleError } from "@/lib/error-handler";

export async function GET() {
  try {
    const { response } = await requireAdmin();
    if (response) return response;
    await connectDB();

    const [activities, notifications, activityCount, notificationCount, unread] = await Promise.all([
      AuditLog.find().populate("actorId", "name email").sort({ createdAt: -1 }).limit(50).lean(),
      Notification.find().populate("recipientId", "name email").sort({ createdAt: -1 }).limit(50).lean(),
      AuditLog.countDocuments(),
      Notification.countDocuments(),
      Notification.countDocuments({ readAt: null }),
    ]);

    return ok({
      activities,
      notifications,
      totals: { activities: activityCount, notifications: notificationCount, unread },
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request) {
  try {
    const { user: admin, response } = await requireAdmin();
    if (response) return response;

    const body = await request.json();
    const message = String(body.message || "").trim();
    if (!message) return fail("Message is required", 400);
    if (message.length > 500) return fail("Message must be 500 characters or fewer", 400);
    const href = typeof body.href === "string" ? body.href.trim().slice(0, 500) : "";

    await connectDB();
    const recipients = await User.find({ isDeleted: { $ne: true }, status: "active" }).select("_id").lean();
    if (!recipients.length) return ok({ sent: 0 });

    const docs = recipients.map((recipient) => ({
      recipientId: recipient._id,
      type: "admin-broadcast",
      message,
      href,
    }));
    await Notification.insertMany(docs);

    await AuditLog.create({
      actorId: admin._id,
      action: "notification.broadcast",
      targetType: "Notification",
      metadata: { sent: docs.length, message },
    });

    return ok({ sent: docs.length });
  } catch (error) {
    return handleError(error);
  }
}
