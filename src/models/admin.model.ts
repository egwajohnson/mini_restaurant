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
  dateOfBirth: {
    type: String,
  },
  bvn: {
    type: String,
  },
  is_verified: { type: Boolean, require: true, default: false },
});

export const adminModel = mongoose.model("Admin", adminSchema);
