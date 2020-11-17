import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AutoLoginGuard } from './guards/auto-login.guard';
import { SelectStoreGuard } from './guards/select-store.guard';
import { SuperuserGuard } from './guards/superuser.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canLoad: [ AutoLoginGuard ]
  },
  {
    path: 'tabs',    
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canLoad: [ SelectStoreGuard ]
  },
  {
    path: 'select-store',
    loadChildren: () => import('./pages/select-store/select-store.module').then( m => m.SelectStorePageModule),
    canLoad: [ SuperuserGuard ]
  },
  {
    path: '**',
    redirectTo: '/login',
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
