import mongoose, { Schema, Types } from "mongoose";

export const userSchema = new Schema({
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  role: {
    type: String,
    enum: ["customer", "restaurant"],
  },
  otp: { type: String },
  dateOfBirth: {
    type: String,
  },
  is_kyc_verified: { type: Boolean, default: false },
  bvn: {
    type: String,
  },
  is_verified: { type: Boolean, require: true, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const userModel = mongoose.model("User", userSchema);
