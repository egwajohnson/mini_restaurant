import { UserRepositories } from "../repository/user.repository";
import {
  IPreRegister,
  IVerifyUser,
  updateUser,
} from "../interface/user.interface";
import {
  preRegValidate,
  userValidate,
  loginValidate,
  updateUserValidate,
} from "../validation/user.validate";
import { throwCustomError } from "../middleware/errorHandler";
import bcrypt, { compare } from "bcrypt";
import Jwt from "jsonwebtoken";
import { jwt_exp, jwt_secret } from "../config/system.variable";
import { userModel } from "../models/user.model";
import { otpModel } from "../models/otp.model";
import { confirmationTemplate } from "../utils/login-template";
import { sendMail } from "../utils/nodemailer";
import { otpTemplate } from "../utils/otp-template";
import { RestaurantRepo } from "../repository/restaurant.repo";
import { CustomerRepo } from "../repository/customer.repo";
import crypto from "crypto";
import mongoose, { Types } from "mongoose";

export class UserServices {
  static preRister = async (user: IPreRegister) => {
    if (!user) {
      throw new Error("Invalid user data");
    }
    const { error } = preRegValidate.validate(user);
    if (error) {
      throw throwCustomError(error.details[0].message, 400);
    }
    user.email = user.email.toLowerCase();
    user.firstName = user.firstName.toLowerCase();
    user.lastName = user.lastName.toLowerCase();
    //check acct existence
    const isExist = await userModel.findOne({ email: user.email });
    if (isExist) {
      throw throwCustomError("email already in use.", 422);
    }

    const hashedPassword = await bcrypt.hash(user.password, 5);
    if (!hashedPassword) throw throwCustomError("Password hashing failed", 400);

    const response = await UserRepositories.createUser({
      ...user,
      password: hashedPassword,
    });
    if (!response) {
      throw throwCustomError("User registration failed", 500);
    }

    //generate role
    //gen role
    if (response.role === "customer") {
      const customer = await CustomerRepo.createCustomer(response._id);
      if (!customer) {
        throw throwCustomError("Unable to crerate a customer account", 500);
      }
    }
    if (response.role === "restaurant") {
      const restaurant = await RestaurantRepo.createRestaurant(response._id);
      if (!restaurant) {
        throw throwCustomError("Unable to create a Restaurant account", 500);
      }
    }

    // gen otp
    const otp = await UserServices.generateOtp(user.email);
    if (!otp) {
      throw throwCustomError("OTP generation failed", 500);
    }

    //hash otp
    const hashedOtp = await bcrypt.hash(otp.toString(), 5);
    if (!hashedOtp) throw throwCustomError("OTP hashing failed", 400);

    //save otp
    const savedOtp = await UserRepositories.saveOtp(user.email, hashedOtp);
    if (!savedOtp) {
      return "Account created, Successfully, please request for OTP to continue";
    }

    console.log("do not share with anyone", otp);

    // send otp
    sendMail(
      {
        email: user.email,
        subject: "OTP VERIFICATION",
        emailInfo: { 
          otp: otp.toString(),
          name: `${user.lastName} ${user.firstName}`,
        },
      },
      otpTemplate
    );

    return "Account created, Successfully. Please check your email for OTP to continue";
  };

  static register = async (user: IVerifyUser) => {
    if (!user) {
      throw new Error("Invalid user data");
    }
    const { error } = userValidate.validate(user);
    if (error) {
      throw throwCustomError(error.details[0].message, 400);
    }
    user.email = user.email.toLowerCase();

    // check if user exists
    const UserExist = await UserRepositories.findUserByEmail(user.email);
    if (!UserExist) {
      throw throwCustomError("User not found", 404);
    }
    //compare hashed otp
    const userOtp = await otpModel.findOne({ email: user.email });
    const isValid = await bcrypt.compare(
      user.otp.toString(),
      userOtp?.otp as string
    );
    if (!isValid) throw throwCustomError("Invalid Otp", 422);
    // verify otp
    const isOtpValid = await UserRepositories.otpVerify(user.email, user.otp);
    if (!isOtpValid) {
      throw throwCustomError("Invalid OTP", 400);
    }

    const verifyUser = await UserRepositories.getUserById(UserExist._id);
    if (!verifyUser) {
      throw throwCustomError("Unable to verify account", 500);
    }

    await UserRepositories.updateUsers(UserExist._id);

    return "Account is verified, You can now login";
  };

  static updateUser = async (
    userId: Types.ObjectId,
    updateData: updateUser
  ) => {
    if (!userId) throw throwCustomError("User ID is required", 400);
    const response = await UserRepositories.updateUser(userId, updateData);
    if (!response) {
      throw throwCustomError("server not responding", 404);
    }
    return response;
  };

  static requestNewOtp = async (email: string) => {
    const { error } = userValidate.validate({ email });
    if (error) {
      throw throwCustomError(error.message, 422);
    }
    if (!email) {
      throw throwCustomError("Email is required", 422);
    }
    const user = await UserRepositories.findUserByEmail(email);
    if (!user) {
      throw throwCustomError("User not found", 404);
    }

    const otps = await UserServices.generateOtp(email);
    console.log("do not share with anyone", otps);
    if (!otps) {
      throw throwCustomError("OTP generation failed", 500);
    }
    // send otp via mail
    sendMail(
      {
        email: email,
        subject: "REQUEST OTP VERIFICATION",
        emailInfo: {
          otp: otps.toString(),
          name: `${user.firstName} ${user.lastName}`,
        },
      },
      otpTemplate
    );
    return "New OTP has been sent to your email";
  };

  static resetpassword = async (
    email: string,
    otp: string,
    newPassword: string
  ) => {
    if (!email || !newPassword || !otp) {
      throw throwCustomError("All fields are required", 422);
    }
    const { error } = userValidate.validate({ email });
    if (error) {
      throw throwCustomError(error.message, 422);
    }
    // check if user exists
    const user = await UserRepositories.findUserByEmail(email);
    if (!user) {
      throw throwCustomError("User not found", 404);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 5);
    if (!hashedPassword) throw throwCustomError("Password hashing failed", 400);

    const getotp = await UserRepositories.requestotp(email, otp);
    if (!getotp) {
      throw throwCustomError("OTP not found, please generate a new one", 404);
    }
    const response = await UserRepositories.resetPassword(
      email,
      hashedPassword,
      otp
    );
    if (!response) {
      throw throwCustomError("Unable to reset password", 500);
    }

    return "Password reset successful, you can now login with your new password";
  };

  static login = async (
    email: string,
    password: string,
    ipAddress: string,
    userAgent: string
  ) => {
    const { error } = loginValidate.validate({ email, password });
    if (error) throw throwCustomError(error.message, 422);
    //check email
    const user = await userModel.findOne({ email: email });

    if (!user) throw throwCustomError("Invalid account", 500);
    //check password
    const hashedPassword = await bcrypt.compare(
      password,
      user.password as string
    );
    if (!hashedPassword) throw throwCustomError("Invalid email/password", 422);
    const payload = {
      userId: user._id,
      userType: user.role,
    };

    let jwtKey = Jwt.sign(payload, jwt_secret, { expiresIn: jwt_exp as any });
    if (!jwtKey) {
      throw throwCustomError("unable to log in", 500);
    }
    //send mail - TODO
    sendMail(
      {
        email: email,
        subject: "Login Confirmation",
        emailInfo: {
          ipAddress: ipAddress,
          userAgent: userAgent,
          name: `${user.lastName} ${user.firstName}`,
        },
      },
      confirmationTemplate
    );

    return {
      message: "Login Successful",
      authkey: jwtKey,
    };
  };

  static async generateOtp(email: string) {
    const { error } = userValidate.validate({ email });
    if (error) {
      throw throwCustomError(error.message, 422);
    }
    const otp = crypto.randomInt(100000, 999999);
    await otpModel.create({ email, otp });
    const savedOtp = await UserRepositories.saveOtp(email, otp.toString());
    if (!savedOtp) {
      throw throwCustomError("Unable to generate OTP", 500);
    }

    return otp;
  }
}
