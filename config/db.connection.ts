import mongoose from "mongoose";
import {dburl} from "../config/system.variable";

export const mongoConnection = async () => {
  try {
    await mongoose.connect(`${dburl}`);
    console.log("database connected");
  } catch (error) {
    console.log("database disconnected");
  }
};
