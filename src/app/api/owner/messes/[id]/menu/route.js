import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { requireOwner } from "@/lib/auth";
import Mess from "@/models/Mess";
import WeeklyMenu from "@/models/WeeklyMenu";

const slots = ["morning", "afternoon", "night", "breakfast", "morning-snacks", "lunch", "evening-snacks", "dinner"];

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "Invalid mess ID" }, { status: 400 });
    await connectDB();
    const menu = await WeeklyMenu.find({ messId: id, isDeleted: false }).sort({ dayOfWeek: 1, mealSlot: 1 }).lean();
    return NextResponse.json({ success: true, menu });
  } catch {
    return NextResponse.json({ success: false, message: "Could not load menu" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { user, response } = await requireOwner();
    if (response) return response;
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "Invalid mess ID" }, { status: 400 });
    const body = await request.json();
    if (!Array.isArray(body.entries) || body.entries.length > 35) return NextResponse.json({ success: false, message: "Provide menu entries (up to 35 day/meal combinations)" }, { status: 400 });
    for (const entry of body.entries) {
      if (!Number.isInteger(Number(entry.dayOfWeek)) || Number(entry.dayOfWeek) < 0 || Number(entry.dayOfWeek) > 6 || !slots.includes(entry.mealSlot)) {
        return NextResponse.json({ success: false, message: "Each entry needs a dayOfWeek from 0–6 and a valid mealSlot" }, { status: 400 });
      }
    }
    await connectDB();
    const mess = await Mess.findOne({ _id: id, ownerId: user._id, isDeleted: false });
    if (!mess && user.role !== "admin") return NextResponse.json({ success: false, message: "Mess not found or access denied" }, { status: 404 });
    const saved = [];
    for (const entry of body.entries) {
      const dishes = Array.isArray(entry.dishes) ? entry.dishes.map((x) => String(x).trim()).filter(Boolean).slice(0, 20) : [];
      const doc = await WeeklyMenu.findOneAndUpdate(
        { messId: id, dayOfWeek: Number(entry.dayOfWeek), mealSlot: entry.mealSlot },
        {
          $set: {
            dishes,
            description: String(entry.description || "").slice(0, 500),
            time: String(entry.time || "").slice(0, 40),
            foodType: ["veg", "non-veg", "both"].includes(entry.foodType) ? entry.foodType : "both",
            isAvailable: entry.isAvailable !== false,
            isDeleted: false,
          },
        },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
      );
      saved.push(doc);
    }
    return NextResponse.json({ success: true, menu: saved });
  } catch {
    return NextResponse.json({ success: false, message: "Could not save menu" }, { status: 500 });
  }
}
