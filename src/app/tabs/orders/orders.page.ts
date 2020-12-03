import { Component } from '@angular/core';
import { orderStatus, orderType, typeOfRestaurant } from 'src/app/models/enums';

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.page.html',
  styleUrls: ['orders.page.scss']
})
export class OrdersPage {
  orderTypes = orderType;
  status = orderStatus;

  currentSegment: orderType;
  segments: orderType[];
  typeOfRestaurant: typeOfRestaurant;
  collapsed = {};

  constructor() {          
    this.currentSegment = orderType.Mesa;

    switch (this.typeOfRestaurant) {
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
