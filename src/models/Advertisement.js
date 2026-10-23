import mongoose from "mongoose";
const AdvertisementSchema = new mongoose.Schema({
  slot: { type: Number, required: true, min: 1, max: 4, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  imageUrl: { type: String, required: true },
  destinationUrl: { type: String, required: true },
  destinationType: { type: String, enum: ["url", "section"], default: "url" },
  startsAt: { type: Date, default: null },
  endsAt: { type: Date, default: null },
  isActive: { type: Boolean, default: false, index: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.models.Advertisement || mongoose.model("Advertisement", AdvertisementSchema);
