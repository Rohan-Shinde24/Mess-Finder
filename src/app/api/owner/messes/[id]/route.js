import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { requireOwner } from "@/lib/auth";
import Mess from "@/models/Mess";
import WeeklyMenu from "@/models/WeeklyMenu";
import { weeklyMenuSchema } from "@/lib/validators/weekly-menu";
import { saveWeeklyMenu } from "@/lib/weekly-menu";

export async function GET(_request, { params }) {
  try {
    const { user, response } = await requireOwner();
    if (response) return response;
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Invalid mess ID" }, { status: 400 });
    }
    await connectDB();
    const query = { _id: id, isDeleted: false };
    if (user.role !== "admin") query.ownerId = user._id;
    const mess = await Mess.findOne(query).lean();
    if (!mess) return NextResponse.json({ success: false, message: "Mess not found or access denied" }, { status: 404 });
    const menu = await WeeklyMenu.find({ messId: id, isDeleted: false }).sort({ dayOfWeek: 1, mealSlot: 1 }).lean();
    return NextResponse.json({ success: true, mess, menu });
  } catch {
    return NextResponse.json({ success: false, message: "Could not load listing" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { user, response } = await requireOwner();
    if (response) return response;
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Invalid mess ID" }, { status: 400 });
    }
    const body = await request.json();
    const { weeklyMenu, ...rest } = body;
    const allowed = ["name", "description", "address", "city", "area", "state", "pincode", "phone", "whatsappNumber", "startingPrice", "foodType", "images", "location"];
    const update = {};
    for (const key of allowed) if (rest[key] !== undefined) update[key] = rest[key];
    if (update.name !== undefined && String(update.name).trim().length < 3) {
      return NextResponse.json({ success: false, message: "Mess name must be at least 3 characters" }, { status: 400 });
    }
    if (Array.isArray(update.images) && update.images.length > 3) {
      return NextResponse.json({ success: false, message: "You can add up to 3 images" }, { status: 400 });
    }
    const { error: menuError, value: menuEntries } = weeklyMenuSchema.validate(weeklyMenu ?? [], { abortEarly: true });
    if (menuError) return NextResponse.json({ success: false, message: menuError.details[0].message }, { status: 400 });

    await connectDB();
    const query = { _id: id, isDeleted: false };
    if (user.role !== "admin") query.ownerId = user._id;
    const mess = await Mess.findOneAndUpdate(query, { $set: { ...update, status: "pending" } }, { new: true, runValidators: true });
    if (!mess) return NextResponse.json({ success: false, message: "Mess not found or access denied" }, { status: 404 });
    await saveWeeklyMenu(mess._id, menuEntries);
    return NextResponse.json({ success: true, message: "Changes saved. Listing sent for re-approval.", mess });
  } catch (error) {
    if (error?.name === "ValidationError") {
      return NextResponse.json({ success: false, message: "Check the listing details and try again" }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Could not update listing" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { user, response } = await requireOwner();
    if (response) return response;
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ success: false, message: "Invalid mess ID" }, { status: 400 });
    }
    await connectDB();
    const query = { _id: id, isDeleted: false };
    if (user.role !== "admin") query.ownerId = user._id;
    const mess = await Mess.findOneAndUpdate(
      query,
      { $set: { isDeleted: true, status: "archived", deletedAt: new Date(), deletedBy: user._id } },
      { new: true }
    );
    if (!mess) return NextResponse.json({ success: false, message: "Mess not found or access denied" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Listing removed" });
  } catch {
    return NextResponse.json({ success: false, message: "Could not remove listing" }, { status: 500 });
  }
}
