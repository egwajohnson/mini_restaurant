import { Response } from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { IRequest } from "../middleware/authMiddleware";
import { UserServices } from "../services/user.services";

export class AuthContoller {
  static preReg = asyncWrapper(async (req: IRequest, res: Response) => {
    const user = req.body;
    const response = await UserServices.preRegister(user);
    res.status(200).json({ success: true, payload: response });
  });
  static register = asyncWrapper(async (req: IRequest, res: Response) => {
    const data = req.body;
    const response = await UserServices.register(data);
    res.status(200).json({ success: true, payload: response });
  });

  static login = asyncWrapper(async (req: IRequest, res: Response) => {
    const { email, password } = req.body;
    const ipAddress = req.ip as string;
    const userAgent = req.headers["user-agent"] as string;
    const response = await UserServices.login(
      email,
      password,
      ipAddress,
      userAgent
    );
    res.status(200).json({ success: true, payload: response });
  });
}
