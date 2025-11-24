import { Response } from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { IRequest } from "../middleware/authMiddleware";
import { RestaurantServices } from "../services/restaurant.services";
import { Types } from "mongoose";

export class RestaurantController {
  static kyc = asyncWrapper(async (req: IRequest, res: Response) => {
    const userId = req.user.id;
    const { bvn } = req.body;
    const response = await RestaurantServices.kyc(userId, bvn);
    res.status(201).json({
      success: true,
      payload: response,
    });
  });
  static updateRestaurant = asyncWrapper(
    async (req: IRequest, res: Response) => {
      const userId = req.user.id;
      const { update } = req.body;
      const response = await RestaurantServices.updateRestaurant(
        userId,
        update
      );
      res.status(201).json({ Success: true, payload: response });
    }
  );
  static flagRestaurant = asyncWrapper(async (req: IRequest, res: Response) => {
    const email = req.body;
    const response = await RestaurantServices.flagRestaurant(email);
    res.status(201).json({ success: true, payload: response });
  });
  static toggleRestaurant = asyncWrapper(
    async (req: IRequest, res: Response) => {
      const restaurantId = req.params.restaurantId;
      const response = await RestaurantServices.toggleRestaurantStatus(
        new Types.ObjectId(restaurantId)
      );
      res.status(201).json({ success: true, payload: response });
    }
  );
}
