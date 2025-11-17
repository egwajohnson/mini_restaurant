import Joi from "joi";

export const adminValidate = Joi.object({
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
});

export const upgradeAdmin = Joi.object({
  email: Joi.string().email().trim().required(),
  role: Joi.string().valid("admin", "superAdmin").required(),
});

export const emailValidate = Joi.object({
  email: Joi.string().email().trim().required(),
});
