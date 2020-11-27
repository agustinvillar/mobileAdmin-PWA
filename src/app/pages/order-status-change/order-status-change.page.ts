import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { orderStatus } from 'src/app/models/enums';

import { Order } from 'src/app/models/order';
import { Store } from 'src/app/models/store';

import { LoadingService } from 'src/app/services/loading/loading.service';
import { OrderService } from 'src/app/services/order/order.service';

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
    public loadingService: LoadingService
  ) { }

  async ngOnInit() {
    await this.loadingService.present();
    this.orderData = await this.orderService.getActions(this.orderId, this.store);
    this.loadingService.dismiss();
  }

  updateStatus(action: orderStatus) {
    
  }

  dismiss() {
    this.modalController.dismiss();
  }

}
