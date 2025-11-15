import express from "express";
import {IPreRegister, IVerifyUser} from "../interface/user.interface";
import {userModel} from "../models/user.model";
import { otpModel } from "../models/otp.model";
import { Types } from "mongoose";

export class UserRepositories {
    static createUser = async(user: IPreRegister) =>{
        const response = await userModel.create(user);
        if(!response){
            throw new Error("Unable to create user");
        }
        return response;

    }

    static updateUser = async (userId: Types.ObjectId) => {
    const response = await userModel.findByIdAndUpdate(
      userId,
      {
        is_verified: true,
      },
      { new: true }
    );
    if (!response) return null;

    return response;
  };

   static createOtp = async (email: string, otp: string) => {
      const response = await otpModel.create(email, otp);
      if (!response) return null;
      return response;
    };  

    static saveOtp = async(email: string, otp: string) =>{
        const response = await otpModel.findOneAndUpdate(
            {email},
            {$set: {otp}},
            {new: true}
        );
        return response;
    }

     static getOtp = async (email: string) => {
        const res = await otpModel.findOne({ email });
        if (!res) return null;
        return res;
      };  

    static otpVerify = async (email: string, otp: string) => {
    const response = await otpModel.findOneAndDelete({ email, otp });
    if (!response) return null;
    return response;
  };

  static findUserId = async(userId: Types.ObjectId) =>{
    const response = await userModel.findByIdAndDelete(userId);
    return response;
  }

  static findUserByEmail = async(email: string) =>{
    const response = await userModel.findOne({email});
    return response;
  }

}