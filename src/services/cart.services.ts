import {CartRepositories } from "../repository/cart.repository";
import { Types } from "mongoose";
import {Cart} from "../interface/menuItem.interface";

export class CartServices{
    static createcart= async(data:Cart,userId:Types.ObjectId)=>{
        if(!data){
            throw new Error("No data provided");
        }
        if(!userId){
            throw new Error("No userId provided");
        }
        const convirtingUserId = new Types.ObjectId(userId);
        const existingCart = await CartRepositories.getcartByUserId(convirtingUserId);
        if(existingCart){
            throw new Error("Cart already exists for this user");
        }
        const response = await CartRepositories.createcart(data,convirtingUserId);
        return response;
    }   

} 