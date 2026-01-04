import mongoose from "mongoose";
import { dburl } from "./system.variable";
import { AdminService } from "../services/admin.services";

export const mongoConnection = async () => {
  try {
    await mongoose.connect(`${dburl}`);
    console.log("database connected");
    AdminService.superAdmin();
  } catch (error) {
    console.log("database disconnected");
  }
};
