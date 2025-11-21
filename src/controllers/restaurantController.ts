import { Response } from "express";
import { asyncWrapper } from "../middleware/asyncWrapper";
import { IRequest } from "../middleware/authMiddleware";
import { RestaurantServices } from "../services/restaurant.services";

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
}
