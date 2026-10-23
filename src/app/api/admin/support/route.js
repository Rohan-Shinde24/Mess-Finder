import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import SupportTicket from "@/models/SupportTicket";
import SupportMessage from "@/models/SupportMessage";
import AuditLog from "@/models/AuditLog";
import { requireAdmin } from "@/lib/auth";
import { ok, fail } from "@/lib/api-response";
import { handleError } from "@/lib/error-handler";

const STATUSES = ["open", "in-progress", "waiting-customer", "resolved", "closed"];

export async function GET(request) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;
    await connectDB();

    const status = new URL(request.url).searchParams.get("status");
    const filter = { isDeleted: { $ne: true } };
    if (status && STATUSES.includes(status)) filter.status = status;

    const tickets = await SupportTicket.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const ids = tickets.map((ticket) => ticket._id);
    let grouped = [];
    if (ids.length) {
      grouped = await SupportMessage.aggregate([
        { $match: { ticketId: { $in: ids } } },
        { $sort: { createdAt: -1 } },
        { $group: { _id: "$ticketId", count: { $sum: 1 }, latest: { $first: "$$ROOT" } } },
      ]);
    }
    const byTicket = new Map(grouped.map((row) => [String(row._id), row]));

    const enriched = tickets.map((ticket) => {
      const info = byTicket.get(String(ticket._id));
      return { ...ticket, messageCount: info?.count || 0, latestMessage: info?.latest || null };
    });

    return ok({ tickets: enriched });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request) {
  try {
    const { user: admin, response } = await requireAdmin();
    if (response) return response;

    const body = await request.json();
    const { ticketId } = body;
    if (!mongoose.isValidObjectId(ticketId)) return fail("Invalid ticket ID", 400);

    await connectDB();
    const ticket = await SupportTicket.findById(ticketId);
    if (!ticket || ticket.isDeleted) return fail("Ticket not found", 404);

    if (body.status !== undefined) {
      if (!STATUSES.includes(body.status)) return fail("Invalid ticket status", 400);
      ticket.status = body.status;
    }

    if (body.assignedTo !== undefined) {
      if (body.assignedTo && !mongoose.isValidObjectId(body.assignedTo)) return fail("Invalid assignee", 400);
      ticket.assignedTo = body.assignedTo || null;
    }

    let replied = false;
    if (body.reply !== undefined && String(body.reply).trim()) {
      const message = String(body.reply).trim();
      if (message.length > 5000) return fail("Reply must be 5000 characters or fewer", 400);
      await SupportMessage.create({ ticketId: ticket._id, senderId: admin._id, message });
      replied = true;
      if (body.status === undefined) ticket.status = "waiting-customer";
    }

    await ticket.save();

    await AuditLog.create({
      actorId: admin._id,
      action: "support.update",
      targetType: "SupportTicket",
      targetId: String(ticket._id),
      metadata: { status: ticket.status, replied },
    });

    const updated = await SupportTicket.findById(ticket._id).populate("createdBy", "name email").lean();
    return ok({ message: "Ticket updated", ticket: updated });
  } catch (error) {
    return handleError(error);
  }
}
