import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { take } from 'rxjs/internal/operators/take';

import { Store } from 'src/app/models/store';
import { STORAGE_STORE_ID_KEY } from '../constants.service';
import { set } from "../storage/storage.service";

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private storesCollection: AngularFirestoreCollection<Store>;
  public stores: Store[];
  public storesSubject: BehaviorSubject<Array<Store>> = new BehaviorSubject<Array<Store>>([]);
  public currentStore: Store;

  constructor(
    public afs: AngularFirestore
  ) { 
    this.storesCollection = afs.collection<Store>('stores', ref => ref.orderBy('name'));
    this.storesCollection.valueChanges().subscribe(stores => {
      this.stores = stores;
      this.storesSubject.next(stores);
    });
  }

  getCurrentStore(): Store {
    return this.currentStore;
  }
  setCurrentStore(store: Store) {
    set(STORAGE_STORE_ID_KEY, store.id);
    this.currentStore = store;
  }

  get(id: string) {
    return this.afs.doc<Store>('stores/' + id).valueChanges();
  }

  async setStoreById(storeId: string) {
    const store = await this.get(storeId).pipe(take(1)).toPromise();
    if (store) {
      console.log(store)
      if(!store.id){
        store.id = storeId;
      }
      this.setCurrentStore(store);
    }
  }
}
