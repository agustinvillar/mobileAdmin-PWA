import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { take } from 'rxjs/internal/operators/take';
import { Observable } from 'rxjs';

import { orderType, typeOfRestaurant, userType } from 'src/app/models/enums';
import { User } from 'src/app/models/user';
import { SwalService } from 'src/app/services/swal/swal.service';
import { Store } from 'src/app/models/store';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public currentUser: User;

  constructor(
    public afAuth: AngularFireAuth, public afs: AngularFirestore, public swalService: SwalService
  ) { }

  getCurrentUser(): User {
    return this.currentUser;
  }
  setCurrentUser(user: User) {
    this.currentUser = user;
  }

  getCurrent(uid: string): Observable<User> {
    return this.afs.doc<User>('admins/' + uid).valueChanges();
  }

  async initUser(authData) {
    const user = await this.getCurrent(authData.uid).pipe(take(1)).toPromise();
    this.setCurrentUser(user);
    return user;
  }

  getRestaurantType(store: Store): typeOfRestaurant {
    if (this.currentUser.isSuperUser) { return typeOfRestaurant.all; }

    const isResto = store.isResto;
    const hasBookings = !store.disableBookings;
    const hasTA = store.isTakeAway || (store.isMarket && store.market);

    if (this.currentUser.userType === userType.waiter) {
      return typeOfRestaurant.onlyTo;
    } else if (!isResto) {
      return typeOfRestaurant.onlyTa;
    } else {
      if (hasBookings) {
        return hasTA ? typeOfRestaurant.all : typeOfRestaurant.allButTa;
      } else {
        return hasTA ? typeOfRestaurant.allButBook : typeOfRestaurant.onlyTo;
      }
    } 
  }

  checkOrderTypePermission(store: Store, type: orderType): boolean {
    switch (this.getRestaurantType(store)) {
      case typeOfRestaurant.onlyTo:
        return type === orderType.Mesa;
      case typeOfRestaurant.onlyTa:
        return type === orderType.TakeAway;
      case typeOfRestaurant.allButTa:
        return [ orderType.Mesa, orderType.Reserva ].includes(type);
      case typeOfRestaurant.allButBook:
        return [ orderType.Mesa, orderType.TakeAway ].includes(type);    
      default:
        return true;
    }
  }
}
