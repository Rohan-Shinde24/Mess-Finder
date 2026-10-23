import mongoose from "mongoose";
const MealPlanSchema = new mongoose.Schema({
  messId: { type: mongoose.Schema.Types.ObjectId, ref: "Mess", required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, default: "", maxlength: 1000 },
  price: { type: Number, required: true, min: 0 },
  durationDays: { type: Number, required: true, min: 1, max: 366 },
  includedMeals: [{ type: String, enum: ["breakfast", "morning-snacks", "lunch", "evening-snacks", "dinner"] }],
  sampleDishes: [{ type: String, maxlength: 100 }],
  terms: { type: String, default: "", maxlength: 1000 },
  isAvailable: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.models.MealPlan || mongoose.model("MealPlan", MealPlanSchema);
