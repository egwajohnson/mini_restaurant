import { Response } from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { IRequest } from "../middleware/authMiddleware";
import { MenuItemService } from "../services/menu.item.services";
import { throwCustomError } from "../middleware/errorHandler";

export class MenuController {
  static createMenu = asyncWrapper(async (req: IRequest, res: Response) => {
    const restaurantId = req.user.id;
    const data = req.body;
    const path = req.file?.originalname;
    if (!path) {
      throw throwCustomError("Menu image is required", 400);
    }
    const response = await MenuItemService.createMenu(data, restaurantId, path);
    res.status(200).json({ success: true, payload: response });
  });
  static editMenu = asyncWrapper(async (req: IRequest, res: Response) => {
    const restaurantId = req.user.id;
    const { menuId, update } = req.body;
    const response = await MenuItemService.editMenu(
      restaurantId,
      menuId,
      update
    );
    res.status(201).json({ statust: true, payload: response });
  });
  static toggleMenuStatus = asyncWrapper(
    async (req: IRequest, res: Response) => {
      const restaurantId = req.user.id;
      const { menuId } = req.body;
      const response = await MenuItemService.toggleMenuStatus(
        restaurantId,
        menuId
      );
      res.status(201).json({ success: true, payload: response });
    }
  );
  static viewMenu = asyncWrapper(async (req: IRequest, res: Response) => {
    const restaurantId = req.user.id;
    const response = await MenuItemService.viewMenu(restaurantId);
    res.status(201).json({ success: true, payload: response });
  });

  static menus = asyncWrapper(async (req: IRequest, res: Response) => {
    const response = await MenuItemService.menus();
    res.status(201).json({ success: true, payload: response });
  });

  static deleteMenu = asyncWrapper(async (req: IRequest, res: Response) => {
    const restaurantId = req.user.id;
    const { slug } = req.body;
    const response = await MenuItemService.deleteMenu(restaurantId, slug);
    res.status(201).json({ success: true, payload: response });
  });
}
