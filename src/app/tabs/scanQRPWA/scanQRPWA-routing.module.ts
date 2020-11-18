import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScanQRPWAPage } from './scanQRPWA.page';

const routes: Routes = [
  {
    path: '',
    component: ScanQRPWAPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScanQRPWAPageRoutingModule {}
