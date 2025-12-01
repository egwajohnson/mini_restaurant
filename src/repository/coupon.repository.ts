import couponModel from "../models/coupon.model";
import { ICoupon } from "../interface/coupon.interface";
import { Types } from "mongoose";

export class CouponRepository {
  static createCoupon = async (couponData: ICoupon) => {
    const newCoupon = await couponModel.create(couponData);
    return newCoupon;
  };

  static applyCoupon = async (
    userId: Types.ObjectId,
    couponCode: string,
    minOrderValue: number
  ) => {
    const coupon = await couponModel.findById({
      userId,
      couponCode,
      minOrderValue,
    });
    return coupon;
  };

  static findByCode = async (couponCode: string) => {
    const coupon = await couponModel.findOne({ couponCode });
    return coupon;
  };

  static findAll = async () => {
    return await couponModel.find();
  };

  static findById = async (id: string) => {
    return await couponModel.findById(id);
  };

  static updateCoupon = async (id: string, updateData: any) => {
    return await couponModel.findByIdAndUpdate(id, updateData, { new: true });
  };
}
