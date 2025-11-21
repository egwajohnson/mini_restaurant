import { IMenuItem } from "../interface/menuItem.interface";
import { Types } from "mongoose";
import { IUpload } from "../interface/upload.interface";
import { menuItemModel } from "../models/menu.item.model";
import { uploadModel } from "../models/upload.model";

export class MenuItemRepo {
  static createMenu = async (data: IMenuItem) => {
    const response = await menuItemModel.create(data);
    if (!response) return null;
    return response;
  };

  static findMenuBySlug = async (slug: string, restaurantId: Types.ObjectId) => {
    const response = await menuItemModel.findOne({ slug, restaurantId }).lean();
    if (!response) return null;
    return response;
  };
  static picture = async (upload: IUpload): Promise<any> => {
    const response = await uploadModel.create({
      restaurantId: upload.restaurantId,
      filePath: upload.filePath,
    });
    if (!response) return null;
    return response;
  };
}
