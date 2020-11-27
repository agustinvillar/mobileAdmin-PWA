import { ItemVariableDetail } from "./itemVariableDetail";
import { CategoryPromotions } from "./categoryPromotions";

export class CartItem {
  id?: string;
  name: string;
  price: number;
  categoryId?: string;
  storeId?: string;
  quantity: number;
  thumbnail?: string;
  itemIsTA?: boolean;
  options: Array<ItemVariableDetail>;
  priceTA?: number;
  priceWithDiscount?: number;
  priceWithDiscountTA?: number;
  subTotal: number;
  total:number;
  promotions?: CategoryPromotions;
  softId?: string;
  guestComment?: string;
  isExtra?: boolean;

  constructor() { }
}
