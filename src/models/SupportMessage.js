import mongoose from "mongoose";
const SupportMessageSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "SupportTicket", required: true, index: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true, maxlength: 5000 },
  isInternalNote: { type: Boolean, default: false },
  readAt: { type: Date, default: null },
}, { timestamps: true });
export default mongoose.models.SupportMessage || mongoose.model("SupportMessage", SupportMessageSchema);
