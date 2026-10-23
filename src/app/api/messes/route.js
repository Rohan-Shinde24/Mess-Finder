import connectDB from "@/lib/mongodb";
import Mess from "@/models/Mess";
import { requireOwner } from "@/lib/auth";
import { messSchema } from "@/lib/validators/mess";
import { weeklyMenuSchema } from "@/lib/validators/weekly-menu";
import { saveWeeklyMenu } from "@/lib/weekly-menu";
import { ok, fail } from "@/lib/api-response";
import { handleError } from "@/lib/error-handler";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim().slice(0, 100);
    const city = (searchParams.get("city") || "").trim().slice(0, 100);
    const area = (searchParams.get("area") || "").trim().slice(0, 100);
    const pincode = (searchParams.get("pincode") || "").trim().slice(0, 12);
    const maxPrice = Number(searchParams.get("maxPrice"));
    const page = Math.max(1, Math.min(10000, Number(searchParams.get("page")) || 1));
    const limit = Math.max(1, Math.min(24, Number(searchParams.get("limit")) || 12));
    const filter = { status: "published", isDeleted: false };
    if (q) filter.$or = [{ name: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }, { description: { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } }];
    if (city) filter.city = { $regex: city.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    if (area) filter.area = { $regex: area.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    if (pincode) filter.pincode = pincode;
    if (searchParams.has("maxPrice") && Number.isFinite(maxPrice) && maxPrice >= 0) filter.startingPrice = { $lte: maxPrice };
    const [messes, total] = await Promise.all([
      Mess.find(filter).select("-location").sort({ averageRating: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Mess.countDocuments(filter),
    ]);
    return ok({ messes, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { return handleError(error); }
}

export async function POST(request) {
  try {
    const { user, response } = await requireOwner();
    if (response) return response;
    const body = await request.json();
    const { weeklyMenu, ...rest } = body;
    const { error, value } = messSchema.validate(rest, { abortEarly: true, stripUnknown: true });
    if (error) return fail(error.details[0].message, 400);
    const { error: menuError, value: menuEntries } = weeklyMenuSchema.validate(weeklyMenu ?? [], { abortEarly: true });
    if (menuError) return fail(menuError.details[0].message, 400);
    await connectDB();
    const slug = value.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);
    const mess = await Mess.create({ ...value, ownerId: user._id, slug, status: "pending" });
    await saveWeeklyMenu(mess._id, menuEntries);
    return ok({ message: "Mess submitted for admin approval", mess }, 201);
  } catch (error) { return handleError(error); }
}
