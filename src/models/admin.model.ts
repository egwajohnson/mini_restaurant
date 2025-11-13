import mongoose, { Schema } from "mongoose";

export const adminSchema = new Schema({
  firstName: {
    type: String,
    require: true,
  },
  lastName: { type: String, require: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  role: {
    type: String,
    default: "Admin",
  },
  is_verified: { type: Boolean, require: true, default: true },
});

export const adminModel = mongoose.model("Admin", adminSchema);
