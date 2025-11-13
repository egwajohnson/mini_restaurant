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
}
