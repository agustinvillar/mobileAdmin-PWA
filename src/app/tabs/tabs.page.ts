import { Component } from '@angular/core';

import { Store } from '../models/store';
import { User } from '../models/user';

import { ROUTE_SELECT_STORE, ROUTE_SCAN_QR_PWA, ROUTE_ORDERS } from '../services/constants.service';
import { AuthService } from '../services/auth/auth.service';
import { StoreService } from '../services/store/store.service';
import { SwalService } from '../services/swal/swal.service';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  readonly ROUTE_SELECT_STORE: string = `/${ROUTE_SELECT_STORE}`;
  readonly ROUTE_SCAN_QR_PWA: string = ROUTE_SCAN_QR_PWA;
  readonly ROUTE_ORDERS: string = ROUTE_ORDERS;

  public user: User;
  public store: Store;

  constructor(
    public swalService: SwalService, private authService: AuthService,
    public userService: UserService, public storeService: StoreService
  ) { }
  
  ngOnInit() { 
    this.user = this.userService.getCurrentUser();
    this.store = this.storeService.getCurrentStore();
  }

  async logout() {
    const res = await this.swalService.showConfirm('¿Seguro que desea cerrar sesión?');
    if (res.isConfirmed) this.authService.logout();
  }
}
