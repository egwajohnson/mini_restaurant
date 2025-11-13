import { ICustomer } from "../interface/customer.interface";
import { customerModel } from "../models/customer.model";

export class CustomerRepo {
  static async createCustomer(customer: ICustomer) {
    const response = await customerModel.create({
      userId: customer._id,
    });
    if (!response) return null;
    return response;
  }
}
