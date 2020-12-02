export class DaySchedule {
  name: string;
  open?: boolean;
  open24Hours?: boolean;
  firstOpen?: string;
  firstCloses?: string;
  secondShift?: boolean;
  secondOpen?: string;
  secondCloses?: string;
  bookingMinTime?:string;
  bookingMaxTime?:string;
  disableBookings?:boolean;
  bookingGuestQty?:number;

  constructor() { }
}
