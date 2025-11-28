import Joi from "joi";

export const couponValidate = Joi.object({
  code: Joi.string().trim().min(3).max(50).required(),
  type: Joi.string().valid("percentage", "fixed").required(),
  value: Joi.number().min(1).required(),
  minOrderValue: Joi.number().min(1).required(),
  validFrom: Joi.date().optional(),
  validTo: Joi.date().optional(),
  usageLimit: Joi.number().min(1).optional(),
  appliedToMerchants: Joi.array()
    .items(Joi.string().hex().length(24))
    .optional(),
});
