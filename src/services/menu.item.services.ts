import { Types } from "mongoose";
import { IMenuItem } from "../interface/menuItem.interface";
import { menuItem } from "../validation/menu.validate";
import { throwCustomError } from "../middleware/errorHandler";
import { MenuItemRepo } from "../repository/menu.item.repository";
import { any } from "joi";
import { restaurantModel } from "../models/restaurant.model";
import { menuItemModel } from "../models/menu.item.model";
import { uploadModel } from "../models/upload.model";

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

    const isRestaurant = await restaurantModel
      .findOne({ userId: restaurantId })
      .populate({
        path: "userId",
        model: "User",
      });
    if (!isRestaurant) throw throwCustomError("No Resaturant found", 400);
    if (
      isRestaurant?.adminStatus === "restricted" ||
      isRestaurant?.adminStatus === "flagged"
    ) {
      throw throwCustomError(
        "You are not authorized to create a Menu. Kindly reach out to the admin",
        400
      );
    }
    if (data.price <= 0)
      throw throwCustomError("Price should be greater than 0 ", 400);

    const slug = data.name.toLowerCase().trim().replace(/\s+/g, "-");
    //check menu existence
    const isMenu = await MenuItemRepo.findMenuBySlug(slug);
    if (isMenu) throw throwCustomError("Menu-Item Exist", 409);

    if (path) {
      const domain = `http://localhost:8080/uploads/${path}`;
      const res = await MenuItemRepo.picture({
        restaurantId: isRestaurant.id,
        filePath: domain,
      });
    }

    //create new Menu
    const response = await MenuItemRepo.createMenu({
      ...data,
      slug,
      restaurantId: isRestaurant.id,
      images: path,
    });

    if (!response) {
      throw throwCustomError("Menu not created", 500);
    }

    return "New Menu Added";
  };
}
