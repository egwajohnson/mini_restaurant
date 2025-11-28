import { characters } from "../config/system.variable";
import { ICoupon } from "../interface/coupon.interface";
import { CouponRepository } from "../repository/coupon.repository";
export class CouponServices {
    static createCoupon = async (couponData: ICoupon) => {
        // Generate a unique coupon code
        const code = this.generateCouponCode(8);
        couponData.code = code;
        const newCoupon = await CouponRepository.createCoupon(couponData);
        return newCoupon;
    }
    static generateCouponCode = (length: number): string => {
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

}