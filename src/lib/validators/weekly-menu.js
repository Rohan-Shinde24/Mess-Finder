import Joi from "joi";

export const MEAL_SLOTS = ["morning", "afternoon", "night"];
export const FOOD_TYPES = ["veg", "non-veg", "both"];

export const weeklyMenuEntrySchema = Joi.object({
  dayOfWeek: Joi.number().integer().min(0).max(6).required(),
  mealSlot: Joi.string().valid(...MEAL_SLOTS).required(),
  dishes: Joi.array().items(Joi.string().trim().max(100)).max(20).default([]),
  time: Joi.string().trim().max(40).allow("").default(""),
  foodType: Joi.string().valid(...FOOD_TYPES).default("both"),
  isAvailable: Joi.boolean().default(true),
});

export const weeklyMenuSchema = Joi.array().items(weeklyMenuEntrySchema).max(21).default([]);
