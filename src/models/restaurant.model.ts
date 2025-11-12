import mongoose, { Schema, Types } from "mongoose";

const restaurantSchema = new Schema({
  userId: { type: Types.ObjectId, require: true, unique: true, ref: "User" },
  displayName: { type: String, require: true },
  slug: {
    userId: { type: Types.ObjectId, require: true, ref: "User" },
    displayName: { type: String, require: true },
  },
  bio: { type: String },
  logoUrl: { type: String },
  email: { type: String },
  address: {
    label: { type: String, require: true },
    street: { type: String, require: true },
    city: { type: String, require: true },
    state: { type: String, require: true },
    country: { type: String, require: true },
    postalCode: { type: String, require: true },
    phoneNumber: {
      type: String,
      require: true,
      partialFilterExpression: {
        phone_number: { $exist: true, $ne: null },
      },
    },
    isDefault: { type: Boolean, require: true },
  },
  payout: { type: Object, method: ["BANK", "WALLET"] },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const restaurantModel = mongoose.model("Restaurant", restaurantSchema);
