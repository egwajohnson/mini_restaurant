import mongoose, { Schema } from "mongoose";
import { menuItemModel } from "../models/menu.item.model";


const cartItemSchema = new Schema({
  menuItemId: { type: Schema.Types.ObjectId, ref: "Menu_Item", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  name: { type: String } // optional
});


const cartSchema = new Schema( 
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", require: true },
    items: [cartItemSchema], 
    couponCode: { type: String },
    totalPrice: { type: Number, require: true },
  },
  { timestamps: true }
);

export const cartModel = mongoose.model("Cart", cartSchema);


