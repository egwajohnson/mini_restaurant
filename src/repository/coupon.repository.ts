
import couponModel from "../models/coupon.model";
import { ICoupon } from "../interface/coupon.interface";

export class CouponRepository {
    static createCoupon = async (couponData: ICoupon) => {
        const newCoupon = await couponModel.create(couponData);
        return newCoupon;
    }
}