import { IAdminReg } from "../interface/admin.interface";
import { throwCustomError } from "../middleware/errorHandler";
import { AdminRepo } from "../repository/admin.repo";
import bcrypt from "bcrypt";
import {
  adminLoginvalidate,
  adminValidate,
  emailValidate,
  profileValidate,
  pwdValidate,
  upgradeAdmin,
} from "../validation/admin.validate";
import { loginValidate } from "../validation/user.validate";
import { adminModel } from "../models/admin.model";
import Jwt from "jsonwebtoken";
import {
  admin_jwt_secret,
  jwt_exp,
  jwt_secret,
} from "../config/system.variable";
import { error } from "console";
import { Types } from "mongoose";

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

  static adminLogin = async (
    email: string,
    username: string,
    password: string,
    ipAddress: string,
    userAgent: string
  ) => {
    const { error } = adminLoginvalidate.validate({
      email,
      username,
      password,
    });
    if (error) throw throwCustomError(error.message, 422);
    //data to lowercase
    email = email.toLowerCase();
    // if (username) {
    //   // check username
    //   const userName = await adminModel.findOne({ username: username });
    //   if (!userName) throw throwCustomError("Invalid Account", 422);
    // }
    // check email validity
    const admin = await AdminRepo.findAdminByEmail(email);
    if (!admin) throw throwCustomError("Invalid account", 500);

    //compare password
    const hashedPassword = await bcrypt.compare(
      password,
      admin.password as string
    );
    if (!hashedPassword) throw throwCustomError("Invalid email/password", 422);
    const payload = {
      adminId: admin._id,
      adminType: admin.role,
    };

    let jwtKey = Jwt.sign(payload, admin_jwt_secret, {
      expiresIn: jwt_exp as any,
    });
    if (!jwtKey) {
      throw throwCustomError("Unable to Login", 500);
    }

    //send mail TODO
    return {
      message: "Login successful",
      authKey: jwtKey,
    };
  };

  static upgradeAdmin = async (email: any, role: any) => {
    const { error } = upgradeAdmin.validate({ email, role });
    if (error) throw throwCustomError(error.message, 422);
    email = email.toLowerCase();
    const filter = { email };
    const update = { role };
    const authAdmin = await adminModel.findOneAndUpdate(
      { email: email },
      { isAuthorized: true },
      { new: true }
    );
    if (!authAdmin) {
      throw throwCustomError("Unable to grant permission", 500);
    }
    const response = await AdminRepo.upgradeAdmin(filter, update);
    if (!response) throw throwCustomError("Unable to upgarde", 500);
    return "Your account has been Upgraded";
  };

  static profile = async (id: Types.ObjectId, update: any) => {
    const { error } = profileValidate.validate(update);
    if (error) throw throwCustomError(error.message, 422);
    const admin = await adminModel.findByIdAndUpdate({ _id: id }, update, {
      new: true,
    });
    if (!admin) throw throwCustomError("Unable to save changes", 500);
    return "Changes Saved";
  };

  static changePassword = async (
    email: string,
    password: string,
    update: { password: string; confirmPassword: string }
  ) => {
    const { error } = pwdValidate.validate(update);
    if (error) throw throwCustomError(error.message, 422);
    //check previous password validity
    const admin = await adminModel.findOne({ email: email });
    if (!admin) throw throwCustomError("Invalid", 422);
    const isPwdValid = await bcrypt.compare(password, admin.password as string);
    if (!isPwdValid) throw throwCustomError("Invalid Password", 422);
    //match new passwords
    if (update.confirmPassword !== update.password) {
      throw throwCustomError("Password do not match", 422);
    }
    //hash new password
    const hashPwd = await bcrypt.hash(update.confirmPassword, 5);
    if (!hashPwd) throw throwCustomError("Unable to hash password", 400);
    //save password
    const response = await adminModel.findOneAndUpdate(
      { email: email },
      { password: hashPwd },
      { new: true }
    );
    if (!response) throw throwCustomError("unable to change password", 422);

    return "Password Changed";
  };
  static deleteAdmin = async (email: string) => {
    email = email.toLowerCase();
    //check  admin existence
    const admin = await adminModel.findOne({ email: email });
    console.log(admin);
    if (!admin) throw throwCustomError("Invalid account", 422);
    //delete account
    const response = await adminModel.findOneAndDelete({ email: admin.email });
    if (!response) throw throwCustomError("Unable to delete account", 500);
    return "Account Deleted successfully";
  };

  static getAdmin = async () => {
    const response = await adminModel.find().select("-password -__v");
    if (!response) throw throwCustomError("Unable to complete request", 500);
    return response;
  };
}
