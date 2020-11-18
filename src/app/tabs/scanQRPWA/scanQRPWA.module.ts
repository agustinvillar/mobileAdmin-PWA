import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScanQRPWAPage } from './scanQRPWA.page';

import { ScanQRPWAPageRoutingModule } from './scanQRPWA-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ScanQRPWAPageRoutingModule
  ],
  declarations: [ScanQRPWAPage]
})
export class ScanQRPWAPageModule {}
