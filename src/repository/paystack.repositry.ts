import { payoutModel } from "../models/paystack.model";
import { Paystack } from "../utils/paystack";

export class PaymentRepository {
  static async CreatePayment(paymentData: any) {
    const payment = await payoutModel.create(paymentData);
    await payment.save();
    return payment;
  }

  static async updatePaymentStatus(reference: string, status: string) {
   const payment = await payoutModel.findOneAndUpdate(
      { reference },
      { status, updatedAt: new Date() },
      { new: true }
    );
    return payment;
  }
}
