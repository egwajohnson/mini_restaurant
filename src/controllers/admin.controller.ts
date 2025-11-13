import { Response } from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { IRequest } from "../middleware/authMiddleware";
import { AdminService } from "../services/admin.services";

export class AdminContoller {
  static createAdmin = asyncWrapper(async (req: IRequest, res: Response) => {
    const admin = req.body;
    const response = await AdminService.createAdmin(admin);
    res.status(200).json({ success: true, payload: response });
  });
}
