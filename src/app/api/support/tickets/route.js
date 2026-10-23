import connectDB from "@/lib/mongodb";
import SupportTicket from "@/models/SupportTicket";
import SupportMessage from "@/models/SupportMessage";
import { getCurrentUser, requireAdmin } from "@/lib/auth";
import { ok, fail } from "@/lib/api-response";
import { handleError } from "@/lib/error-handler";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return fail("Authentication required", 401);
    await connectDB();
    const filter = user.role === "admin" ? { isDeleted: false } : { createdBy: user._id, isDeleted: false };
    const tickets = await SupportTicket.find(filter).sort({ updatedAt: -1 }).limit(100).lean();
    return ok({ tickets });
  } catch (error) { return handleError(error); }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();
    if (!user) return fail("Log in to contact support", 401);
    const { subject, category = "other", message } = await request.json();
    if (typeof subject !== "string" || subject.trim().length < 3 || subject.length > 160) return fail("Subject must be 3–160 characters", 400);
    if (typeof message !== "string" || message.trim().length < 3 || message.length > 5000) return fail("Message must be 3–5000 characters", 400);
    await connectDB();
    const ticket = await SupportTicket.create({
      ticketNumber: "MF-" + Date.now().toString(36).toUpperCase(),
      createdBy: user._id, subject: subject.trim(),
      category: ["account","listing","review","technical","advertisement","other"].includes(category) ? category : "other",
    });
    await SupportMessage.create({ ticketId: ticket._id, senderId: user._id, message: message.trim() });
    return ok({ message: "Support ticket created", ticket }, 201);
  } catch (error) { return handleError(error); }
}
