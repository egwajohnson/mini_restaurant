import mongoose, { Types } from "mongoose";

const uploadSchema = new mongoose.Schema({
  restaurantId: {
    type: Types.ObjectId,
    require: true,
    ref: "Restaurant",
  },
  filePath: {
    type: String,
    require: true,
  },
  uploadedAt: { type: Date, default: Date.now() },
});

export const uploadModel = mongoose.model("Uploads", uploadSchema);
