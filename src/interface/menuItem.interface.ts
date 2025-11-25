import { Types } from "mongoose";

export interface IMenuItem {
  name: string;
  slug: string;
  description?: string;
  price: number;
  discountPrice?: number;
  category: string;
  isOpen?: boolean;
  images?: string;
  restaurantId?: Types.ObjectId;
  menuId?: Types.ObjectId;
}

export interface Cart {
  productId: string;
  quantity: number;
}
