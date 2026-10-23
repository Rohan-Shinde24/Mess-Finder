import Joi from "joi";
export const messSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().trim().max(3000).allow("").default(""),
  address: Joi.string().trim().min(3).max(250).required(),
  city: Joi.string().trim().min(2).max(100).required(),
  area: Joi.string().trim().max(100).allow("").default(""),
  state: Joi.string().trim().max(100).allow("").default(""),
  pincode: Joi.string().trim().pattern(/^[0-9A-Za-z -]{3,12}$/).required(),
  phone: Joi.string().trim().max(30).allow("").default(""),
  whatsappNumber: Joi.string().trim().max(30).allow("").default(""),
  startingPrice: Joi.number().min(0).max(1000000).required(),
  foodType: Joi.string().valid("veg", "non-veg", "both").default("both"),
  images: Joi.array().items(Joi.string().trim().max(500)).max(3).default([]),
}).unknown(false);
