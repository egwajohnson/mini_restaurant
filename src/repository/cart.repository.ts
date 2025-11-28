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
    const response = await cartModel.create({ ownerId, items: [], totalPrice: 0 });
    return response;
  };

  static addItem = async (cartId: string, item: any) => {
    const response = await cartModel.findByIdAndUpdate(
      cartId, item, { new: true }
    );
    return response;
  };

  static updatecart = async (cartId: string, data:Cart) => {
    const response = await cartModel.findByIdAndUpdate(cartId, data, {
      new: true,
    });
    return response;
  }

  // get cart by user id
  static getcartByOwner = async (ownerId: Types.ObjectId) => {
    const response = await cartModel.findOne({ ownerId });
    return response;
  };

  static getOrder = async (orderId:Types.ObjectId) =>{
    const order = await orderModel.findById(orderId);
    return order;

  }

   static async updateOrder(cartId: Types.ObjectId, menuItemId: Types.ObjectId, quantity: number ) {
    const order = await cartModel.findOneAndUpdate(
      { _id: cartId },

       { 
        $set: {
          "items.$[elem].quantity": quantity 
        } 
      },
       { 
        new: true, 
        arrayFilters: 
        [
          {
            "elem.menuItemId": menuItemId
          }
        ] 
      }
    ).select('-__v');
    return order;
  }

}
