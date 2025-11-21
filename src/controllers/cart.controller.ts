import {CartServices} from "../services/cart.services";
import { IRequest } from "../middleware/authMiddleware";
import { Request, Response } from "express";
export class cartControllers{
    static createcart= async(req:IRequest,res:Response)=>{
      try {
        const data = req.body;
        const userId = req.user.id;
        const response = await CartServices.createcart(data,userId);
       res.status(201).json({
        success:true,
        payload:response
       });
        
      } catch (error:any) {
        res.status(400).json({
          success:false,
            message:error.message
        });
      }
    }

}