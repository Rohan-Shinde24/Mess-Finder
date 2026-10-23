import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "../../../../../lib/mongodb";
import { getCurrentUser } from "../../../../../lib/auth";
import Advertisement from "../../../../../models/Advertisement";

export async function PATCH(request, { params }) {
  try {
    const admin = await getCurrentUser();
    if (!admin || admin.role !== "admin") return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "Invalid ad ID" }, { status: 400 });
    const body = await request.json();
    const update = {};
    for (const key of ["title", "imageUrl", "destinationUrl", "destinationType", "slot", "isActive", "startsAt", "endsAt"]) if (body[key] !== undefined) update[key] = body[key];
    await connectDB();
    const ad = await Advertisement.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: update }, { new: true, runValidators: true });
    if (!ad) return NextResponse.json({ success: false, message: "Ad not found" }, { status: 404 });
    return NextResponse.json({ success: true, ad });
  } catch {
    return NextResponse.json({ success: false, message: "Could not update ad" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const admin = await getCurrentUser();
    if (!admin || admin.role !== "admin") return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "Invalid ad ID" }, { status: 400 });
    await connectDB();
    const ad = await Advertisement.findOneAndUpdate({ _id: id, isDeleted: false }, { $set: { isDeleted: true, isActive: false } }, { new: true });
    if (!ad) return NextResponse.json({ success: false, message: "Ad not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Ad archived" });
  } catch {
    return NextResponse.json({ success: false, message: "Could not delete ad" }, { status: 500 });
  }
}
