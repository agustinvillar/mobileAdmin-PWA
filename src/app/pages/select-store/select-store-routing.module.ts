import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectStorePage } from './select-store.page';

const routes: Routes = [
  {
    path: '',
    component: SelectStorePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectStorePageRoutingModule {}
