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
  static async initiatePayment(
    amount: number,
    email: string,
    orderId: string,
    userId: string
  ) {
    if (!email || !amount || !orderId || !userId) {
      throw new Error("Email, amount, orderId, and userId are required");
    }
    try {

      const paystackResponse = await Paystack.initializeTransaction({
        amount: amount * 100, // to kobo
        email: email,
        callback_url: "https://google.com",
        metadata: { orderId },
      });
      let payment;

      if (paystackResponse.status === true) {
         const { reference, access_code, authorization_url } =
          paystackResponse.data;
        // save payment info to db
        const payment = await PaymentRepository.CreatePayment({
          userId,
          orderId,
          amount: amount,
          reference,
          accessCode: access_code,
          authorizationUrl: authorization_url,
          status: "paid",
        });
        return payment;
      }

      return paystackResponse;
    } catch (error: any) {
      if (error.response) {
        throw throwCustomError(error.response?.data.message, 400);
      }
      throw error;
    }
  }

  static async verifyPayment(reference: any) {
    try {
      const response = await Paystack.verifyPayment(reference);
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
          subject: "Order Confirmation - " + order.orderId,
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

  //update payment status
  static async updatePaymentStatus(reference: string, status: string) {
    try {
      const payment = await PaymentRepository.updatePaymentStatus(reference, status);
      if (!payment) {
        throw new Error("Payment not found");
      }
      return payment;
    } catch (error: any) {
      throw error;
    }
  }
  }