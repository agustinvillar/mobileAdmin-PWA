import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { BOOKING_ORDER_CANCEL_LIMIT, TAKEAWAY_CANCEL_LIMIT } from 'src/app/services/constants.service';
import { Constants } from 'src/app/models/constants';

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  private bookingCancelTime: number = BOOKING_ORDER_CANCEL_LIMIT;
  private takeAwayCancelTime: number = TAKEAWAY_CANCEL_LIMIT;

  constructor(private afs: AngularFirestore) { 
    this.listenConstants();
  }

  listenConstants() {
    this.afs.collection('settings').doc<Constants>('constants').valueChanges().subscribe(res => {
      this.bookingCancelTime = res.bookingCancelLimit || BOOKING_ORDER_CANCEL_LIMIT;
      this.takeAwayCancelTime = res.takeAwayCancelLimit || TAKEAWAY_CANCEL_LIMIT;
    });
  }

  getBookingCancelLimit() {
    return this.bookingCancelTime;
  }
  getTakeAwayLimit() {
    return this.takeAwayCancelTime;
  }
}
