import {Cart} from "../interface/menuItem.interface";
import { CartServices } from "../services/cart.services";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { IRequest } from "../middleware/authMiddleware";
import { Request, Response } from "express";
export class cartControllers{
    static createcart= asyncWrapper(async(req:IRequest,res:Response)=>{
    const ownerId = req.user.id;
    //const data = req.body as Cart;
    const cart = await CartServices.createcart(ownerId);
    res.status(201).json(cart);
    });

    static updateCart = asyncWrapper(async (req: IRequest, res: Response) => {
    const data = req.body as Cart;
    const ownerId = req.user.id;
    const cart = await CartServices.updateCart(data, ownerId);
    res.status(201).json(cart);
  });

  static getCart = asyncWrapper(async (req: IRequest, res: Response) => {
    const ownerId = req.user.id;
    const cart = await CartServices.getCarts(ownerId);
    res.status(200).json(cart);
  });
     

}