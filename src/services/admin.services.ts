import { IAdminReg } from "../interface/admin.interface";
import { throwCustomError } from "../middleware/errorHandler";
import { AdminRepo } from "../repository/admin.repo";
import bcrypt from "bcrypt";
import { adminValidate } from "../validation/admin.validate";

export class AdminService {
  static createAdmin = async (admin: IAdminReg) => {
    const { error } = adminValidate.validate(admin);
    if (error) {
      throw throwCustomError(error.message, 422);
    }
    admin.firstName = admin.firstName.toLowerCase();
    admin.lastName = admin.lastName.toLowerCase();
    admin.email = admin.email.toLowerCase();
    const isAdmin = await AdminRepo.findAdminByEmail(admin.email);
    if (isAdmin) {
      throw throwCustomError("sorry, you can not use this email", 409);
    }

    const hashedPassword = await bcrypt.hash(admin.password, 5);

    const response = await AdminRepo.createAdmin({
      ...admin,
      password: hashedPassword,
    });
    if (!response) {
      throw throwCustomError("unable to create Admin account", 500);
    }
    return "Admin account created";
  };
}
