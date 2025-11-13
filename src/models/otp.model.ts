import mongoose, { Schema, Types } from "mongoose";

const otpSchema = new Schema(
  {
    userId: { type: Types.ObjectId, require: true, ref: "User" },
    email: { type: String, require: true },
    otp: { type: String, require: true },
    createdAt: { type: Date, default: Date.now, expires: "1hr" },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const otpModel = mongoose.model("Otp", otpSchema);
