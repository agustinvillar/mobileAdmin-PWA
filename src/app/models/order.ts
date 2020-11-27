// import { CartItem } from "./cart-item";
// import { Extra } from "./extra";
import * as Enums from './enums';

export class Order {
  id?: string;
  userId?: string;
  total?: number;
  address?: string;
  status?: Enums.orderStatus;
  orderNumber?: string;
  madeAt?: string;
  createdAt?: number;
  orderType?: string;
  updatedAt?: number;
  tableOpeningFamilyId?: string;
  tableOpeningId?: string;
  estimatedTimeTA?: string;
  takeAwayHour?:string;
  alertShowed?: boolean;
  // items?: Array<CartItem>;
  isBooking?: boolean;
  bookingId?:string;
  orderDate?:string;
  orderDateSimple?:string;
  printed?: boolean = false;
  cancelMotive?: string;
  // extras?: Array<Extra>;
  cancelSource?:Enums.cancelSource;
  paymentId?:string;
  userName?:string;
  closed?:boolean;
  timerToCancel?:number;
  guestComment?: string;
  store: {
    id: string,
    name: string,
    logoImage?:string
  };
}
