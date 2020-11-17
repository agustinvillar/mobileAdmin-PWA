import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { take } from 'rxjs/internal/operators/take';
import { Observable } from 'rxjs';
import { get, set, remove } from "../storage/storage.service";
import { SwalService } from '../swal/swal.service';
import { StoreService } from '../store/store.service';
import { JsonWebToken } from 'src/app/models/jwt';
import { User } from 'src/app/models/user';
import { environment } from '../../../environments/environment';
import { ERROR_EXPIRED_SESSION } from 'src/app/services/errors.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  public currentUser: User;

  constructor(
    private router: Router, public afAuth: AngularFireAuth, public afs: AngularFirestore, 
    public http: HttpClient, public swalService: SwalService, private storeService: StoreService
  ) { }

  async login(email: string, password: string) {
    try {      
      await this.authenticateInDotNet(email, password);
      try {
        const authCredential = await this.afAuth.signInWithEmailAndPassword(email, password);        
        await this.initUser(authCredential.user);
        Promise.resolve();
      } catch(e) {
        remove('token');
        throw(e);
      }
    } catch(e) {
      Promise.reject(e);
    }
  }

  async authenticateInDotNet(email: string, password: string) {
    const url = environment.API_URL + 'api/Login/Authenticate';
    const body = { Email: email, Password: password };
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    
    const response = await this.http.post<JsonWebToken>(url, body, options).toPromise();
    set('token', JSON.stringify(response));
    Promise.resolve(response.AccessToken);
  }

  async initUser(authData) {
    this.currentUser = await this.getCurrent(authData.uid).pipe(take(1)).toPromise();
    this.loginRedirect();
  }

  async loginRedirect() {
    if (!this.currentUser.isSuperUser) return this.router.navigateByUrl('/tabs');
    
    const storeId = await get('storeId');
    if(!storeId) return this.router.navigateByUrl('/select-store');

    await this.storeService.setStoreById(storeId);
    return this.router.navigateByUrl('/tabs');
  }

  getCurrent(uid: string): Observable<User> {
    return this.afs.doc<User>('admins/' + uid).valueChanges();
  }

  getCurrentUser(): User {
    return this.currentUser;
  }

  async logout() {
    remove('token');
    remove('storeId');
    this.currentUser = null;
    await this.afAuth.signOut();
    Promise.resolve(this.router.navigateByUrl('/login'));
  }

  async logoutDotNet() {    
    await this.swalService.showGeneric(ERROR_EXPIRED_SESSION, 'error');
    this.logout();
  }
}
