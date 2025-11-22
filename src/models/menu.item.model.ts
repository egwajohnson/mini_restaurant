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



export const productSchema = new Schema(
  {
    name: { type: String, required: true },
    merchantId: { type: Types.ObjectId, ref: "Merchant" },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: false },
    price: { type: Number, required: true },
    discountPrice: { type: Number, required: false },
    quantity: { type: Number, required: true },
    sku: { type: String },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const productModel = mongoose.model("Product", productSchema);
