import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from 'src/app/models/store';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { StoreService } from 'src/app/services/store/store.service';
import { SwalService } from 'src/app/services/swal/swal.service';

@Component({
  selector: 'app-select-store',
  templateUrl: './select-store.page.html',
  styleUrls: ['./select-store.page.scss'],
})
export class SelectStorePage implements OnInit {
  public stores: Store[];
  
  constructor(
    private router: Router, private storeService: StoreService, private authService: AuthService,   
    private loadingService: LoadingService, public swalService: SwalService
  ) { }

  async ngOnInit() {
    await this.loadingService.present();
    this.storeService.storesSubject.subscribe(stores => {
      this.stores = stores;
      this.loadingService.dismiss();
    });
  }

  selectStore(store: Store) {
    this.storeService.setCurrentStore(store);
    this.router.navigateByUrl('/tabs');
  }

  async logout() {
    const res = await this.swalService.showConfirm('¿Seguro que desea cerrar sesión?');
    if (res.isConfirmed) this.authService.logout();
  }
}
