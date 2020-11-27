import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { orderStatus } from 'src/app/models/enums';

import { ERROR_TRY_AGAIN } from 'src/app/services/errors.service';
import { Order } from 'src/app/models/order';
import { Store } from 'src/app/models/store';

import { LoadingService } from 'src/app/services/loading/loading.service';
import { OrderService } from 'src/app/services/order/order.service';
import { SwalService } from 'src/app/services/swal/swal.service';

@Component({
  selector: 'app-order-status-change',
  templateUrl: './order-status-change.page.html',
  styleUrls: ['./order-status-change.page.scss'],
})
export class OrderStatusChangePage implements OnInit {
  @Input() orderId: string;
  @Input() store: Store;
  orderData: { order: Order, actions: orderStatus[] };

  constructor(
    public modalController: ModalController, public orderService: OrderService, 
    public loadingService: LoadingService, public swalService: SwalService
  ) { }

  async ngOnInit() {
    await this.loadingService.present();
    this.orderData = await this.orderService.getActions(this.orderId, this.store);
    this.loadingService.dismiss();
  }

  async updateStatus(action: orderStatus) {
    try {
      const confirm = await this.swalService.showStatusChangeConfirm(action);
      if (!confirm.isConfirmed) return;
  
      await this.loadingService.present();
      await this.dismiss();
      await this.loadingService.dismiss();
      await this.swalService.showNotification('¡Estado actualizado!');
    } catch (e) {
      await this.swalService.showGeneric(ERROR_TRY_AGAIN, 'error');
    }
  }

  dismiss() {
    return this.modalController.dismiss();
  }

}
