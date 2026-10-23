import mongoose from "mongoose";
const AuditLogSchema = new mongoose.Schema({
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
  action: { type: String, required: true, maxlength: 120 },
  targetType: { type: String, required: true, maxlength: 80 },
  targetId: { type: String, default: "" },
  reason: { type: String, default: "", maxlength: 1000 },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });
export default mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);
