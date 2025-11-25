import { Types } from "mongoose";
import { cartModel } from "../models/cart.model";
import {Cart} from "../interface/menuItem.interface";
import { menuItemModel} from "../models/menu.item.model";

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
    
  static createcart = async(ownerId: Types.ObjectId)=>{
    const response = await cartModel.create({ownerId});
    return response;
  }

  // get cart by user id
  static getcartByUserId = async(ownerId: Types.ObjectId)=>{
    const response = await cartModel.findOne({ownerId});
    return response;
  }

  // static createorder = async(cartId: Types.ObjectId,userId: Types.ObjectId,shippingAddress: {
    //   street: string;
    //   city: string;
    //   state: string;})=>{
    //     const response = await orderModel.create(cartId, userId, shippingAddress:street,city,state)

    // }

       

    }