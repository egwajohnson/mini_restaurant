import express from "express";
import {IPreRegister, IVerifyUser} from "../interface/user.interface";
import {userModel} from "../models/user.model";
import { otpModel } from "../models/otp.model";

export class UserRepositories {
    static createUser = async(user: IPreRegister) =>{
        const response = await userModel.create(user);
        if(!response){
            throw new Error("Unable to create user");
        }
        return response;

    }

    static saveOtp = async(email: string, otp: string) =>{
        const response = await otpModel.findOneAndUpdate(
            {email},
            {$set: {otp}},
            {new: true}
        );
        return response;
    }

}