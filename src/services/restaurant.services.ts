import { Types } from "mongoose";
import { throwCustomError } from "../middleware/errorHandler";
import { kycValid, restaurantValid } from "../validation/restaurant.validate";
import { kycRecords } from "../utils/kyc-records";
import { restaurantModel } from "../models/restaurant.model";
import { userModel } from "../models/user.model";

export class RestaurantServices {
  static kyc = async (userId: Types.ObjectId, bvn: string) => {
    const { error } = kycValid.validate({ bvn });
    if (error) {
      throw throwCustomError(error.message, 422);
    }
    const user = await userModel.findById(userId);
    if (!user) throw throwCustomError("Invalid account", 500);

    //check if user is already verified
    if (user.is_kyc_verified)
      throw throwCustomError("Kyc already verified", 400);

    //call external api
    const isUser = kycRecords.find((item) => {
      return (
        item.firstName.toLowerCase() === user.firstName?.toLowerCase() &&
        item.lastName.toLowerCase() === user.lastName?.toLowerCase()
      );
    });
    console.log(isUser);
    if (!isUser) throw throwCustomError("Invalid Information", 422);
    //check bvn match
    const isBvn = kycRecords.find((result) => {
      return (
        result.bvn === bvn &&
        result.firstName.toLowerCase() === user.firstName?.toLowerCase() &&
        result.lastName.toLowerCase() === user.lastName?.toLowerCase()
      );
    });
    console.log(isBvn);
    if (!isBvn) throw throwCustomError("Invalid BVN", 422);
    //verify kyc
    const res = await userModel.findByIdAndUpdate(
      userId,
      { bvn, is_kyc_verified: true },
      { new: true }
    );
    if (!res) throw throwCustomError("Unable to verify Kyc", 500);
    return `Your ${res.role} has been verified`;
  };
  static updateRestaurant = async (userId: Types.ObjectId, update: any) => {
    const { error } = restaurantValid.validate(update);
    if (error) throw throwCustomError(error.message, 422);
    //check if user is verified
    const user = await userModel.findById(userId);
    if (!user) throw throwCustomError("No record found", 500);
    if (!user.is_kyc_verified) throw throwCustomError("Complete your KYC", 422);
    //restauran model
    const isRestaurant = await restaurantModel.findOne({ userId }).populate({
      path: "userId",
      model: "User",
    });
    //update
    const response = await restaurantModel.findByIdAndUpdate(
      isRestaurant?._id,
      { $set: update },
      {
        new: true,
      }
    );
    if (!response) throw throwCustomError("unable to save changes", 500);
    return "All Changes Saved";
  };
}
