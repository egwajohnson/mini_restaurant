import mongoose, { Schema, Types } from "mongoose";

const menuItemSchema = new Schema(
  {
    restaurantId: { type: Types.ObjectId, require: true, ref: "Restaurant" },
    name: { type: String, require: true },
    slug: { type: String, require: false },
    description: { type: String, require: true },
    price: { type: Number, require: true },
    discountedPrice: { type: Number, require: false },
    category: { type: String, require: true },
    isOpen: { type: Boolean, default: true },
    images: [{}],
  },
  { timestamps: true }
);

export const menuItemModel = mongoose.model("Menu_Item", menuItemSchema);
