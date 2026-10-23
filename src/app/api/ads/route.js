import connectDB from "@/lib/mongodb";
import Advertisement from "@/models/Advertisement";
import { ok } from "@/lib/api-response";
import { handleError } from "@/lib/error-handler";
export async function GET() {
  try {
    await connectDB();
    const now = new Date();
    const ads = await Advertisement.find({
      isActive: true, isDeleted: false,
      $and: [
        { $or: [{ startsAt: null }, { startsAt: { $lte: now } }] },
        { $or: [{ endsAt: null }, { endsAt: { $gte: now } }] },
      ],
    }).sort({ slot: 1 }).limit(4).lean();
    return ok({ ads });
  } catch (error) { return handleError(error); }
}
