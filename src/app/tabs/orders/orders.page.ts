import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { orderStatus, orderType, typeOfRestaurant } from 'src/app/models/enums';
import { Order } from 'src/app/models/order';
import { Store } from 'src/app/models/store';
import { OrderStatusChangePage } from 'src/app/pages/order-status-change/order-status-change.page';

import { LoadingService } from 'src/app/services/loading/loading.service';
import { OrderService } from 'src/app/services/order/order.service';
import { StoreService } from 'src/app/services/store/store.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.page.html',
  styleUrls: ['orders.page.scss']
})
export class OrdersPage {
  store: Store;
  orderTypes = orderType;
  status = orderStatus;

  segments: orderType[];
  currentSegment: orderType;
  currentSegmentStatus: orderStatus[] = [];
  collapsed = {};

  tableOrders: Array<Order>;
  takeAwayOrders: Array<Order>;
  bookingOrders: Array<Order>;
  segmentOrders: Array<Order>;

  constructor(
    private orderService: OrderService, private storeService: StoreService, 
    private userService: UserService, public modalController: ModalController,
    public loadingService: LoadingService
  ) {    
    this.store = this.storeService.getCurrentStore();
    const restaurantType = this.userService.getRestaurantType(this.store);
    this.currentSegment = orderType.Mesa;
    
    switch (restaurantType) {
      case typeOfRestaurant.onlyTa:        
        this.segments = [ orderType.TakeAway ];
        this.currentSegment = orderType.TakeAway;
        break;
      case typeOfRestaurant.onlyTo:        
        this.segments = [ orderType.Mesa ]; break;
      case typeOfRestaurant.allButTa:        
        this.segments = [ orderType.Mesa, orderType.Reserva ]; break;
      case typeOfRestaurant.allButBook:        
        this.segments = [ orderType.Mesa, orderType.TakeAway ]; break;
      default: 
        this.segments = [ orderType.Mesa, orderType.TakeAway, orderType.Reserva ]; break;
    }        
  }

  async ionViewWillEnter() {
    await this.loadingService.present();
    await this.orderService.initOrderListeners(this.store.id, this.segments);

    this.orderService.tableOrdersSubject.subscribe(orders => {
      this.tableOrders = orders.filter(o => {
        return !o.closed;
      });
      this.setOrders();
    });

    this.orderService.takeAwayOrdersSubject.subscribe(orders => {
      this.takeAwayOrders = orders;
      this.setOrders();
    });

    this.orderService.bookingOrdersSubject.subscribe(orders => {
      this.bookingOrders = orders;
      this.setOrders();
    });
    
    this.loadingService.dismiss();
  }
  
  doRefresh() {
    window.location.reload();
  }

  setOrders() {
    switch (this.currentSegment) {
      case orderType.Mesa:
        this.segmentOrders = this.tableOrders; 
        this.currentSegmentStatus = [ orderStatus.Preparando, orderStatus.Servido, orderStatus.Cancelado ];
        break;
      case orderType.TakeAway:
        this.segmentOrders = this.takeAwayOrders; 
        this.currentSegmentStatus = [ orderStatus.Pendiente, orderStatus.Aceptado, orderStatus.Pronto, orderStatus.Cancelado ];
        break;
      case orderType.Reserva:
        this.segmentOrders = this.bookingOrders; 
        this.currentSegmentStatus = [ orderStatus.Preparando, orderStatus.Servido, orderStatus.Cancelado ];
        break;
      default: 
        break;
    }  
  }

  async segmentChanged(segment): Promise<void> {
    await this.loadingService.present();
    this.currentSegment = segment.detail.value;
    this.setOrders();
    this.loadingService.dismiss();
  }

  toggleList(status: orderStatus): void {
    this.collapsed[status] = !this.collapsed[status];
  }

  async showOrder(order: Order) {
    const modal = await this.modalController.create({
      component: OrderStatusChangePage,
      componentProps: {
        orderId: order.id,
        orderType: order.orderType,
        store: this.store
      }
    });
    await modal.present();
  }
}
