import { Types } from "mongoose";

export interface IMenuItem {
  name: string;
  slug: string;
  description?: string;
  price: number;
  discountPrice?: number;
  category: string;
  status?: string;
  images?: string;
  restaurantId?: Types.ObjectId;
  menuId?: Types.ObjectId;
}

export interface Cart {
  id: Types.ObjectId;
  quantity: number;
}
