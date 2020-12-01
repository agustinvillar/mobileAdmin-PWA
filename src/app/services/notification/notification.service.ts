import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/internal/operators/take';

import { ErrorLog } from 'src/app/models/errorLog';
import { PushNotification } from 'src/app/models/push-notification';
import { UserNotification } from 'src/app/models/user-notification';
import { LogService } from 'src/app/services/log/log.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private logService: LogService, private afs: AngularFirestore) { }

  getUserNotifications(userId){    
    return this.afs.collection<UserNotification>(
      'notificationUser', ref => ref.where('userId', '==', userId)
    ).valueChanges();
  }

  sendPush(data: { 
    title: string, 
    content: string, 
    userId: string 
  }) {
    try {
      return this.afs.collection<PushNotification>('pushNotifications').add(data);
    
    } catch (e) {
      const error: ErrorLog = {
        error: JSON.stringify(e),
        extraData: JSON.stringify(data),
        page: "NotificationService",
        function: "sendPush PWA003",
        module: "adminPWA"
      }
      this.logService.addError(error);
      this.logService.logErrors(error);
      this.logService.sendErrorViaEmail(error);
    }
  }

  sendApp(data: { 
    msg: string, 
    userId: string,
    redirectTo: string
  }) {
    try {
      this.getUserNotifications(data.userId).pipe(take(1)).subscribe(res => {
        if (res.findIndex(userNotification => { return userNotification.msg == data.msg }) === -1) {
          return this.afs.collection<UserNotification>('notificationUser').add(data);
        }
      });

    } catch (e) {
      const error: ErrorLog = {
        error: JSON.stringify(e),
        extraData: JSON.stringify(data),
        page: "NotificationService",
        function: "sendApp PWA004",
        module: "adminPWA"
      }
      this.logService.addError(error);
      this.logService.logErrors(error);
      this.logService.sendErrorViaEmail(error);
    }
  }
}
