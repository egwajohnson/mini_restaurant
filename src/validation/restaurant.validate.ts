import Joi from "joi";

export const kycValid = Joi.object({
  bvn: Joi.string().required().length(11),
});
export const restaurantValid = Joi.object({
  restaurantName: Joi.string().required().min(10),
  address: Joi.object({
    label: Joi.string().trim().optional(),
    street: Joi.string().trim().optional(),
    city: Joi.string().trim().optional(),
    state: Joi.string().trim().optional(),
    country: Joi.string().trim().optional(),
    postalCode: Joi.string().trim().optional(),
    phoneNumber: Joi.string().trim().optional(),
    isDefault: Joi.boolean().optional(),
  }).optional(),
});
