import { Types } from "mongoose";
import { cartModel } from "../models/cart.model";
import {Cart} from "../interface/menuItem.interface";
import { menuItemModel, productModel } from "../models/menu.item.model";

export class CartRepositories {
   static findById = async (id: Types.ObjectId) => {
    const res = productModel.findById(id).lean();
    if (!res) return null;
    return res;
  };
   static findByQuantity = async (productId: Types.ObjectId) => {
    const res = await cartModel.findById(productId);
    if (!res) return null;
    return res;
  };
    
  static createcart = async(data:Cart)=>{
    const response = await cartModel.create(data);
    return response;
  }

// get all products with pagination and search
  static getCarts = async (
    page: number,
    limit: number,
    search: string = ""
  ) => {
    const skip = (page - 1) * limit;

    const escapeRegex = (str: string) =>
      str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const query = search
      ? { productName: { $regex: escapeRegex(search), $options: "i" } }
      : {};

    const response = await cartModel
      .find(query)
      .lean()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const count = await cartModel.countDocuments(query);

    const total = Math.ceil(count / limit);

    return {
      products: response,
      meta: {
        pages: total,
        page: page,
        limit: limit,
        totalRecords: count,
      },
    };
  };

  // update product by id
   static updateProduct = async (id: Types.ObjectId) => {
    const response = await cartModel
      .findByIdAndUpdate(id, {}, { new: true })
      .lean();

    if (!response) return null;
    return response;
  };

  // find and delete product by id
  static findAndDelete = async (id: string): Promise<any> => {
    const response = await cartModel.findByIdAndDelete(id).lean();
    if (!response) return null;
    return response;
  };

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