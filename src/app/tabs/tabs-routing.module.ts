import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ROUTE_TABS, ROUTE_SCAN_QR_PWA, ROUTE_ORDERS } from './../services/constants.service';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: ROUTE_ORDERS,
        loadChildren: () => import('./orders/orders.module').then(m => m.OrdersPageModule)
      },
      {
        path: ROUTE_SCAN_QR_PWA,
        loadChildren: () => import('./scanQRPWA/scanQRPWA.module').then(m => m.ScanQRPWAPageModule)
      },
      {
        path: '',
        redirectTo: `/${ROUTE_TABS}/${ROUTE_SCAN_QR_PWA}`,
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
