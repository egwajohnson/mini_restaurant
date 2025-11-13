import mongoose, { Schema, Types } from "mongoose";

<<<<<<< HEAD
const otpSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: "1hr" }, // OTP expires after 1 hour
    updatedAt: { type: Date, default: Date.now },
    //   expiresAt: { type: Date, default: Date.now },
=======
const otpSchema = new Schema(
  {
    userId: { type: Types.ObjectId, require: true, ref: "User" },
    email: { type: String, require: true },
    otp: { type: String, require: true },
    createdAt: { type: Date, default: Date.now, expires: "1hr" },
    updatedAt: { type: Date, default: Date.now },
>>>>>>> 7dd47fd7a790e6a1224c66c3067cc8e72f8e117d
  },
  { timestamps: true }
);

export const otpModel = mongoose.model("Otp", otpSchema);
