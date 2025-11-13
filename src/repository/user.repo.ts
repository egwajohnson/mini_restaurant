import { response } from "express";
import { IPreReg } from "../interface/user.interface";
import { otpModel } from "../models/otp.model";
import { userModel } from "../models/user.model";

export class UserRepo {
  static createUser = async (user: IPreReg) => {
    const response = await userModel.create(user);
    if (!response) return null;
    return response;
  };

  static createOtp = async (email: string, otp: string) => {
    const response = await otpModel.create(email, otp);
    if (!response) return null;
    return response;
  };

  static saveOtp = async (email: string, otp: string) => {
    const response = await otpModel.findOneAndUpdate(
      { email },
      { otp },
      { new: true }
    );
    if (!response) return null;
    return response;
  };

  static getOtp = async (email: string) => {
    const res = await otpModel.findOne({ email });
    if (!res) return null;
    return res;
  };
}
