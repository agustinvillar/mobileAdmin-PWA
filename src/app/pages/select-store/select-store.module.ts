import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectStorePageRoutingModule } from './select-store-routing.module';

import { SelectStorePage } from './select-store.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectStorePageRoutingModule
  ],
  declarations: [SelectStorePage]
})
export class SelectStorePageModule {}
