import { Component } from '@angular/core';
import { Store } from '../models/store';
import { User } from '../models/user';
import { LoadingService } from '../services/loading/loading.service';
import { StoreService } from '../services/store/store.service';
import { SwalService } from '../services/swal/swal.service';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  public user: User;
  public store: Store;

  constructor(
    public loadingService: LoadingService, public swalService: SwalService, public userService: UserService,
    public storeService: StoreService
  ) { }
  
  ngOnInit() { 
    this.user = this.userService.getCurrentUser();
    this.store = this.storeService.getCurrentStore();
  }

  async logout() {
    const res = await this.swalService.showConfirm('¿Seguro que desea cerrar sesión?');
    if (res.isConfirmed) {
      await this.loadingService.present();
      await this.userService.logout();
      this.loadingService.dismiss();
    }
  }
}
