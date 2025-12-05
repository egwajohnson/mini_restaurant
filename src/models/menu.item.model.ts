import { required, string } from "joi";
import mongoose, { Schema, Types } from "mongoose";

const menuItemSchema = new Schema(
  {
    restaurantId: { type: Types.ObjectId, require: true, ref: "Restaurant" },
    name: { type: String, require: true },
    slug: { type: String, require: false },
    description: { type: String, require: true },
    price: { type: Number, require: true },
    discountedPrice: { type: Number, required: false },
    quantity: { type: Number, required: false },
    category: { type: String, require: true },
    status: {
      type: String,
      enum: ["Available", "Unavailable"],
      default: "Available",
    },
    images: [{}],
  },
  { timestamps: true }
);

export const menuItemModel = mongoose.model("Menu_Item", menuItemSchema);
