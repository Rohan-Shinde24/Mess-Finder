import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getCurrentUser, requireAdmin } from "@/lib/auth";
import Advertisement from "@/models/Advertisement";

export async function GET() {
  try {
    const admin = await getCurrentUser();
    if (!admin || admin.role !== "admin") return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
    await connectDB();
    const ads = await Advertisement.find({ isDeleted: false }).sort({ slot: 1 }).lean();
    return NextResponse.json({ success: true, ads });
  } catch {
    return NextResponse.json({ success: false, message: "Could not load ads" }, { status: 500 });
  }
}

function parseDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function POST(request) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;

    const body = await request.json();
    const title = String(body.title || "").trim();
    const imageUrl = String(body.imageUrl || "").trim();
    const destinationUrl = String(body.destinationUrl || "").trim();
    const slot = Number(body.slot);

    if (!title) return NextResponse.json({ success: false, message: "Title is required" }, { status: 400 });
    if (title.length > 120) return NextResponse.json({ success: false, message: "Title must be 120 characters or fewer" }, { status: 400 });
    if (!imageUrl) return NextResponse.json({ success: false, message: "Image is required" }, { status: 400 });
    if (!(imageUrl.startsWith("/uploads/") || /^https?:\/\//i.test(imageUrl))) {
      return NextResponse.json({ success: false, message: "Image must be an uploaded /uploads/ path or an http(s) URL" }, { status: 400 });
    }
    if (!/^https?:\/\//i.test(destinationUrl)) {
      return NextResponse.json({ success: false, message: "Destination link must start with http:// or https://" }, { status: 400 });
    }
    if (!Number.isInteger(slot) || slot < 1 || slot > 4) {
      return NextResponse.json({ success: false, message: "Slot must be a number between 1 and 4" }, { status: 400 });
    }

    const doc = {
      title,
      imageUrl,
      destinationUrl,
      slot,
      destinationType: "url",
      isActive: body.isActive !== false,
    };

    if (body.startsAt) {
      const startsAt = parseDate(body.startsAt);
      if (!startsAt) return NextResponse.json({ success: false, message: "Invalid start date" }, { status: 400 });
      doc.startsAt = startsAt;
    }
    if (body.endsAt) {
      const endsAt = parseDate(body.endsAt);
      if (!endsAt) return NextResponse.json({ success: false, message: "Invalid end date" }, { status: 400 });
      doc.endsAt = endsAt;
    }

    await connectDB();
    const ad = await Advertisement.create(doc);
    return NextResponse.json({ success: true, ad }, { status: 201 });
  } catch (error) {
    console.error("Create ad failed:", error?.message || error);
    return NextResponse.json({ success: false, message: "Could not create ad" }, { status: 500 });
  }
}
