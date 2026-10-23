import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Mess from "@/models/Mess";
import MealPlan from "@/models/MealPlan";
import WeeklyMenu from "@/models/WeeklyMenu";
import Review from "@/models/Review";
import { getCurrentUser } from "@/lib/auth";
import { messSchema } from "@/lib/validators/mess";
import { ok, fail } from "@/lib/api-response";
import { handleError } from "@/lib/error-handler";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return fail("Invalid mess ID", 400);
    await connectDB();
    const user = await getCurrentUser();
    const mess = await Mess.findOne({ _id: id, isDeleted: false }).lean();
    if (!mess) return fail("Mess not found", 404);
    const canViewPrivate = user && (String(mess.ownerId) === String(user._id) || user.role === "admin");
    if (mess.status !== "published" && !canViewPrivate) return fail("Mess not found", 404);
    const [plans, menu, reviews] = await Promise.all([
      MealPlan.find({ messId: id, isDeleted: false, isAvailable: true }).lean(),
      WeeklyMenu.find({ messId: id, isDeleted: false, isAvailable: true }).sort({ dayOfWeek: 1 }).lean(),
      Review.find({ messId: id, isDeleted: false, status: "visible" }).populate("userId", "name").sort({ createdAt: -1 }).limit(50).lean(),
    ]);
    return ok({ mess, plans, menu, reviews });
  } catch (error) { return handleError(error); }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return fail("Invalid mess ID", 400);
    const user = await getCurrentUser();
    if (!user) return fail("Authentication required", 401);
    await connectDB();
    const mess = await Mess.findOne({ _id: id, isDeleted: false });
    if (!mess) return fail("Mess not found", 404);
    if (String(mess.ownerId) !== String(user._id) && user.role !== "admin") return fail("You cannot edit this listing", 403);
    const body = await request.json();
    const { error, value } = messSchema.validate(body, { abortEarly: true, stripUnknown: true });
    if (error) return fail(error.details[0].message, 400);
    const sensitiveChanged = ["name", "address", "city", "area", "pincode", "phone", "whatsappNumber"].some(k => String(mess[k] ?? "") !== String(value[k] ?? ""));
    Object.assign(mess, value);
    if (user.role !== "admin" && sensitiveChanged) {
      mess.status = "pending";
      mess.moderationReason = "Listing changes require admin review.";
      mess.reviewedAt = null;
      mess.reviewedBy = null;
    }
    await mess.save();
    return ok({ message: mess.status === "pending" ? "Listing updated and sent for review" : "Listing updated", mess });
  } catch (error) { return handleError(error); }
}
