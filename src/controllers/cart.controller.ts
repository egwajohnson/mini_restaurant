import {Cart} from "../interface/menuItem.interface";
import { CartServices } from "../services/cart.services";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { IRequest } from "../middleware/authMiddleware";
import { Request, Response } from "express";
export class cartControllers{
    static createcart= async(req:IRequest,res:Response)=>{}


    static updateCart = asyncWrapper(async (req: IRequest, res: Response) => {
    const data = req.body as Cart;
    const userId = req.user.id;
    const cart = await CartServices.updateCart(data, userId);
    res.status(201).json(cart);
  });
     

}