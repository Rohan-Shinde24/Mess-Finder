import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import Review from "@/models/Review";
import Mess from "@/models/Mess";

export async function GET(_request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "Invalid mess ID" }, { status: 400 });
    const reviews = await Review.find({ messId: id, status: "visible", isDeleted: false }).populate("userId", "name").sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, reviews });
  } catch {
    return NextResponse.json({ success: false, message: "Could not load reviews" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ success: false, message: "Please log in to review a mess" }, { status: 401 });
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ success: false, message: "Invalid mess ID" }, { status: 400 });
    const body = await request.json();
    const rating = Number(body.rating);
    const comment = String(body.comment || "").trim();
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return NextResponse.json({ success: false, message: "Rating must be between 1 and 5" }, { status: 400 });
    if (comment.length < 5 || comment.length > 1500) return NextResponse.json({ success: false, message: "Review must be 5–1500 characters" }, { status: 400 });
    await connectDB();
    const mess = await Mess.findOne({ _id: id, status: "published", isDeleted: false });
    if (!mess) return NextResponse.json({ success: false, message: "Mess not found" }, { status: 404 });
    const review = await Review.create({ messId: id, userId: user._id, rating, comment });
    const stats = await Review.aggregate([{ $match: { messId: new mongoose.Types.ObjectId(id), status: "visible", isDeleted: false } }, { $group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } } }]);
    await Mess.updateOne({ _id: id }, { $set: { averageRating: stats[0]?.average || 0, reviewCount: stats[0]?.count || 0 } });
    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error) {
    if (error?.code === 11000) return NextResponse.json({ success: false, message: "You have already reviewed this mess" }, { status: 409 });
    return NextResponse.json({ success: false, message: "Could not submit review" }, { status: 500 });
  }
}
