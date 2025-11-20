import mongoose, { Schema, Types } from "mongoose";

const otpSchema = new Schema(
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

//*****************|| ADMIN OTP MODEL||**************/
const adminOtpSchema = new Schema(
  {
    adminId: { type: Types.ObjectId, ref: "Admin" },
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    expiresAt: {
      type: Date,
      require: true,
      default: () => new Date(Date.now() + 1 * 60 * 1000),
      expires: 0,
    },
  },
  { timestamps: true }
);

export const adminOtpModel = mongoose.model("Admin_Otp", adminOtpSchema);
