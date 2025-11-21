import { UserServices } from "../services/user.service";
import { IRequest } from "../middleware/authMiddleware";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { Request, Response } from "express";

export class AuthControllers {
  static preRegister = async (req: IRequest, res: Response) => {
    try {
      const user = req.body;
      const response = await UserServices.preRister(user);
      res.status(201).json({
        success: true,
        payload: response,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  static register = asyncWrapper(async (req: IRequest, res: Response) => {
    const user = req.body;
    const response = await UserServices.register(user);
    res.status(200).json({
      success: true,
      payload: response,
    });
  });

  static updateUser = asyncWrapper(async (req: IRequest, res: Response) => {
    try {
      const { userId, ...updateData } = req.body;
      console.log(userId);
      const response = await UserServices.updateUser(userId, updateData);
      res.status(201).json({
        success: true,
        payload: response,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, messages: error.detail });
    }
  });

  static requestNewOtp = asyncWrapper(async (req: IRequest, res: Response) => {
    const { email } = req.body;
    const response = await UserServices.requestNewOtp(email);
    res.status(200).json({
      success: true,
      payload: response,
    });
  });

  static resetpassword = asyncWrapper(async (req: IRequest, res: Response) => {
    const { email, otp, newPassword } = req.body;
    const response = await UserServices.resetpassword(email, otp, newPassword);
    res.status(200).json({
      success: true,
      payload: response,
    });
  });

  static login = asyncWrapper(async (req: IRequest, res: Response) => {
    try {
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
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  });
}
