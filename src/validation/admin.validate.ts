import Joi from "joi";

export const adminValidate = Joi.object({
  firstName: Joi.string().trim().max(20).required(),
  lastName: Joi.string().trim().max(20).required(),
  username: Joi.string().trim().max(20).required(),
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
export const adminLoginvalidate = Joi.object({
  email: Joi.string().optional().email().trim(),
  userName: Joi.string().optional(),
});
export const upgradeAdmin = Joi.object({
  email: Joi.string().email().trim().required(),
  role: Joi.string().valid("admin", "superAdmin").required(),
});

export const emailValidate = Joi.object({
  email: Joi.string().email().trim().required(),
});
export const profileValidate = Joi.object({
  firstName: Joi.string().trim().max(20).optional(),
  lastName: Joi.string().trim().max(20).optional(),
  username: Joi.string().min(3).optional(),
});
export const pwdValidate = Joi.object({
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
  confirmPassword: Joi.string()
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
export const resetPwdValid = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.number().required(),
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
  confirm: Joi.string()
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

export const adminValid = Joi.object({
  email: Joi.string().email().required(),
});
