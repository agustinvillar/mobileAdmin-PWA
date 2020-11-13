import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  // login by email and pw
  // login(email, password) {
  //   return Observable.create(observer => {
  //     this.authenticateInDotNet(email, password).then(token => {
  //       this.afAuth.auth.signInWithEmailAndPassword(email, password).then(authData => {
  //         // this.initProviders(authData);
  //         this.currentUser = authData;
  //         observer.next();
  //       }).catch(e => {
  //         this.storage.remove('token');
  //       });
  //     }).catch(error => {
  //       swal({
  //         type: 'error',
  //         html: '<p>El usuario o la contraseña ingresados no son correctos</p>',
  //         showConfirmButton: true,
  //         title: 'Login Incorrecto'
  //       });
  //       this.loading.dismiss();
  //     });;
  //   });
  // }

  // authenticateInDotNet(email: string, password: string) {
  //   return new Promise<string>((resolve, reject) => {
  //     const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //     const url = API_URL + 'api/Login/Authenticate';
  //     const body = { Email: email, Password: password };
  //     this.http.post<JsonWebToken>(url, body, options).subscribe(response => {
  //       this.storage.set('token', JSON.stringify(response));
  //       return resolve(response.AccessToken)
  //     }, error => {
  //       return reject(error);
  //     });
  //   });
  // }

  // logout() {
  //   this.storage.remove('token');
  //   this.currentUser = null;
  //   this.authUser = null;
  //   return this.afAuth.auth.signOut().then(() => this.authenticated.next(false));
  // }

  // logoutDotNet() {
  //   this.events.subscribe('LogoutDotNet', () => {
  //     swal({ title: 'Sesión  Expirada', html: '<p>La sesión ha expirado</p>', type: 'info' });
  //     this.loading.dismiss();
  //     this.logout();
  //   });
  // }
}
