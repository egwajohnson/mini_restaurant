import mongoose, { Document, Types } from "mongoose";

export interface ICoupon {
  _id?: Types.ObjectId;          
  code: string;                  
  type: "percentage" | "fixed"; 
  value: number;                 
  minOrderValue: number;         
  validFrom?: Date;              
  validTo?: Date;                
  usageLimit?: number;           
  usageCount?: number;          
  active?: boolean;              
  appliedToMerchants?: Types.ObjectId[];
}


