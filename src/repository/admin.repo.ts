import { Types } from "mongoose";
import { IAdminReg } from "../interface/admin.interface";
import { adminModel } from "../models/admin.model";

export class AdminRepo {
  static createAdmin = async (admin: IAdminReg) => {
    const res = await adminModel.create(admin);
    if (!res) return null;
    return res;
  };

  static findAdminByEmail = async (email: string) => {
    const response = await adminModel.findOne({ email });
    if (!response) return null;
    return response;
  };
  static findAdminUsername = async (username: string) => {
    const response = await adminModel.findOne({ username });
    if (!response) return null;
    return response;
  };

  static upgradeAdmin = async (filter: any, update: any) => {
    const response = adminModel.findOneAndUpdate(filter, update, { new: true });
    if (!response) return null;
    return response;
  };
}
