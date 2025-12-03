import e from "express";
import { string } from "joi";
import mongoose, { Schema } from "mongoose";

const paystackSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", require: true },
  orderId: { type: String, ref: "Order", require: true },
  amount: { type: Number, require: true },
  refund: { type: Number, default: 0 },
  fees: { type: Number, default: 0 },
  status: {
    type: String,
    require: true,
    enum: ["pending", "paid", "failed", "in_progress"],
  },
  reference: { type: String },
  accessCode: { type: String, required: true },
  authorizationUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const payoutModel = mongoose.model("Paystack", paystackSchema);
