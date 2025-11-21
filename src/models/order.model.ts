import mongoose, { Schema } from "mongoose";

export const orderSchema = new Schema({
<<<<<<< HEAD
  id: { type: Schema.Types.ObjectId, require: true, unique: true },
=======
>>>>>>> 9078d0f9b7261500eb8a2fbdce9e6a5581bf85bd
  userId: { type: Schema.Types.ObjectId, ref: "User", require: true },
  cartId: { type: Schema.Types.ObjectId, ref: "Cart", require: true },
  subTotal: { type: Number, require: true }, //total unit price
  discount: { type: Number, require: false },
  orderId: { type: String, require: true },
<<<<<<< HEAD
  shippingFee: { type: Number },
=======
  deliveryFee: { type: Number },
>>>>>>> 9078d0f9b7261500eb8a2fbdce9e6a5581bf85bd
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
<<<<<<< HEAD
      "shipped",
=======
>>>>>>> 9078d0f9b7261500eb8a2fbdce9e6a5581bf85bd
      "cancelled",
      "delivered",
      "returned",
    ],
  },
<<<<<<< HEAD
  shippingAddress: {
=======
  deliveryAddress: {
>>>>>>> 9078d0f9b7261500eb8a2fbdce9e6a5581bf85bd
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
