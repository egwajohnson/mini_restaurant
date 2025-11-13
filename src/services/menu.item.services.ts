import { Types } from "mongoose";
import { IMenuItem } from "../interface/menuItem.interface";
import { menuItem } from "../validation/menu.validate";
import { throwCustomError } from "../middleware/errorHandler";
import { MenuItemRepo } from "../repository/menu.item.repository";

export class MenuItemService {
  static createMenu = async (
    menu: IMenuItem,
    restaurantId: Types.ObjectId,
    files: any
  ) => {
    console.log("menu is", menu);
    const { error } = menuItem.validate(menu);
    if (error) {
      throw throwCustomError(error.message, 422);
    }
    if (files.length === 0) throw throwCustomError("images are required", 422);
    let images = files.map((item: any) => `http://localhost:8080/${item.path}`);

    if (menu.price <= 0)
      throw throwCustomError("Price should be greater than 0 ", 400);

    const slug = menu.name.toLowerCase().trim().replace(/\s+/g, "-");

    //check menu existence
    const isMenu = await MenuItemRepo.findMenuBySlug(slug);
    if (isMenu) throw throwCustomError("Menu-Item Exist", 409);

    //create new Menu
    const response = await MenuItemRepo.createMenu({
      ...menu,
      restaurantId,
      slug,
      images,
    });
    if (!response) {
      throw throwCustomError("Menu not created", 500);
    }
    return "Menu Created";
  };
}
