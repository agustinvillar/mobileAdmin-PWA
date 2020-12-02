import { Component } from '@angular/core';
import { orderStatus, orderType } from 'src/app/models/enums';

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.page.html',
  styleUrls: ['orders.page.scss']
})
export class OrdersPage {
  segments = orderType;
  status = orderStatus;
  currentSegment: orderType = orderType.Mesa;
  collapsed = {};

  constructor() {}
  
  doRefresh() {
    window.location.reload();
  }

  segmentChanged(segment): void {
    this.currentSegment = segment.detail.value;
  }

  toggleList(status: orderStatus): void {
    this.collapsed[status] = !this.collapsed[status];
  }
}
