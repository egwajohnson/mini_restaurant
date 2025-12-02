import { Types } from "mongoose";
import { characters } from "../config/system.variable";
import { ICoupon } from "../interface/coupon.interface";
import { CouponRepository } from "../repository/coupon.repository";
import { CartRepositories } from "../repository/cart.repository";
import { UserRepositories } from "../repository/user.repository";
import { throwCustomError } from "../middleware/errorHandler";
export class CouponServices {
  static createCoupon = async (couponData: ICoupon) => {
    if(!couponData.discountType){
      throw throwCustomError("Discount type is required", 400);
    }
    if(!couponData.discountValue){
      throw throwCustomError("Discount value is required", 400);
    }
    if(!couponData.minOrderValue){
      throw throwCustomError("Minimum order value is required", 400);
    }


    // Generate a unique coupon code
    const couponCode = this.generateCouponCode(8);
    couponData.couponCode = couponCode;
    if (!couponData.validFrom) {
      couponData.validFrom = new Date();
    }
    couponData.appliedToCustomers = [];
    couponData.usageCount = 0;
    // Save the coupon to the database
    const newCoupon = await CouponRepository.createCoupon(couponData);
    return newCoupon;
  };

  static generateCouponCode = (length: number): string => {
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  static applyCoupon = async (
    userId: Types.ObjectId | string,
    couponCode: string,
    orderAmount: number
  ) => {
    const coupon = await CouponRepository.findByCode(couponCode);
    if (!coupon) {
      throw new Error("Invalid coupon code");
    }

    // Check if coupon is active
    if (!coupon.active) {
      throw new Error("Coupon is not active");
    }

    const now = new Date();

    if (coupon.validFrom && isNaN(coupon.validFrom.getTime())) {
      throw new Error("Invalid validFrom date");
    }

    // Check validFrom (not yet active)
    if (coupon.validFrom && now < coupon.validFrom) {
      throw new Error("Coupon is not yet active");
    }

    // Check expiration
    if (coupon.validTo && now > coupon.validTo) {
      throw new Error("Coupon expired");
    }

    // Check if the user has already used the coupon
    if (coupon.appliedToCustomers?.some((id) => id.toString() === userId)) {
      throw new Error("Coupon already used by this user");
    }

    const usageLimit = coupon.usageLimit ?? 1;
    const usageCount = coupon.usageCount ?? 0;
    // Check usage limit
    if (usageCount >= usageLimit) {
      throw new Error("Coupon usage limit reached");
    }

    // Check minimum order value
    if (orderAmount < coupon.minOrderValue) {
      throw new Error(`Minimum order amount is ${coupon.minOrderValue}`);
    }

    // Calculate discount
    let discount = 0;

    if (coupon.discountType === "percentage") {
      discount = (coupon.discountValue / 100) * orderAmount;
    } else {
      discount = coupon.discountValue;
    }

    // Prevent discount from exceeding order amount
    discount = Math.min(discount, orderAmount);

    // Mark coupon as used by this user
    coupon.appliedToCustomers = coupon.appliedToCustomers || [];

    // Increase usage count
    coupon.usageCount = (coupon.usageCount ?? 0) + 1;
    coupon.updatedAt = new Date();
    await coupon.save();
    // Update user's total discount received
    if (coupon) {
      const user = await CartRepositories.getCoupon(couponCode);
      if (user) {
        user.totalAmount = (user.totalAmount || 0) - discount;
        await user.save();
      }
    }

    return {
      success: true,
      discount,
      newTotal: orderAmount - discount,
      message: "Coupon applied successfully",
    };
  };
}
