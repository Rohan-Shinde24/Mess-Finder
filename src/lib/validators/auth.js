import Joi from "joi";
export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().trim().email().max(254).required(),
  password: Joi.string().min(8).max(128).required(),
  role: Joi.string().valid("user", "owner").default("user"),
});
export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(1).max(128).required(),
  role: Joi.string().valid("user", "owner", "admin"),
});
