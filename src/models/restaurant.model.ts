import mongoose, { Schema, Types } from "mongoose";

const restaurantSchema = new Schema(
  {
    userId: { type: Types.ObjectId, require: true, unique: true, ref: "User" },
    restaurantName: { type: String, require: true },
    slug: {
      userId: { type: Types.ObjectId, require: true, ref: "User" },
      restaurantName: { type: String, require: true },
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
      phoneNumber: { type: String, require: true },
      isDefault: { type: Boolean, require: true },
    },
    bvn: { type: String },
    payout: { type: Object, method: ["BANK", "WALLET"] },
    status: { type: String, enum: ["open", "closed"], default: "closed" },
    adminStatus: {
      type: String,
      enum: ["restricted", "flagged", "verified"],
      default: "restricted",
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    retainKeyOrder: true,
    strict: true,
    timestamps: true,
  }
);

export const restaurantModel = mongoose.model("Restaurant", restaurantSchema);
