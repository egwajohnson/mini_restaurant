import mongoose, { Schema, Types } from "mongoose";

const otpSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: "1hr" }, // OTP expires after 1 hour
    updatedAt: { type: Date, default: Date.now },
     expiresAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const otpModel = mongoose.model("Otp", otpSchema);
