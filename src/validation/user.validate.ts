import Joi from "joi";

export const preRegValidate = Joi.object({
  firstName: Joi.string().trim().max(20).required(),
  lastName: Joi.string().trim().max(20).required(),
  email: Joi.string().email().trim().required(),
  password: Joi.string()
    .trim()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).+$/
    )
    .messages({
      "string.pattern.base":
        "Password must include lowercase, uppercase, number and special character.",
      "string.min": "Password must be at least 8 characters",
    })
    .required(),
  role: Joi.string().valid("customer", "restaurant").required(),
});
export const regValidate = Joi.object({
  email: Joi.string().required().email().trim(),
  otp: Joi.string().required().trim(),
});
export const loginValidate = Joi.object({
  email: Joi.string().required().email().trim(),
  password: Joi.string().required().trim().min(8),
});
