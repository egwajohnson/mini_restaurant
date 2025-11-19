import { Types } from "mongoose";

export interface IUpload {
  restaurantId: Types.ObjectId;
  filePath?: string;
}
