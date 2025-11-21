import { Types } from "mongoose";
import { cartModel } from "../models/cart.model";
import {Cart} from "../interface/menuItem.interface";

export class CartRepositories {
    
  static createcart = async(data:Cart,userId: Types.ObjectId)=>{
    const response = await cartModel.create({...data,userId});
    return response;
  }

  static getcartByUserId = async(userId: Types.ObjectId)=>{
    const response = await cartModel.findOne({userId});
    return response;
  }

  // static createorder = async(cartId: Types.ObjectId,userId: Types.ObjectId,shippingAddress: {
    //   street: string;
    //   city: string;
    //   state: string;})=>{
    //     const response = await orderModel.create(cartId, userId, shippingAddress:street,city,state)

    // }

       

    }