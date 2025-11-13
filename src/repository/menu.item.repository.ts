import { IMenuItem } from "../interface/menuItem.interface";
import { menuItemModel } from "../models/menu.item.model";

export class MenuItemRepo {
  static createMenu = async (menu: IMenuItem) => {
    const res = await menuItemModel.create(menu);
    if (!res) return null;
    return res;
  };

  static findMenuBySlug = async (slug: string) => {
    const response = await menuItemModel.findOne({ slug }).lean();
    if (!response) return null;
    return response;
  };
}
