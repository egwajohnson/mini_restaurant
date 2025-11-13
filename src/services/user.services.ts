import { IPreReg, IVerify } from "../interface/user.interface";
import { throwCustomError } from "../middleware/errorHandler";
import { userModel } from "../models/user.model";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  loginValidate,
  preRegValidate,
  regValidate,
} from "../validation/user.validate";
import { UserRepo } from "../repository/user.repo";
import crypto from "crypto";
import { CustomerRepo } from "../repository/customer.repo";
import { RestaurantRepo } from "../repository/restaurant.repo";
import { otpModel } from "../models/otp.model";
import { jwt_exp, jwt_secret } from "../config/system.variable";

export class UserServices {
  static preRegister = async (user: IPreReg) => {
    const { error } = preRegValidate.validate(user);
    if (error) {
      throw throwCustomError(error.message, 422);
    }
    //check acct existence
    const isExist = await userModel.findOne({ email: user.email });
    if (isExist) {
      throw throwCustomError("email already in use.", 422);
    }
    //hash password
    const hashedPassword = await bcrypt.hash(user.password, 5);

    //create account
    const response = await UserRepo.createUser({
      ...user,
      password: hashedPassword,
    });
    if (!response) {
      throw throwCustomError("Unable to create account", 500);
    }

    //gen role
    if (response.role === "customer") {
      const customer = await CustomerRepo.createCustomer(response._id);
      if (!customer) {
        throw throwCustomError("Unable to crerate a customer account", 500);
      }
    }
    if (response.role === "restaurant") {
      const restaurant = await RestaurantRepo.createrRestaurant(response._id);
      if (!restaurant) {
        throw throwCustomError("Unable to create a Restaurant account", 500);
      }
    }
    //gen otp
    const otp = await UserServices.genOtp(user.email);

    //save Otp
    const saveOtp = await UserRepo.saveOtp(user.email, otp);
    //sendmail - TODO

    return "Account Created";
  };

  static register = async (data: IVerify) => {
    const { error } = regValidate.validate(data);
    if (error) {
      throw throwCustomError(error.message, 422);
    }
    //check email
    const isValid = await userModel.findOne({ email: data.email });
    if (!isValid) {
      throw throwCustomError("Invalid email", 422);
    }
    //Otp must be a Number
    if (isNaN(parseInt(data.otp)))
      throw throwCustomError("Otp must be digits", 422);

    //validate Otp
    const isOtpValid = await otpModel.findOne({
      email: data.email,
      otp: data.otp,
    });
    if (!isOtpValid) {
      throw throwCustomError("Invalid Otp", 400);
    }

    //delete otp after verificatiom
    const isOtp = await otpModel.findOneAndDelete(
      { email: data.email },
      { otp: data.otp }
    );
    //verify account
    await userModel.findOneAndUpdate(
      { email: data.email },
      { is_verified: true },
      { new: true }
    );
    return "Account is now Verified. login";
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

    return {
      message: "Login Successful",
      authkey: jwtKey,
    };
  };

  static genOtp = async (email: string): Promise<any> => {
    const otp = crypto.randomInt(100000, 999999);
    console.log(otp);
    await otpModel.create({ email, otp });
    return otp;
  };
}
