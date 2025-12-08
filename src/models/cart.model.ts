import mongoose, { Schema } from "mongoose";
import { menuItemModel } from "../models/menu.item.model";

const cartItemSchema = new Schema({
  menuId: { type: Schema.Types.ObjectId, ref: "Menu_Item", required: true },
  restaurantId: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "Restaurant",
  },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  slug: { type: String },
  name: { type: String }, // optional
});
export const cartItemModel = mongoose.model("CartItem", cartItemSchema);

const cartSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [cartItemSchema],
    couponCode: { type: String },
    totalPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

export const cartModel = mongoose.model("Cart", cartSchema);
