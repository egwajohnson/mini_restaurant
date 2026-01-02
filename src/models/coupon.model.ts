import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema({
  couponCode: { type: String, required: true, unique: true },

  discountType: { type: String, required: true, enum: ["percentage", "fixed"] },
  discountValue: { type: Number, required: true, min: 1 },

  minOrderValue: { type: Number, required: true, min: 1 },

  validFrom: { type: Date, required: false },
  validTo: { type: Date, required: false },

  usageLimit: { type: Number, required: false, default: 1 },
  usageCount: { type: Number, required: false, default: 0 },

  active: { type: Boolean, default: true },

  appliedToCustomers: [{ type: Schema.Types.ObjectId, ref: "User" }],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const couponModel = mongoose.model("Coupon", couponSchema);
export default couponModel;

