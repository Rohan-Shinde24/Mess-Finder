import mongoose from "mongoose";

export const MEAL_SLOTS = ["morning", "afternoon", "night"];
export const FOOD_TYPES = ["veg", "non-veg", "both"];

const WeeklyMenuSchema = new mongoose.Schema({
  messId: { type: mongoose.Schema.Types.ObjectId, ref: "Mess", required: true, index: true },
  dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
  mealSlot: {
    type: String,
    enum: ["morning", "afternoon", "night", "breakfast", "morning-snacks", "lunch", "evening-snacks", "dinner"],
    required: true,
  },
  dishes: [{ type: String, trim: true, maxlength: 100 }],
  description: { type: String, default: "", maxlength: 500 },
  time: { type: String, default: "", maxlength: 40 },
  foodType: { type: String, enum: ["veg", "non-veg", "both"], default: "both" },
  isAvailable: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
WeeklyMenuSchema.index({ messId: 1, dayOfWeek: 1, mealSlot: 1 }, { unique: true });
export default mongoose.models.WeeklyMenu || mongoose.model("WeeklyMenu", WeeklyMenuSchema);
