import { Types } from "mongoose";
import { cartModel } from "../models/cart.model";
import { Cart } from "../interface/menuItem.interface";
import { menuItemModel } from "../models/menu.item.model";
import { orderModel } from "../models/order.model";

export class CartRepositories {
  static findById = async (id: Types.ObjectId) => {
    const res = menuItemModel.findById(id).lean();
    if (!res) return null;
    return res;
  };
  static findByQuantity = async (menuitemId: Types.ObjectId) => {
    const res = await cartModel.findById(menuitemId).lean();
    if (!res) return null;
    return res;
  };

  static createcart = async (ownerId: Types.ObjectId) => {
    const response = await cartModel.create({ ownerId });
    return response;
  };

  // get cart by user id
  static getcartByUserId = async (ownerId: Types.ObjectId) => {
    const response = await cartModel.findOne({ ownerId });
    return response;
  };

  static getOrder = async (orderId:Types.ObjectId) =>{
    const order = await orderModel.findById(orderId);
    return order;

  }

   static async updateOrder(orderId: Types.ObjectId, menuitemId: Types.ObjectId, quantity: number ) {
    const order = await orderModel.findOneAndUpdate(
      { _id: orderId },

       { $set: { quantity: quantity } },
       { new: true, arrayFilters: [{"menuitemId": menuitemId}] }
    ).select('-__v');
    return order;
  }

}
