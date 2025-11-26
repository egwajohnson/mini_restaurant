import { Cart } from "../interface/menuItem.interface";
import { CartServices } from "../services/cart.services";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { IRequest } from "../middleware/authMiddleware";
import { Request, Response } from "express";
export class cartControllers {
  static createcart = asyncWrapper(async (req: IRequest, res: Response) => {
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

  // create order
  static createOrder = asyncWrapper(async (req: IRequest, res: Response) => {
    const { cartId, street, city, state } = req.body;
    const userId = req.user.id;
    const order = await CartServices.createorder(cartId, userId, {
      street,
      city,
      state,
    });
    res.status(201).json(order);
  });

  static getOrder = asyncWrapper(async (req: IRequest, res: Response) => {
    const { orderId } = req.params;
    const order = await CartServices.getOrder(orderId as any);
    res.status(201).json({ order });
  });

  static updateOrder = asyncWrapper(async (req: Request, res: Response) => {
    try {
      const orderId = req.params.orderId;
      const { menuitemId, quantity } = req.body;
      console.log("Order ID:", orderId);

      const updatedOrder = await CartServices.updateOrder(
        orderId as any,
        menuitemId,
        quantity
      );
      console.log("Updated Order:", updatedOrder);
      res.status(200).json({
        message: "Order updated successfully",
        data: updatedOrder,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });
}
