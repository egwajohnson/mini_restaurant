import { CartRepositories } from "../repository/cart.repository";
import { Types } from "mongoose";
import { cartModel } from "../models/cart.model";
import { throwCustomError } from "../middleware/errorHandler";
import { cartItem } from "../validation/menu.validate";
import { Cart } from "../interface/menuItem.interface";
import { orderModel } from "../models/order.model";
import { orderTemplate } from "../utils/order-template";
import { userModel } from "../models/user.model";

export class CartServices {
  static createcart = async (ownerId: Types.ObjectId) => {
    if (!ownerId) {
      throw throwCustomError("Invalid cart data", 400);
    }
    const existingCart = await CartRepositories.getcartByOwner(ownerId);
    if (existingCart) {
      throw throwCustomError("Cart already exists for this user", 409);
    }
    const response = await CartRepositories.createcart(ownerId);
    return response;
  };

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
            menuItemId: data.menuitemId,
            name: product.name,
            quantity: data.quantity,
            price: price,
          },
        ],
        //totalPrice: price * data.quantity,
        totalprice: (price as any) * data.quantity,
      });
      return {
        success: true,
        message: "Cart updated",
        data: res,
      };
    } else {
      const idx = cart?.items.findIndex(
        (item) => item.menuItemId?.toString() === data.menuitemId.toString()
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
  static getCarts = async (ownerId: Types.ObjectId) => {
    const cart = await CartRepositories.getcartByOwner(ownerId);
    if (!cart) throw throwCustomError("Cart not found", 404);
    return {
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    };
  };

  // create order
  static createorder = async (
    cartId: Types.ObjectId,
    userId: Types.ObjectId,
    shippingAddress: {
      street: string;
      city: string;
      state: string;
    }
  ) => {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        throw throwCustomError("User not found", 404);
      }
      const cart = await cartModel.findById(cartId);
      if (!cart) {
        throw throwCustomError("Cart not found", 404);
      }
      const getorderId = await orderModel.findOne({
        cartId: cartId,
        userId: userId,
      });
      if (getorderId) {
        throw throwCustomError("Order already exists for this cart", 409);
      }
      const orderId = `ORD-${Date.now()}`;
      const order = await orderModel.create({
        cartId,
        userId,
        shippingAddress,
        orderId,
        subTotal: cart.totalPrice,
        paymentMethod: "paystack",
        status: "draft",
        currency: "NGN",
        totalPrice: cart.totalPrice,
      });

      if (!order) {
        throw throwCustomError("Order creation failed", 500);
      }
      // initiate payment here (mocked for this example)
      const paymentRef = `PAY-${Date.now()}`;

      order.paymentRef = paymentRef;
      order.status = "pending";
      await order.save();

      return {
        success: true,
        message: "Order created successfully",
        data: order,
      };
    } catch (error: any) {
      throw throwCustomError(
        error.message || "Order creation failed",
        error.statusCode || 500
      );
    }
  };

  // Get Orders
  static getOrder = async (orderId: Types.ObjectId) => {
    if (!orderId) {
      throw throwCustomError("Order ID is required", 400);
    }
    const order = await CartRepositories.getOrder(orderId);
    if (!order) {
      throw throwCustomError("Order not found", 404);
    }
    return {
      success: true,
      message: "Order retrieved successfully",
      data: order,
    };
  };

  static async updateOrder(
    cartId: Types.ObjectId,
    menuItemId: Types.ObjectId,
    quantity: number
  ) {
    if (!cartId) {
      throw new Error("Order ID is required");
    }
    if (!menuItemId) throw new Error("Menu Item ID is required");
    if (quantity == null || isNaN(quantity)) {
      throw new Error("Quantity must be a valid number");
    }

    const order = await CartRepositories.updateOrder(
      cartId,
      menuItemId,
      quantity
    );
    return order;
  }
}
