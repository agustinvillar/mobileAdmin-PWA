import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { take } from 'rxjs/internal/operators/take';
import { Observable } from 'rxjs';
import { SwalService } from '../swal/swal.service';
import { User } from 'src/app/models/user';

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
}
