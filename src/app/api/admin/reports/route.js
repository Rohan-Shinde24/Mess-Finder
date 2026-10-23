import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Mess from "@/models/Mess";
import Review from "@/models/Review";
import SupportTicket from "@/models/SupportTicket";
import { requireAdmin } from "@/lib/auth";
import { fail } from "@/lib/api-response";
import { handleError } from "@/lib/error-handler";

const MAX_ROWS = 5000;

function csvCell(value) {
  if (value === null || value === undefined) return '""';
  const cleaned = String(value).replace(/[\r\n]+/g, " ");
  return `"${cleaned.replace(/"/g, '""')}"`;
}

function toCsv(headers, rows) {
  const lines = [headers.map(csvCell).join(",")];
  for (const row of rows) lines.push(row.map(csvCell).join(","));
  return lines.join("\r\n");
}

const iso = (value) => (value ? new Date(value).toISOString() : "");

export async function GET(request) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;
    await connectDB();

    const type = new URL(request.url).searchParams.get("type");
    let headers;
    let rows;

    if (type === "users") {
      headers = ["Name", "Email", "Role", "Status", "Phone", "Registered At", "Deleted"];
      const users = await User.find({}).select("-password").sort({ createdAt: -1 }).limit(MAX_ROWS).lean();
      rows = users.map((u) => [u.name, u.email, u.role, u.status, u.phone, iso(u.createdAt), u.isDeleted ? "yes" : "no"]);
    } else if (type === "messes") {
      headers = ["Name", "Owner Email", "City", "Area", "Pincode", "Starting Price", "Food Type", "Status", "Created At"];
      const messes = await Mess.find({}).populate("ownerId", "email").sort({ createdAt: -1 }).limit(MAX_ROWS).lean();
      rows = messes.map((m) => [
        m.name,
        m.ownerId?.email || "",
        m.city,
        m.area,
        m.pincode,
        m.startingPrice,
        m.foodType,
        m.status,
        iso(m.createdAt),
      ]);
    } else if (type === "reviews") {
      headers = ["Mess", "Reviewer Email", "Rating", "Comment", "Created At"];
      const reviews = await Review.find({})
        .populate("messId", "name")
        .populate("userId", "email")
        .sort({ createdAt: -1 })
        .limit(MAX_ROWS)
        .lean();
      rows = reviews.map((r) => [
        r.messId?.name || "",
        r.userId?.email || "",
        r.rating,
        (r.comment || "").slice(0, 200),
        iso(r.createdAt),
      ]);
    } else if (type === "support") {
      headers = ["Ticket Number", "Subject", "Category", "Priority", "Status", "Created By Email", "Created At"];
      const tickets = await SupportTicket.find({}).populate("createdBy", "email").sort({ createdAt: -1 }).limit(MAX_ROWS).lean();
      rows = tickets.map((t) => [
        t.ticketNumber,
        t.subject,
        t.category,
        t.priority,
        t.status,
        t.createdBy?.email || "",
        iso(t.createdAt),
      ]);
    } else {
      return fail("Unknown report type. Use one of: users, messes, reviews, support", 400);
    }

    const csv = toCsv(headers, rows);
    const date = new Date().toISOString().slice(0, 10);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="messfinder-${type}-${date}.csv"`,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
