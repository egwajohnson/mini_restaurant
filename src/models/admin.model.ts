import mongoose, { Schema, Types } from "mongoose";

export const adminSchema = new Schema({
  adminId: { type: Types.ObjectId, require: true },
  firstName: {
    type: String,
    require: true,
  },
  otp: { type: String },
  lastName: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  userName: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  role: {
    type: String,
    enum: ["admin", "superAdmin"],
    default: "admin",
  },
  is_verified: { type: Boolean, require: true, default: true },
  isAuthorized: { type: Boolean, require: true, default: false },
});

export const adminModel = mongoose.model("Admin", adminSchema);
