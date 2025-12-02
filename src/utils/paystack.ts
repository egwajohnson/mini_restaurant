import axios from "axios";
import { API_KEY } from "../config/system.variable";
import { IInitializeTransaction } from "../interface/initialize.intrface";


const API_URL = "https://api.paystack.co";

export class Paystack {
  static async initializeTransaction(data: IInitializeTransaction) {
    console.log(data);
    const response = await axios.post(
      `${API_URL}/transaction/initialize`,
      data,
      {
        headers: {
          Authorization: `Bearer ${API_KEY} `,
          "content-type": "application/json",
        },
      }
    );
    return response.data;
  }

  static async verifyPayment(reference: string) {
    const response = await axios.get(
      `${API_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }
}
