import { IRequest } from "../middleware/authMiddleware";
import couponModel from "../models/coupon.model";
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

  static applyCoupon = async (req: IRequest, res: Response) => {
    try {
      const { couponCode, orderAmount } = req.body;
      const userId = req.user.id; // assume user is authenticated
      const result = await CouponServices.applyCoupon(userId, couponCode, orderAmount);
      res.status(200).json({success: true, message:"Coupon applied successfully", data: result});
    } catch (err: any) {
      console.error("Error applying coupon:", err);
      res.status(400).json({ success: false, message: err.message.detail || err.message } );
    }
  };

  static listCoupons = async (req: Request, res: Response) => {
    try {
      const coupons = await couponModel.find();
      res.status(200).json({ success: true, data: coupons });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };
}
    