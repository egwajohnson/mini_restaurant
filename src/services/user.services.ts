import { IPreReg, IVerify } from "../interface/user.interface";
import { throwCustomError } from "../middleware/errorHandler";
import { userModel } from "../models/user.model";
import bcrypt from "bcrypt";
import { preRegValidate, regValidate } from "../validation/user.validate";
import { UserRepo } from "../repository/user.repo";
import crypto from "crypto";
import { CustomerRepo } from "../repository/customer.repo";
import { RestaurantRepo } from "../repository/restaurant.repo";
import { otpModel } from "../models/otp.model";

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
    //hash otp
    // const hashOtp = await bcrypt.hash(otp.toString(), 2);
    //save Otp
    const saveOtp = await UserRepo.saveOtp(user.email, otp);

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

  static genOtp = async (email: string): Promise<any> => {
    const otp = crypto.randomInt(100000, 999999);
    console.log(otp);
    await otpModel.create({ email, otp });
    return otp;
  };
}
