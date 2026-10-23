import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["user", "owner", "admin"], default: "user" },
  phone: { type: String, default: "" },
  status: { type: String, enum: ["active", "suspended", "banned"], default: "active" },
  banUntil: { type: Date, default: null },
  banReason: { type: String, default: "" },
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date, default: null },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });
export default mongoose.models.User || mongoose.model("User", UserSchema);
