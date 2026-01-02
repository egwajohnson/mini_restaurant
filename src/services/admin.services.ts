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
  resetPwdValid,
  upgradeAdmin,
} from "../validation/admin.validate";

import { adminModel } from "../models/admin.model";
import Jwt from "jsonwebtoken";
import { admin_jwt_secret, jwt_exp } from "../config/system.variable";
import crypto from "crypto";

import { Types } from "mongoose";
import { adminOtpModel } from "../models/otp.model";

import { adminTemplate } from "../utils/adminRegTemplate";
import { mailAdmin } from "../utils/admin-nodemailer";
import { adminLoginTemp } from "../utils/adminLoginTemp";

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
    //sendMail
    mailAdmin(
      {
        email: admin.email,
        subject: "Admin Registration Successful",
        emailInfo: {
          name: `${admin.firstName} ${admin.lastName}`,
        },
      },
      adminTemplate
    );
    return "Admin account created";
  };

  static adminLogin = async (
    data: {
      email: string;
      userName: string;
    },
    password: string,
    ipAddress: string,
    userAgent: string
  ) => {
    if (!data) throw throwCustomError("Input a data", 422);
    const { error } = adminLoginvalidate.validate(data);
    if (error) throw throwCustomError(error.message, 422);
    let admin;
    if (data.email) {
      // check email validity
      data.email = data.email.toLowerCase();
      admin = await adminModel.findOne({ email: data.email });
      if (!admin) throw throwCustomError("Invalid account", 500);
    } else {
      //   // check username
      data.userName = data.userName.toLowerCase();
      admin = await adminModel.findOne({ userName: data.userName });
      if (!admin) throw throwCustomError("Invalid Username", 422);
    }
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
    mailAdmin(
      {
        email: admin.email as string,
        subject: "Security Alert",
        emailInfo: {
          name: `${admin.userName}`,
          ipAddress: ipAddress,
          userAgent: userAgent,
        },
      },
      adminLoginTemp
    );

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
  static forgotPassword = async (email: string) => {
    const { error } = emailValidate.validate({ email });
    if (error) throw throwCustomError(error.message, 400);
    const admin = await adminModel.findOne({ email });
    if (!admin) throw throwCustomError("Invalid Email", 422);
    const res = await AdminService.genOtp(email);
    if (!res) throw throwCustomError("Unable to generate Otp", 400);
    return "An Otp has been sent to you";
  };
  static verifyOtp = async (email: string, otp: string) => {
    const res = await adminModel.findOne({ email });
    if (!res) throw throwCustomError("Invalid email", 422);
    const isOtp = await adminOtpModel.findOne({ otp });
    if (!isOtp) throw throwCustomError("Invalid Otp", 422);
    return isOtp;
  };
  static resetPassword = async (data: {
    email: string;
    otp: string;
    password: string;
    confirm: string;
  }) => {
    console.log(data.otp);
    console.log(data.password);

    const { error } = resetPwdValid.validate(data);
    if (error) throw throwCustomError(error.message, 400);
    //check account exist...
    const admin = await AdminRepo.findAdminByEmail(data.email);
    if (!admin) throw throwCustomError("Invalid account", 422);
    //OTP must be a number
    // if (isNaN(parseInt(data.otp)))
    //   throw throwCustomError("Otp must be digits", 422);
    //validate otp
    const isOtpValid = await adminOtpModel.findOne({
      email: data.email,
      otp: data.otp,
    });

    //compare passwords

    if (data.password !== data.confirm) {
      throw throwCustomError("Password do not match", 400);
    }

    if (!isOtpValid) throw throwCustomError("Invalid Otp", 400);
    if (data.confirm !== data.password) {
      throw throwCustomError("Password do not match", 400);
    }
    //hash password
    const hashPwd = await bcrypt.hash(data.confirm, 10);
    //save new password
    const response = await adminModel.findOneAndUpdate(
      { email: data.email },
      { password: hashPwd },
      { new: true }
    );
    return "Password has been reset";
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
  static genOtp = async (email: string) => {
    const otp = crypto.randomInt(100000, 999999);
    console.log(otp);
    await adminOtpModel.create({ email, otp });
    return otp;
  };

  static getAdmin = async () => {
    const response = await adminModel.find().select("-password -__v");
    if (!response) throw throwCustomError("Unable to complete request", 500);
    return response;
  };
}
