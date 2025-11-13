import {UserServices} from "../services/user.service";
import { IRequest } from "../middleware/authMiddleware";
import {asyncWrapper} from "../middleware/asyncWrapper";
import { Request, Response } from "express";

export class AuthControllers {
    static preRegister =async (req: Request, res:Response) => {
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
    
}