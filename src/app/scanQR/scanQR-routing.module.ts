import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScanQRPage } from './scanQR.page';

const routes: Routes = [
  {
    path: '',
    component: ScanQRPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScanQRPageRoutingModule {}
