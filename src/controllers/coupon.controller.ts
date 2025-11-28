import { CouponServices } from "../services/coupon.services";
import { Request, Response } from "express";
export class CouponController {
    static createCoupon = async (req: Request, res: Response) => {
        try {
            const couponData = req.body;
            console.log("Received coupon data:", couponData);
            const newCoupon = await CouponServices.createCoupon(couponData);
            res.status(201).json({ success: true, message: "Coupon created successfully", data: newCoupon });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error", error });
        }
    }
}