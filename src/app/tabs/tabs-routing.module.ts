import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ROUTE_TABS, ROUTE_SCAN_QR, ROUTE_SCAN_QR_PWA, ROUTE_DASHBOARD } from './../services/constants.service';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: ROUTE_DASHBOARD,
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: ROUTE_SCAN_QR,
        loadChildren: () => import('./scanQR/scanQR.module').then(m => m.ScanQRPageModule)
      },
      {
        path: ROUTE_SCAN_QR_PWA,
        loadChildren: () => import('./scanQRPWA/scanQRPWA.module').then(m => m.ScanQRPWAPageModule)
      },
      {
        path: '',
        redirectTo: `/${ROUTE_TABS}/${ROUTE_SCAN_QR}`,
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
