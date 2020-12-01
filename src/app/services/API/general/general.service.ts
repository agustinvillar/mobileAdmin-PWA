import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import * as moment from 'moment';

import { environment } from 'src/environments/environment';

import { JsonWebToken } from 'src/app/models/jwt';
import { STORAGE_TOKEN_KEY } from 'src/app/services/constants.service';
import { EventService } from 'src/app/services/event/event.service';
import { get, set } from "src/app/services/storage/storage.service";
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(public http: HttpClient, private events: EventService, public authService: AuthService) { }

  async getJsonWebToken() {
    try {
      const token = await get(STORAGE_TOKEN_KEY);
      if (!token) throw('');

      const jwt = JSON.parse(token) as JsonWebToken;
      if (!jwt) throw('');

      let isExpired = true;
      if (jwt && jwt.Expires)
        isExpired = moment(jwt.DateExpires).diff(moment(), "seconds") <= 10;

      if (!isExpired) {
        return jwt.AccessToken;
      } 
    
      const url = environment.API_URL + "api/Login/RefreshToken";
      const body = { RefreshToken: jwt.RefreshToken, AccessToken: jwt.AccessToken };
      const options = { headers: new HttpHeaders({ "Content-Type": "application/json" }) };

      const response = await this.http.post<JsonWebToken>(url, body, options).toPromise();
      set(STORAGE_TOKEN_KEY, response);
      return response.AccessToken;
    } catch(e) {
      await this.authService.apiLogout();
      return null;
    }
  }

  async getServerMoment(dateFormat = "DD-MM-YYYY HH:mm") {
    const time = await this.getServerTime();    
    let now = moment(time, 'YYYY-MM-DD HH:mm');
    return moment(now.format(), moment.ISO_8601).format(dateFormat);    
  }

  getServerTime() {
    const options = {
      headers: new HttpHeaders().append("Content-Type", "application/json")
    };
    const url = environment.API_URL + "api/Utils/Date";
    return this.http.get(url, options).toPromise();
  }

  async getServerIncremental(): Promise<any> {
    const token = await this.getJsonWebToken();
    if (!token) return;

    const options = { 
      headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', token) 
    };
    const url = environment.API_URL + 'api/Utils/Incremental';
    const body = {};
    return this.http.post(url, body, options).toPromise();
  }
}
