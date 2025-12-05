import Joi from "joi";

export const menuItem = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().min(10).max(500).allow(null, ""),
  price: Joi.number().min(1).required(),
  discountedPrice: Joi.number().min(1).optional(),
  category: Joi.string().min(2).required(),
  isOpen: Joi.boolean().optional(),
});
export const slugValidate = Joi.object({
  slug: Joi.string().required(),
});
export const editValidate = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  description: Joi.string().trim().min(10).max(500).allow(null, ""),
  price: Joi.number().min(1).required(),
  discountedPrice: Joi.number().min(1).optional(),
  category: Joi.string().min(2).optional(),
});

export const cartItem = Joi.object({
  menuitemId: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
});
