import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as moment from 'moment';

import { Bookings } from 'src/app/models/booking';
import { Order } from 'src/app/models/order';

import { ErrorLog } from 'src/app/models/errorLog';

import { BOOKING_ORDER_SERVE_LIMIT } from 'src/app/services/constants.service';
import { ERROR_REFUND, ERROR_TRY_AGAIN } from 'src/app/services/errors.service';
import { GeneralService } from 'src/app/services/API/general/general.service';
import { PaymentService } from 'src/app/services/payment/payment.service';
import { SettingService } from 'src/app/services/setting/setting.service';
import { LogService } from 'src/app/services/log/log.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(
    private afs: AngularFirestore, private settingsService: SettingService,
    private generalService: GeneralService, private paymentService: PaymentService,
    private logService: LogService
  ) { }

  async getBookingById(bookingId: string) {
    const doc = await this.afs.collection<Bookings>('bookings').doc(bookingId).ref.get();
    let booking = doc.data() as Bookings;
    booking.id = doc.id;
    return booking;
  }

  async refundBooking(order: Order) {
    try {
      const booking: Bookings = await this.getBookingById(order.bookingId);
      const dif = await this.getBookingMinutes(booking);
      const cancelLimit = this.settingsService.getBookingCancelLimit();
  
      if (dif <= Number(cancelLimit)) {
        return Promise.reject(
          `Solo se puede cancelar la orden de una reserva hasta ${ cancelLimit } minutos antes de la misma.`
        );
      }
      return this.paymentService.refundByOrder(order.id);

    } catch(e) {
      const error: ErrorLog = {
        error: JSON.stringify(e),
        extraData: JSON.stringify(order),
        page: "BookingService",
        function: "refundBooking PWA234",
        module: "adminPWA"
      }
      this.logService.addError(error);
      this.logService.logErrors(error);
      this.logService.sendErrorViaEmail(error);
      
      throw ERROR_REFUND;
    }
  }

  async canServe(order: Order) {
    try {
      const booking: Bookings = await this.getBookingById(order.bookingId);
      const dif = await this.getBookingMinutes(booking);
      if (dif > BOOKING_ORDER_SERVE_LIMIT) {
        return Promise.reject(
          `No puede servir la orden de una reserva hasta ${ BOOKING_ORDER_SERVE_LIMIT } minutos antes de la misma`
        );
      }
    
    } catch(e) {
      const error: ErrorLog = {
        error: JSON.stringify(e),
        extraData: JSON.stringify(order),
        page: "BookingService",
        function: "canServe PWA235",
        module: "adminPWA"
      }
      this.logService.addError(error);
      this.logService.logErrors(error);
      this.logService.sendErrorViaEmail(error);
      
      throw ERROR_TRY_AGAIN;
    }
  }

  async getBookingMinutes(booking: Bookings): Promise<number> {    
    const serverTime = await this.generalService.getServerTime();
    const timenow = moment(serverTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    const a = moment(booking.bookingDate, 'YYYY-MM-DD').format('YYYY-MM-DD') + ' ' + moment(booking.bookingHour, 'HH:mm:ss').format('HH:mm:ss');
    const ahour = moment(a, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');

    return moment(ahour).diff(timenow, 'minutes');
  }
}
