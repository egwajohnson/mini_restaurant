import { Response } from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { IRequest } from "../middleware/authMiddleware";
import { MenuItemService } from "../services/menu.item.services";

export class MenuController {
  static createMenu = asyncWrapper(async (req: IRequest, res: Response) => {
    const menu = req.body;
    const response = await MenuItemService.createMenu(
      menu,
      req.user.id,
      req.files
    );
    res.status(200).json({ success: true, payload: response });
  });
}
