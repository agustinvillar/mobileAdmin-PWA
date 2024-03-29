import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { orderStatus, orderType } from 'src/app/models/enums';

import { ERROR_TRY_AGAIN, ERROR_INVALID_CANCEL_MSG, ORDER_ACCESS_DENIED } from 'src/app/services/errors.service';
import { Order } from 'src/app/models/order';
import { Store } from 'src/app/models/store';

import { LoadingService } from 'src/app/services/loading/loading.service';
import { OrderService } from 'src/app/services/order/order.service';
import { SwalService } from 'src/app/services/swal/swal.service';
import { BookingService } from 'src/app/services/booking/booking.service';
import { TakeAwayService } from 'src/app/services/takeAway/take-away.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-order-status-change',
  templateUrl: './order-status-change.page.html',
  styleUrls: ['./order-status-change.page.scss'],
})
export class OrderStatusChangePage implements OnInit {
  @Input() orderId: string;
  @Input() orderType: orderType;
  @Input() store: Store;
  orderData: { order: Order, actions: orderStatus[] };
  orderTypes = orderType;
  orderStatus = orderStatus;
  total: number = 0;

  constructor(
    public modalController: ModalController, private orderService: OrderService, 
    private bookingService: BookingService, private takeAwayService: TakeAwayService, 
    private userService: UserService, public loadingService: LoadingService, 
    public swalService: SwalService
  ) { }

  async ngOnInit() {
    await this.loadingService.present();

    if (this.userService.checkOrderTypePermission(this.store, this.orderType)) {
      await this.getOrderData();
    } else {
      await this.swalService.showGeneric(ORDER_ACCESS_DENIED, 'error');
      await this.dismiss();
    }

    this.loadingService.dismiss();
  }

  async getOrderData() {
    this.orderData = await this.orderService.getActions(this.orderId, this.store);
    this.total = this.orderData.order.total;
    if (this.orderData.order.extras) { 
      this.orderData.order.extras.forEach(extra => { this.total += Number(extra.price); }); 
    }
  }

  async updateStatus(status: orderStatus, action: orderStatus) {
    try {
      const confirm = await this.swalService.showStatusChangeConfirm(action);
      if (!confirm.isConfirmed) return;

      if (action === orderStatus.Cancelado && !confirm.value) { 
        return this.swalService.showGeneric(ERROR_INVALID_CANCEL_MSG, 'error');
      }
      
      await this.loadingService.present();

      const order: Order = await this.orderService.get(this.orderId);
      await this.checkPreconditions(order, action);

      await this.orderService.updateStatus({ 
        order, 
        originalStatus: status,
        newStatus: action,
        cancelMotive: action === orderStatus.Cancelado ? confirm.value : null
      });
      
      this.swalService.showNotification('¡Estado actualizado!');      
      await this.dismiss();  
      
    } catch (e) {
      if (!e?.errorShown) { this.swalService.showGeneric(ERROR_TRY_AGAIN, 'error'); }
      await this.getOrderData();
    }

    this.loadingService.dismiss();   
  }

  async checkPreconditions(order: Order, action: orderStatus) {
    try {
      if (this.orderType === orderType.Reserva) {
        switch (action) {
          case orderStatus.Servido:
            await this.bookingService.canServe(order); break;
          case orderStatus.Cancelado:
            await this.bookingService.refundBooking(order); break;
          default: break;
        }  
  
      } else if (this.orderType === orderType.TakeAway) {
        switch (action) {
          case orderStatus.Aceptado:
            await this.takeAwayService.canAccept(this.orderId); break;
          case orderStatus.Pronto:
            await this.takeAwayService.canPrepare(order); break;
          case orderStatus.Cancelado:
            await this.takeAwayService.refundTA(this.store, order); break;
          default: break;
        }  
      }

    } catch (e) {
      this.swalService.showGeneric(e, 'error');
      throw { errorShown: true };
    }
  }

  dismiss() {
    return this.modalController.dismiss();
  }

}
