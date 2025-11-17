import { Response } from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { IRequest } from "../middleware/authMiddleware";
import { AdminService } from "../services/admin.services";
import { IARequest } from "../middleware/adminAuthMiddleware";

export class AdminAuthContoller {
  static createAdmin = asyncWrapper(async (req: IRequest, res: Response) => {
    const admin = req.body;
    const response = await AdminService.createAdmin(admin);
    res.status(200).json({ success: true, payload: response });
  });

  static login = asyncWrapper(async (req: IARequest, res: Response) => {
    const { email, password } = req.body;
    const ipAddress = req.ip as string;
    const userAgent = req.headers["user-agent"] as string;
    const response = await AdminService.adminLogin(
      email,
      password,
      ipAddress,
      userAgent
    );
    res.status(200).json({ success: true, payload: response });
  });

  static upgradeAdmin = asyncWrapper(async (req: IARequest, res: Response) => {
    const { email, role } = req.body;

    const response = await AdminService.upgradeAdmin(email, role);
    res.status(201).json({ Suceess: true, payload: response });
  });

  static deleteAdmin = asyncWrapper(async (req: IARequest, res: Response) => {
    const { email } = req.body;
    const response = await AdminService.deleteAdmin(email);
    res.status(201).json({ Success: true, payload: response });
  });
  static getAdmin = asyncWrapper(async (req: IARequest, res: Response) => {
    const response = await AdminService.getAdmin();
    res.status(201).json({ success: true, payload: response });
  });
}
