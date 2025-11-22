import {CartRepositories } from "../repository/cart.repository";
import { Types } from "mongoose";
import { cartModel } from "../models/cart.model";
import { throwCustomError } from "../middleware/errorHandler";
import {cartItem} from "../validation/menu.validate"; 
import {Cart} from "../interface/menuItem.interface";

export class CartServices{
    static updateCart = async (data: Cart, userId: Types.ObjectId) => {
    const { error } = cartItem.validate(data);
    if (error) throwCustomError(`Validation error: ${error.message}`, 400);

    if (!Types.ObjectId.isValid(data.productId))
      throw throwCustomError("InvaliId Product ID", 422);
    //get product by id
    const product = await CartRepositories.findById(
      new Types.ObjectId(data.productId)
    );
    if (!product) throw throwCustomError("Product not found", 404);

    // Calculate total price
    const price = product.discountPrice ?? product.price;

    if (data.quantity > product.quantity)
      throw throwCustomError("Out of stock", 400);

    //get user cart
    const cart = await cartModel.findOne({ ownerId: userId });
    if (!cart) {
      //create the cart
      const res = await cartModel.create({
        ownerId: userId,
        items: [
          {
            productId: data.productId,
            productName: product.name,
            quantity: data.quantity,
            price: price,
          },
        ], 
        totalPrice: price * data.quantity,
      });
      return {
        success: true,
        message: "Cart updated",
        data: res,
      };
    } else {
      const idx = cart?.items.findIndex(
        (item) => item.productId?.toString() === data.productId.toString()
      );

      if (idx > -1) {
        cart.items[idx].quantity = data.quantity;
      } else {
        cart.items.push({
          productId: data.productId,
          quantity: data.quantity,
          price: price,
        });
      }

      const sum = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      cart.totalPrice = sum;

      await cart.save();

      return {
        success: true,
        message: "Cart updated",
        data: cart,
      };
    }
  };

} 