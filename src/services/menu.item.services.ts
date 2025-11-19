import { Types } from "mongoose";
import { IMenuItem } from "../interface/menuItem.interface";
import { menuItem } from "../validation/menu.validate";
import { throwCustomError } from "../middleware/errorHandler";
import { MenuItemRepo } from "../repository/menu.item.repository";
import { any } from "joi";
import { restaurantModel } from "../models/restaurant.model";

export class MenuItemService {
  static createMenu = async (
    data: IMenuItem,
    restaurantId: Types.ObjectId,
    path: any
  ) => {
    const { error } = menuItem.validate(data);
    if (error) {
      throw throwCustomError(error.message, 422);
    }

    if (data.price <= 0)
      throw throwCustomError("Price should be greater than 0 ", 400);

    const slug = data.name.toLowerCase().trim().replace(/\s+/g, "-");
    console.log("slug", slug);
    const restaurant = await restaurantModel.findOne(data.restaurantId);
    //check menu existence
    const isMenu = await MenuItemRepo.findMenuBySlug(slug);
    if (isMenu) throw throwCustomError("Menu-Item Exist", 409);
    if (path) {
      const domain = `http://localhost:8080/uploads/${path}`;
      const res = await MenuItemRepo.picture({
        restaurantId: restaurantId._id,
        filePath: domain,
      });
      if (!res) throw throwCustomError("Unable to upload images", 400);
    }
    //create new Menu
    const response = await MenuItemRepo.createMenu({
      ...data,
      slug,
      restaurantId,
      images: (data.images = path),
    });

    if (!response) {
      throw throwCustomError("Menu not created", 500);
    }

    return "New Menu Added";
  };
}
