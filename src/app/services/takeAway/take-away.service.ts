import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { GeneralService } from '../API/general/general.service';
import { ErrorLog } from 'src/app/models/errorLog';
import { Order } from 'src/app/models/order';
import { Store } from 'src/app/models/store';

import { CommonCodeService } from '../commonCode/common-code.service';
import { TAKEAWAY_SERV_TIME, TAKEAWAY_CANCEL_GRACE } from 'src/app/services/constants.service';
import { ERROR_CONFIRM_PAYMENT, ERROR_PREPARE_TA } from '../errors.service';
import { LogService } from '../log/log.service';
import { PaymentService } from '../payment/payment.service';
import { SettingService } from '../setting/setting.service';

@Injectable({
  providedIn: 'root'
})
export class TakeAwayService {

  constructor(
    private paymentService: PaymentService, private generalService: GeneralService, 
    private settingService: SettingService, private commonCodeService: CommonCodeService, 
    private logService: LogService
  ) { }

  async canAccept(orderId: string) {
    try {
      await this.paymentService.confirmPayment(orderId);
    } catch(e) {
      const error: ErrorLog = {
        error: JSON.stringify(e),
        extraData: orderId,
        page: "TakeAwayService",
        function: "canAccept PWA123",
        module: "adminPWA"
      }
      this.logService.addError(error);
      this.logService.logErrors(error);
      this.logService.sendErrorViaEmail(error);
      
      throw ERROR_CONFIRM_PAYMENT;
    }
  }

  async canPrepare(order: Order) {
    try {
      const time = await this.generalService.getServerTime();
      const now = moment(time, 'YYYY-MM-DD HH:mm');
      const taTime = moment(order.orderDate, 'YYYY-MM-DD HH:mm');
      if (taTime.diff(now, 'minutes') > TAKEAWAY_SERV_TIME) {
        return Promise.reject(ERROR_PREPARE_TA);
      }

      await this.paymentService.confirmPayment(order.id);
    } catch(e) {
      const error: ErrorLog = {
        error: JSON.stringify(e),
        extraData: JSON.stringify(order),
        page: "TakeAwayService",
        function: "canPrepare PWA124",
        module: "adminPWA"
      }
      this.logService.addError(error);
      this.logService.logErrors(error);
      this.logService.sendErrorViaEmail(error);
      
      throw ERROR_CONFIRM_PAYMENT;
    }
  }

  async refundTA(store: Store, order: Order) {
    const now = await this.generalService.getCalculatedTime();
    const todayDay = this.commonCodeService.getYesterday(now.day());
    
    let startMoment;
    if (store.daysSchedule[todayDay].open24Hours) {
      startMoment = now;
    } else {
      const shift = await this.commonCodeService.checkShift(store, now);
      if (!shift.currentOpen || shift.currentOpen <= now && shift.currentCloses >= now) {
        startMoment = now;
      } else if (shift.currentOpen) {
        startMoment = shift.currentOpen;
      }
    }
    
    const madeAt = moment(order.madeAt, 'YYYY-MM-DD HH:mm');
    const orderDate = moment(order.orderDate, 'YYYY-MM-DD HH:mm')
    if (
      startMoment.diff(madeAt, 'minutes') >= TAKEAWAY_CANCEL_GRACE && 
      orderDate.diff(now, 'minutes') <= this.settingService.getTakeAwayLimit()
    ) {
      return Promise.reject(
        `El TakeAway solo puede ser cancelado antes de ${ TAKEAWAY_CANCEL_GRACE } minutos luego de haber sido creado, 
        y antes de ${ this.settingService.getTakeAwayLimit() } minutos de la hora de retiro.`
      );
    }

    await this.paymentService.refundByOrder(order.id);
  }
}
