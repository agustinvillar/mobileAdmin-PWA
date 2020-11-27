import { CartItem } from "./cart-item";
import { cancelSource, orderStatus } from './enums';
import { Extra } from "./extra";

export class Order {
  id?: string;
  userId?: string;
  userName?:string;
  userPhone?: string;
  total?: number;
  address?: string;
  status?: orderStatus;
  orderNumber?: string;
  madeAt?: string;
  orderType?: string;
  createdAt?: number;
  updatedAt?: number;
  tableOpeningFamilyId?: string;
  tableOpeningId?: string;
  estimatedTimeTA?: string;
  takeAwayHour?:string;
  alertShowed?: boolean;
  items?: Array<CartItem>;
  isBooking?: boolean;
  bookingId?:string;
  orderDate?:string;
  orderDateSimple?:string;
  printed?: boolean = false;
  cancelMotive?: string;
  extras?: Array<Extra>;
  cancelSource?: cancelSource;
  paymentId?:string;
  closed?:boolean;
  timerToCancel?:number;
  guestComment?: string;
  store: {
    id: string,
    name: string,
    logoImage?:string
  };
  paidBy?: string;

  constructor() { }
}
