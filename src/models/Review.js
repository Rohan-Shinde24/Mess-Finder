import mongoose from "mongoose";
const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  messId: { type: mongoose.Schema.Types.ObjectId, ref: "Mess", required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: "", maxlength: 1500 },
  ownerResponse: { type: String, default: "", maxlength: 1500 },
  status: { type: String, enum: ["visible", "hidden", "reported"], default: "visible" },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
ReviewSchema.index({ userId: 1, messId: 1 }, { unique: true });
export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
