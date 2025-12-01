import mongoose, { Schema } from "mongoose";

const paystackSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", require: true },
  orderId: { type: Schema.Types.ObjectId, ref: "Order", require: true },
  refund: { type: Number, require: true },
  fees: { type: Number, require: true },
  status: {
    type: String,
    require: true,
    enum: ["pending", "paid", "failed", "in_progress"],
  },
  reference: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const payoutModel = mongoose.model("Paystack", paystackSchema);
