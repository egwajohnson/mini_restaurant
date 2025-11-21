import { Response } from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { IRequest } from "../middleware/authMiddleware";
import { MenuItemService } from "../services/menu.item.services";

export class MenuController {
  static createMenu = asyncWrapper(async (req: IRequest, res: Response) => {
    const restaurantId = req.user.id;
    const data = req.body;
    const path = req.file?.originalname;
    if (!path) return null;
    const response = await MenuItemService.createMenu(data, restaurantId, path);
    res.status(200).json({ success: true, payload: response });
  });
  static deletMenu = asyncWrapper(async () => {});
}
