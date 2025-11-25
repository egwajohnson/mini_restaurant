import { Types } from "mongoose";

export interface IUpload {
  restaurantId?: Types.ObjectId;
  menuId?: Types.ObjectId;
  filePath?: string;
}
