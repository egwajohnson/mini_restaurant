
import {UserRepositories} from "../repository/auth.repository"
import {IPreRegister, IVerifyUser} from "../interface/user.interface";
import {preRegValidate,userValidate,loginValidate } from "../validation/user.validate";
import {throwCustomError} from "../middleware/errorHandler";
import bcrypt from "bcrypt";
import { otpModel } from "../models/otp.model";
import crypto from "crypto";

export class UserServices {
    static preRister = async(user: IPreRegister) =>{
        if(!user){
            throw new Error("Invalid user data");
        }
        const {error} = preRegValidate.validate(user);
        if(error){
            throw throwCustomError(error.details[0].message, 400 );
        }
        const hashedPassword = await bcrypt.hash(user.password, 5);
      if(!hashedPassword) throw throwCustomError("Password hashing failed", 400);
        const response = await UserRepositories.createUser({...user, password: hashedPassword});
        return response;
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