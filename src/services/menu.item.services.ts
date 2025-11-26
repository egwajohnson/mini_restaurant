import { Types } from "mongoose";
import { IMenuItem } from "../interface/menuItem.interface";
import {
  editValidate,
  menuItem,
  slugValidate,
} from "../validation/menu.validate";
import { throwCustomError } from "../middleware/errorHandler";
import { MenuItemRepo } from "../repository/menu.item.repository";
import { restaurantModel } from "../models/restaurant.model";
import { menuItemModel } from "../models/menu.item.model";
import { uploadModel } from "../models/upload.model";
import path from "path";

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
    //create new Menu
    const response = await MenuItemRepo.createMenu({
      ...data,
      slug,
      restaurantId: isRestaurant._id,
      images: path,
    });
    if (!response) {
      throw throwCustomError("Menu not created", 500);
    }
    if (path) {
      const menuExist = await menuItemModel.findOne({ slug }).lean().populate({
        path: "restaurantId",
        //model: "Restaurant",
      }).exec();
      console.log("menu exist", menuExist);

      const domain = `http://localhost:3000/uploads/${path}`;

      const res = await MenuItemRepo.picture({
        restaurantId: isRestaurant._id,
        menuId: menuExist?._id,
        filePath: domain,
      });
    }
    return "New Menu Added";
  };

  static editMenu = async (
    restaurantId: Types.ObjectId,
    menuId: string,
    update: any
  ) => {
    const { error } = editValidate.validate(update);
    const isMenuExist = await menuItemModel.findById(menuId);
    // console.log(isMenuExist);
    if (error) throw throwCustomError(error.message, 400);
    const restaurant = await restaurantModel
      .findOne({ userId: restaurantId })
      .populate({
        path: "userId",
        model: "User",
      });
    // console.log("restaurant id is", restaurant?._id);

    const isMenu = await menuItemModel
      .findOne({ slug: isMenuExist?.slug })
      .lean()
      .populate({
        path: "restaurantId",
        model: "Restaurant",
      });
    // console.log(restaurantId);
    // console.log(menuId);
    // console.log("isMenu restau id is", (isMenu?.restaurantId as any)._id);
    if (!restaurant?._id.equals((isMenu?.restaurantId as any)._id)) {
      throw throwCustomError("Invalid", 422);
      // console.log(
      //   "anser is",
      //   !restaurant?._id.equals((isMenu?.restaurantId as any)._id)
      // );
    }
    const slug = update?.name.toLowerCase().trim().replace(/\s+/g, "-");
    if (update.price <= 0)
      throw throwCustomError("Price should be greater than 0 ", 400);
    // console.log(isMenu);

    const response = await menuItemModel.findOneAndUpdate(
      { _id: menuId },
      { ...update, slug },
      {
        new: true,
      }
    );
    // console.log(response);
    if (!response) throw throwCustomError("Unable to save Changes", 400);
    return "Changes Saved";
  };

  static viewMenu = async (restaurantId: Types.ObjectId) => {
    const restaurant = await restaurantModel
      .findOne({ userId: restaurantId })
      .populate({
        path: "userId",
        model: "User",
      });
    const menu = await menuItemModel.find({ restaurantId: restaurant?._id });
    if (!menu) throw throwCustomError("No Menu Available", 400);
    return menu;
  };

  static deleteMenu = async (restaurantId: Types.ObjectId, slug: string) => {
    const { error } = slugValidate.validate({ slug });
    if (error) throw throwCustomError(error.message, 400);
    const restaurant = await restaurantModel
      .findOne({ userId: restaurantId })
      .populate({
        path: "userId",
        model: "User",
      });
    const findSLug = await MenuItemRepo.findMenuBySlug(slug);
    if (!findSLug) throw throwCustomError("No Slug Found", 400);
    if (!restaurant?._id.equals((findSLug.restaurantId as any)._id)) {
      throw throwCustomError("Unable to perform request", 422);
    }
    if (slug) {
      const deleteImage = await uploadModel
        .findOneAndDelete({ menuId: findSLug })
        .populate({
          path: "menuId",
          model: "Menu_Item",
        });
      if (!deleteImage) throw throwCustomError("unable to delete image", 400);
      const slugExist = await menuItemModel
        .findOneAndDelete({ slug })
        .lean()
        .populate({
          path: "restaurantId",
          model: "Restaurant",
        });
      if (!slugExist) {
        throw throwCustomError("No slug found", 500);
      }
      if (!slug) throw throwCustomError("Unable to delete Menu", 400);
    }
    return "Menu has been Deleted";
  };
}
