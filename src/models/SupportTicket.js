import mongoose from "mongoose";
const SupportTicketSchema = new mongoose.Schema({
  ticketNumber: { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  subject: { type: String, required: true, maxlength: 160 },
  category: { type: String, enum: ["account", "listing", "review", "technical", "advertisement", "other"], default: "other" },
  priority: { type: String, enum: ["low", "normal", "high", "urgent"], default: "normal" },
  status: { type: String, enum: ["open", "in-progress", "waiting-customer", "resolved", "closed"], default: "open", index: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.models.SupportTicket || mongoose.model("SupportTicket", SupportTicketSchema);
