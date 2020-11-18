import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';

import { STORAGE_STORE_ID_KEY, ROUTE_SELECT_STORE } from './../services/constants.service';

import { get } from "./../services/storage/storage.service";
import { StoreService } from '../services/store/store.service';

import { AuthGuard } from './auth.guard';
 
@Injectable({
  providedIn: 'root'
})
export class SelectStoreGuard implements CanLoad {
  constructor(
    private router: Router, private storeService: StoreService, private authGuard: AuthGuard
  ) {}
 
  async canLoad(): Promise<boolean> {
    const authGuardRes = await this.authGuard.canLoad().toPromise();
    if (!authGuardRes) return false;
    
    try {
      const storeId = await get(STORAGE_STORE_ID_KEY); 
      if (storeId) {
        if (!this.storeService.getCurrentStore()) await this.storeService.setStoreById(storeId);   
        return true;
      } else {
        this.router.navigateByUrl(`/${ROUTE_SELECT_STORE}`, { replaceUrl:true });
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}