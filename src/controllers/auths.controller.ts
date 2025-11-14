import {UserServices} from "../services/user.service";
import { IRequest } from "../middleware/authMiddleware";
import {asyncWrapper} from "../middleware/asyncWrapper";
import { Request, Response } from "express";

export class AuthControllers {
    static preRegister =async (req: IRequest, res:Response) => {
        try {
            const user = req.body;
            const response = await UserServices.preRister(user);
            res.status(201).json({
                success: true, 
                payload: response
            })
        } catch (error:any) {
            res.status(400).json({
                success : false,
                message: error.message
            })
             
        }

    }

    static register = asyncWrapper(async(req: IRequest, res:Response) =>{
        const user = req.body;
        const response = await UserServices.register(user);
        res.status(200).json({
            success: true,
            payload: response
        })
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