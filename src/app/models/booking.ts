import { Store } from "./store";
import { Order } from "./order";

export class Bookings {
  id?: string;
  userId: string;
  userEmail?: string;
  guestQuantity: number;
  bookingDate: string;
  bookingHour: string;
  bookingObservations?:string
  bookingNumber?: string;
  bookingState?: string;
  createdAt?: string;
  updatedAt?: number;
  cancellationDate?: string;
  stayConfirmed?: boolean;
  userPhone?: string;
  userName?: string;
  manualBooking?: boolean;
  printed?: boolean;
  store: Store;
  orders: Order[];
}
