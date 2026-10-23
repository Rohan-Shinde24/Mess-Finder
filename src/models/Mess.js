import mongoose from "mongoose";

const PointSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Point"], default: "Point", required: true },
    coordinates: { type: [Number], required: true },
  },
  { _id: false }
);

const MessSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  slug: { type: String, trim: true, lowercase: true, index: true },
  description: { type: String, default: "", maxlength: 3000 },
  address: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true, index: true },
  area: { type: String, default: "", trim: true, index: true },
  state: { type: String, default: "", trim: true },
  pincode: { type: String, required: true, trim: true, index: true },
  location: { type: PointSchema, default: undefined },
  phone: { type: String, default: "" },
  whatsappNumber: { type: String, default: "" },
  startingPrice: { type: Number, required: true, min: 0 },
  foodType: { type: String, enum: ["veg", "non-veg", "both"], default: "both" },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: (images) => !images || images.length <= 3,
      message: "You can add up to 3 images",
    },
  },
  status: { type: String, enum: ["draft", "pending", "published", "rejected", "suspended", "archived"], default: "pending", index: true },
  moderationReason: { type: String, default: "" },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  reviewedAt: { type: Date, default: null },
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date, default: null },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });
MessSchema.index({ location: "2dsphere" });
MessSchema.index({ status: 1, isDeleted: 1, city: 1, startingPrice: 1 });
export default mongoose.models.Mess || mongoose.model("Mess", MessSchema);
