import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { ErrorLog } from 'src/app/models/errorLog';
import { Order } from 'src/app/models/order';
import { GeneralService } from '../API/general/general.service';

import { TAKEAWAY_SERV_TIME } from 'src/app/services/constants.service';
import { ERROR_CONFIRM_PAYMENT, ERROR_PREPARE_TA } from '../errors.service';
import { LogService } from '../log/log.service';
import { PaymentService } from '../payment/payment.service';

@Injectable({
  providedIn: 'root'
})
export class TakeAwayService {

  constructor(
    private paymentService: PaymentService, private generalService: GeneralService, 
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
}
