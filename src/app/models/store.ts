
// import { Table } from "./table";
// import { CategoryStore } from "./categoryStore";
// import { StoreFeedback } from "./storeFeedback";
// import { CustomDate } from "./customDate";
// import { TableOpeningFamily } from "./tableOpeningFamily";
// import { Promotions } from "./promotions";
// import { Market } from "./market";
// import { OfferCupon } from "./offerCupon";

import { DaySchedule } from './day-schedule';
import { Extra } from './extra';

export enum PAYMENT_PROVIDER {
  NONE = 0, MERCADO_PAGO = 1, GEOPAY = 2
}

export class Store {
  id?: string;
  address: string;
  allowNotifications?:boolean;
  allowPrinting?: boolean;
  printer?: string;
  availability?:boolean;
  bookingGuestQty?:number;
  maxUsQty?: number;
  cardDiscounts?:any;
  // categoryStore?: Array<CategoryStore>;
  closes?: string;
  comissionPercentage?: number;
  commentNumber?: number;
  costPerPerson?: number;
  costPerPersonSign?: string;
  culteryPrice?:number;
  artisticCutlery?:number;
  // customDates?:Array<CustomDate>;
  cutlery?: boolean;
  artisticCutleryFlag?:boolean;
  daysSchedule?:Array<DaySchedule>;
  description?:string;
  disableBookings?: boolean;
  distanceFromUser?: number;
  extras?:Array<Extra>;
  feedbackCount?: number;
  hasActivePromotions?: boolean;
  hasAvailability: boolean;
  inProduction?:boolean;
  isCeliac?:boolean;
  isDiabetic?:boolean;
  isEditing?:boolean;
  isFav?:boolean;
  isHyperTense?:boolean;
  isResto?:boolean;
  isTakeAway?:boolean;
  itemCount?: number;
  lat: number;
  logoImage?:string;
  long: number;
  moodInPlace?: string;
  name: string;
  neighborhood?: any;
  openTableMargin?: number;
  penaltyFee?: number;
  // pendingFamilies?:Array<TableOpeningFamily>;
  phone?: string;
  photo?: string;
  photos?: string[];
  price?: number;
  printHostNumber?: number;
  // promotions?: Array<Promotions>;
  publicInPlace?: string;
  rating?: number;
  services?: Array<string>;
  softIntegrated?: boolean;
  softName?: string;
  softId?: string;
  softFeeId?: string;
  softCutleryId?: string;
  speciality?: string;
  stay?: number;
  // storeFeedbacks?: Array<StoreFeedback>;
  // tables?: Array<Table>;
  takeAwayBeforeClose?: number;
  takeAwayMargin?: number;
  updatedAt?: number;
  merchantId? : string;
  paymentProvider? : PAYMENT_PROVIDER;
  isMarket?:boolean;
  // market?:Market;
  takeAwayQR?:string;
  takeAwayCode?:string;
  IMMAuthorization?: string;
  class?: string;
  // offerCupons?: Array<OfferCupon>;

  constructor() { }
}
