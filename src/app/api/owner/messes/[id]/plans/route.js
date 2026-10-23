import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { requireOwner } from "@/lib/auth";
import Mess from "@/models/Mess";
import MealPlan from "@/models/MealPlan";

const allowedMeals = ["breakfast", "morning-snacks", "lunch", "evening-snacks", "dinner"];

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "Invalid mess ID" }, { status: 400 });
    await connectDB();
    const plans = await MealPlan.find({ messId: id, isDeleted: false, isAvailable: true }).sort({ price: 1 }).lean();
    return NextResponse.json({ success: true, plans });
  } catch {
    return NextResponse.json({ success: false, message: "Could not load plans" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { user, response } = await requireOwner();
    if (response) return response;
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "Invalid mess ID" }, { status: 400 });
    const body = await request.json();
    const name = String(body.name || "").trim();
    const price = Number(body.price);
    const durationDays = Number(body.durationDays);
    if (name.length < 2 || !Number.isFinite(price) || price <= 0 || !Number.isInteger(durationDays) || durationDays < 1 || durationDays > 366) {
      return NextResponse.json({ success: false, message: "Enter a valid plan name, price and duration" }, { status: 400 });
    }
    const includedMeals = Array.isArray(body.includedMeals) ? body.includedMeals.filter((m) => allowedMeals.includes(m)) : ["lunch", "dinner"];
    await connectDB();
    const mess = await Mess.findOne({ _id: id, ownerId: user._id, isDeleted: false });
    if (!mess && user.role !== "admin") return NextResponse.json({ success: false, message: "Mess not found or access denied" }, { status: 404 });
    const plan = await MealPlan.create({ messId: id, name, description: String(body.description || "").trim(), price, durationDays, includedMeals, sampleDishes: Array.isArray(body.sampleDishes) ? body.sampleDishes.slice(0, 30) : [], terms: String(body.terms || "").trim() });
    return NextResponse.json({ success: true, plan }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: "Could not create meal plan" }, { status: 500 });
  }
}
