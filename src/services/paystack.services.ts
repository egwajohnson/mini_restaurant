import axios from "axios";
import { throwCustomError } from "../middleware/errorHandler";
import { PaymentRepository } from "../repository/paystack.repositry";
import { Paystack } from "../utils/paystack";
import { orderModel } from "../models/order.model";
import { Types } from "mongoose";
import { sendMail } from "../utils/nodemailer";
import { cartModel } from "../models/cart.model";
import { orderTemplate } from "../utils/order-template";
export class PaystackService {
  static async initiatePayment(amount: number, email: string, orderId: string) {
     if (!email || !amount || !orderId) {
        throw new Error("Email, amount, and orderId are required");
      }
    try {
      const paymentData = {
        amount,
        email,
      };
      const paystackResponse = await Paystack.initializeTransaction({
        amount: paymentData.amount * 100, // to kobo
        email: paymentData.email,
        callback_url: "https://google.com",
        metadata: {
          orderId,
        },
      });
      return paystackResponse;
    } catch (error: any) {
      if (error.response) {
        throw throwCustomError(error.response?.data.message, 400);
      }
    }
  }

  static async verifyPayment(reference: any) {
    try {
      console.log("this is the ref", reference);
      const response = await Paystack.verifyPayment(reference);
      console.log(response);
      return response;
    } catch (error: any) {
      if (error.response) {
        throw throwCustomError(error.response?.data.message, 400);
      }
    }
  }

  // paystack webhook

  static async webhook(payload: any) {

    //check if trx is successfull
    if (payload.data.status === "success") {
      const orderId = payload.data.metadata.orderId;

      //find the order
      const order = await orderModel
        .findById(new Types.ObjectId(orderId))
        .populate({
          path: "userId",
          model: "User",
        });

      if (!order) return { message: "Order not found" };

      order.status = "completed";
      order.paymentRef = payload.data.reference;
      await order.save();

      //send notification to the user
      const user = order.userId as any;

      const cart = await cartModel.findById(order.cartId);

      sendMail(
        {
          email: user.email,
          subject: "Login Confirmation",
          emailInfo: {
            customer_name: user.firstName,
            order_number: order.orderId,
            order_date: new Date(order.createdAt),
            items: cart?.items,
            order_total: order.totalPrice,
            company_name: "TechStore",
            company_address: "1234 Market St, San Francisco, CA",
          },
        },
        orderTemplate
      );

      return { mesage: "success" };
    }
  }
}
