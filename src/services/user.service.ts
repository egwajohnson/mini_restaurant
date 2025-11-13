import { UserRepositories } from "../repository/user.repository";
import { IPreRegister, IVerifyUser } from "../interface/user.interface";
import {
  preRegValidate,
  userValidate,
  loginValidate,
} from "../validation/user.validate";
import { throwCustomError } from "../middleware/errorHandler";
import bcrypt from "bcrypt";
import { otpModel } from "../models/otp.model";
import { sendMail } from "../utils/nodemailer";
import { otpTemplate } from "../utils/otp-template";
import crypto from "crypto";

export class UserServices {
  static preRister = async (user: IPreRegister) => {
    if (!user) {
      throw new Error("Invalid user data");
    }
    const { error } = preRegValidate.validate(user);
    if (error) {
      throw throwCustomError(error.details[0].message, 400);
    }
    const hashedPassword = await bcrypt.hash(user.password, 5);
    if (!hashedPassword) throw throwCustomError("Password hashing failed", 400);

    const response = await UserRepositories.createUser({
      ...user,
      password: hashedPassword,
      is_verified: false,
    });
    if (!response) {
      throw throwCustomError("User registration failed", 500);
    }

    //generate role  
    if(response.role === 'admin'){
      //assign all permissions
    } 
    if(response.role === 'customer'){
      //assign limited permissions
    }
    if(response.role === 'restaurant'){
      //assign restaurant permissions
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
    
    // check if user exists
    const UserExist = await UserRepositories.findUserByEmail(user.email);
    if (!UserExist) {
      throw throwCustomError("User not found", 404);
    }

     // verify otp
    const isOtpValid = await UserRepositories.otpVerify(user.email, user.otp);
    if (!isOtpValid) {
      throw throwCustomError("Invalid OTP", 400);
    }
    // const response = await UserRepositories.createUser(user);
    // if (!response) {
    //   throw throwCustomError("User registration failed", 500);
    // }

    const updatedUser = await UserRepositories.updateUser(UserExist._id);
    if (!updatedUser) {
      throw throwCustomError("Unable to verify account", 500);
    }

    return "Account is verified, You can now login";
  }

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
