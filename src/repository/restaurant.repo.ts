import { IRestaurant } from "../interface/restaurant.interface";
import { restaurantModel } from "../models/restaurant.model";

export class RestaurantRepo {
  static async createrRestaurant(restaurant: IRestaurant) {
    const response = await restaurantModel.create({
      userId: restaurant._id,
    });
    if (!response) return null;
    return response;
  }
}
