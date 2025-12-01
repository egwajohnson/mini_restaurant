import mongoose, { Document, Types } from "mongoose";

export interface ICoupon {
  _id?: Types.ObjectId;          
  couponCode: string;                  
  discountType: "percentage" | "fixed"; 
  discountValue: number;                 
  minOrderValue: number;         
  validFrom?: Date;              
  validTo?: Date;                
  usageLimit?: number;           
  usageCount?: number;
  appliedToCustomers?: Types.ObjectId[];          
  active?: boolean;              
  appliedToMerchants?: Types.ObjectId[];
}


