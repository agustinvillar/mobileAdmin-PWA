import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { AngularFireAuth } from "@angular/fire/auth";
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { take } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { ERROR_EXPIRED_SESSION } from 'src/app/services/errors.service';

import { JsonWebToken } from 'src/app/models/jwt';
import { LoadingService } from '../loading/loading.service';
import { get, set, remove } from "../storage/storage.service";
import { SwalService } from '../swal/swal.service';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';

const STORAGE_TOKEN_KEY = 'token';
const STORAGE_STORE_ID_KEY = 'storeId';
const API_AUTH_ENDPOINT = 'api/Login/Authenticate';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(
    private router: Router, private http: HttpClient, private afAuth: AngularFireAuth, 
    private userService: UserService, public loadingService: LoadingService, public swalService: SwalService
  ) { 
    this.authCheck();
  }

  async authCheck() {
    try {
      const token = await get(STORAGE_TOKEN_KEY); 
      if (!token) throw(false);
  
      const authData = await this.afAuth.authState.pipe(take(1)).toPromise();
      if (!authData) throw(false);
      
      await this.userService.initUser(authData);
      this.isAuthenticated.next(true);
    } catch (e) {
      this.isAuthenticated.next(false);
    }
  }

  async login(email: string, password: string) {
    try {      
      await this.apiAuth(email, password);
      const authCredential = await this.afAuth.signInWithEmailAndPassword(email, password);        
      await this.userService.initUser(authCredential.user);
      this.isAuthenticated.next(true);
      await this.router.navigateByUrl('/tabs', { replaceUrl:true });
    } catch(e) {
      remove(STORAGE_TOKEN_KEY);
      Promise.reject(e);
    }
  }

  async apiAuth(email: string, password: string) {
    const url = environment.API_URL + API_AUTH_ENDPOINT;
    const body = { Email: email, Password: password };
    const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    
    const response = await this.http.post<JsonWebToken>(url, body, options).toPromise();
    return set(STORAGE_TOKEN_KEY, response);
  }

  async logout() {
    await this.loadingService.present();
    remove(STORAGE_TOKEN_KEY);
    remove(STORAGE_STORE_ID_KEY);
    this.userService.setCurrentUser(null);
    await this.afAuth.signOut();
    this.isAuthenticated.next(false);
    await this.router.navigateByUrl('/login', { replaceUrl:true });
    this.loadingService.dismiss();
  }

  async apiLogout() {    
    await this.swalService.showGeneric(ERROR_EXPIRED_SESSION, 'error');
    this.logout();
  }
}
