import {CartRepositories } from "../repository/cart.repository";
import { Types } from "mongoose";
import { cartModel } from "../models/cart.model";
import { throwCustomError } from "../middleware/errorHandler";
import {cartItem} from "../validation/menu.validate"; 
import {Cart} from "../interface/menuItem.interface";

export class CartServices{
  static createcart = async(ownerId: Types.ObjectId)=>{
    if(!ownerId){
      throw throwCustomError("Invalid cart data",400);
    }
    const existingCart = await CartRepositories.getcartByUserId(ownerId);
    if(existingCart){
      throw throwCustomError("Cart already exists for this user",409);
    }
    const response = await CartRepositories.createcart(ownerId);
    return response;
  }

   // update cart
    static updateCart = async (data: Cart, ownerId: Types.ObjectId) => {
    const { error } = cartItem.validate(data);
    if (error) throwCustomError(`Validation error: ${error.message}`, 400);

    if (!Types.ObjectId.isValid(data.menuitemId))
      throw throwCustomError("InvaliId Product ID", 422);
    //get product by id
    const product = await CartRepositories.findById(
      new Types.ObjectId(data.menuitemId)
    );
    if (!product) throw throwCustomError("Product not found", 404);

    // Calculate total price
    const price = product.discountedPrice ?? product.price;

    if (data.quantity > product.quantity)
      throw throwCustomError("Out of stock", 400);

    //get user cart
    const cart = await cartModel.findOne({ ownerId: ownerId });
    if (!cart) {
      //create the cart
      const res = await cartModel.create({
        ownerId: ownerId,
        items: [
          {
            productId: data.menuitemId,
            productName: product.name,
            quantity: data.quantity,
            price: price,
          },
        ], 
        //totalPrice: price * data.quantity,
        totalprice: price as any* data.quantity,
      });
      return {
        success: true,
        message: "Cart updated",
        data: res,
      };
    } else {
      const idx = cart?.items.findIndex(
        (item) => item.productId?.toString() === data.menuitemId.toString()
      );

      if (idx > -1) {
        cart.items[idx].quantity = data.quantity;
      } else {
        cart.items.push({
          productId: data.menuitemId,
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

  // get cart by user 
  static getCarts = async(ownerId: Types.ObjectId)=>{
    const cart = await CartRepositories.getcartByUserId(ownerId);
    if(!cart) throw throwCustomError("Cart not found",404);
    return {
      success:true,
      message:"Cart fetched successfully",
      data:cart
    }
  }

} 