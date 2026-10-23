import connectDB from "@/lib/mongodb";
import Mess from "@/models/Mess";
import { requireOwner } from "@/lib/auth";
import { ok } from "@/lib/api-response";
import { handleError } from "@/lib/error-handler";
export async function GET() {
  try {
    const { user, response } = await requireOwner();
    if (response) return response;
    await connectDB();
    const messes = await Mess.find({ ownerId: user._id, isDeleted: false }).sort({ createdAt: -1 }).lean();
    return ok({ messes });
  } catch (error) { return handleError(error); }
}
