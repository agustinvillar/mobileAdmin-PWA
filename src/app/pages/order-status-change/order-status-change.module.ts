import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderStatusChangePageRoutingModule } from './order-status-change-routing.module';

import { OrderStatusChangePage } from './order-status-change.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderStatusChangePageRoutingModule
  ],
  declarations: [OrderStatusChangePage]
})
export class OrderStatusChangePageModule {}
