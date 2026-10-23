import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { requireOwner } from "@/lib/auth";
import MealPlan from "@/models/MealPlan";
import Mess from "@/models/Mess";

export async function PATCH(request, { params }) {
  try {
    const { user, response } = await requireOwner();
    if (response) return response;
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "Invalid plan ID" }, { status: 400 });
    const body = await request.json();
    const update = {};
    for (const key of ["name", "description", "price", "durationDays", "includedMeals", "sampleDishes", "terms", "isAvailable"]) if (body[key] !== undefined) update[key] = body[key];
    await connectDB();
    const plan = await MealPlan.findById(id);
    if (!plan || plan.isDeleted) return NextResponse.json({ success: false, message: "Plan not found" }, { status: 404 });
    const mess = await Mess.findById(plan.messId);
    if (user.role !== "admin" && String(mess?.ownerId) !== String(user._id)) return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    Object.assign(plan, update);
    await plan.save();
    return NextResponse.json({ success: true, plan });
  } catch {
    return NextResponse.json({ success: false, message: "Could not update plan" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { user, response } = await requireOwner();
    if (response) return response;
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "Invalid plan ID" }, { status: 400 });
    await connectDB();
    const plan = await MealPlan.findById(id);
    if (!plan || plan.isDeleted) return NextResponse.json({ success: false, message: "Plan not found" }, { status: 404 });
    const mess = await Mess.findById(plan.messId);
    if (user.role !== "admin" && String(mess?.ownerId) !== String(user._id)) return NextResponse.json({ success: false, message: "Access denied" }, { status: 403 });
    plan.isDeleted = true;
    plan.isAvailable = false;
    await plan.save();
    return NextResponse.json({ success: true, message: "Plan removed" });
  } catch {
    return NextResponse.json({ success: false, message: "Could not remove plan" }, { status: 500 });
  }
}
