import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from 'src/app/models/store';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { StoreService } from 'src/app/services/store/store.service';

@Component({
  selector: 'app-select-store',
  templateUrl: './select-store.page.html',
  styleUrls: ['./select-store.page.scss'],
})
export class SelectStorePage implements OnInit {
  public stores: Store[];
  
  constructor(
    private router: Router, private loadingService: LoadingService, private storeService: StoreService
  ) { }

  ngOnInit() {
    this.storeService.getStoresSubject().subscribe(stores => {
      this.stores = stores;
    });
  }

  selectStore(store: Store) {
    this.storeService.setCurrentStore(store);
    this.router.navigateByUrl('/tabs');
  }

}
