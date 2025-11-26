import mongoose, { Schema } from "mongoose";

export const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", require: true },
  cartId: { type: Schema.Types.ObjectId, ref: "Cart", require: true },
  subTotal: { type: Number, require: true }, //total unit price
  discount: { type: Number, require: false },
  orderId: { type: String, require: true },
  deliveryFee: { type: Number },
  totalAmount: { type: Number, require: true },
  couponCode: { type: String, require: false },
  paymentRef: { type: String, require: false },
  paymentMethod: {
    type: String,
    require: false,
    enum: ["paystack", "flutterwave", "stripe"],
  },
  status: {
    type: String,
    require: true,
    enum: [
      "draft",
      "pending",
      "completed",
      "cancelled",
      "delivered",
      "returned",
    ],
  },
  deliveryAddress: {
    street: { type: String, require: true },
    city: { type: String, require: true },
    state: { type: String, require: true },
  },
  currency: { type: String, require: true },
  totalPrice: { type: Number, require: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const orderModel = mongoose.model("Order", orderSchema);
