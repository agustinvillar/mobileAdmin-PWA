import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { ROUTE_LOGIN, ROUTE_TABS, ROUTE_SELECT_STORE } from './services/constants.service';

import { AutoLoginGuard } from './guards/auto-login.guard';
import { SelectStoreGuard } from './guards/select-store.guard';
import { SuperuserGuard } from './guards/superuser.guard';

const routes: Routes = [
  {
    path: ROUTE_LOGIN,
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canLoad: [ AutoLoginGuard ]
  },
  {
    path: ROUTE_TABS,    
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canLoad: [ SelectStoreGuard ]
  },
  {
    path: ROUTE_SELECT_STORE,
    loadChildren: () => import('./pages/select-store/select-store.module').then( m => m.SelectStorePageModule),
    canLoad: [ SuperuserGuard ]
  },
  {
    path: '**',
    redirectTo: `/${ROUTE_LOGIN}`,
    pathMatch: 'full'
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
