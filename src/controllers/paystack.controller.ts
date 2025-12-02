import { Request, Response } from "express";
import { PaystackService } from "../services/paystack.services";
import { IRequest } from "../middleware/authMiddleware";

export class PaystackController {
  static async initiatePayment(req: IRequest, res: Response) {
    try {
      const { amount, email, orderId } = req.body;
      const userId = req.user.id;
      const response = await PaystackService.initiatePayment(
        amount,
        email,
        orderId,
        userId as any
      );
      console.log("PAYSTACK RESPONSE => ", response);
      res.status(200).json({
        success: true,
        message: "Payment initiated successfully",
        data: response,
      });
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  }
  static async verifyPayment(req: Request, res: Response) {
    try {
      const reference = req.params.reference as any;
      const response = await PaystackService.verifyPayment(reference);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  }

  static async handleCallback(req: Request, res: Response) {
    try {
      const { reference } = req.body;
      if (!reference) {
        throw new Error("Transaction reference not provided");
      }
      const response = await PaystackService.verifyPayment(reference);
      if (response.data.status === "success") {
        res.status(200).json({ success: true, payload: response });
      } else {
        res.status(400).send({ message: "Payment verification failed" });
      }
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  }

  static async webhook(req: Request, res: Response) {
    try {
      const response = await PaystackService.webhook(req.body);
      return res.status(200).json(response);
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  }
}
