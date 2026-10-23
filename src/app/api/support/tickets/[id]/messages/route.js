import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import SupportTicket from "@/models/SupportTicket";
import SupportMessage from "@/models/SupportMessage";

export async function GET(_request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, message: "Login required" }, { status: 401 });
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "Invalid ticket ID" }, { status: 400 });
    await connectDB();
    const ticket = await SupportTicket.findById(id);
    if (!ticket || ticket.isDeleted) return NextResponse.json({ success: false, message: "Ticket not found" }, { status: 404 });
    if (user.role !== "admin" && String(ticket.createdBy) !== String(user._id)) return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    const messages = await SupportMessage.find({ ticketId: id, isInternalNote: false }).populate("senderId", "name role").sort({ createdAt: 1 }).lean();
    return NextResponse.json({ success: true, messages });
  } catch {
    return NextResponse.json({ success: false, message: "Could not load messages" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, message: "Login required" }, { status: 401 });
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "Invalid ticket ID" }, { status: 400 });
    const body = await request.json();
    const message = String(body.message || "").trim();
    if (message.length < 1 || message.length > 5000) return NextResponse.json({ success: false, message: "Message must be 1–5000 characters" }, { status: 400 });
    await connectDB();
    const ticket = await SupportTicket.findById(id);
    if (!ticket || ticket.isDeleted) return NextResponse.json({ success: false, message: "Ticket not found" }, { status: 404 });
    if (user.role !== "admin" && String(ticket.createdBy) !== String(user._id)) return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    const created = await SupportMessage.create({ ticketId: id, senderId: user._id, message });
    if (user.role === "admin") ticket.status = "in-progress";
    await ticket.save();
    return NextResponse.json({ success: true, message: created }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Could not send message" }, { status: 500 });
  }
}
