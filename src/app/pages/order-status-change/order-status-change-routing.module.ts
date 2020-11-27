import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderStatusChangePage } from './order-status-change.page';

const routes: Routes = [
  {
    path: '',
    component: OrderStatusChangePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderStatusChangePageRoutingModule {}
