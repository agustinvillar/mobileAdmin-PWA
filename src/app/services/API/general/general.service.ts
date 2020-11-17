import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { JsonWebToken } from 'src/app/models/jwt';
import { get, set, remove } from "src/app/services/storage/storage.service";
import { EventService } from 'src/app/services/event/event.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(public http: HttpClient, private events: EventService) { }

  async getJsonWebToken() {
    const token = await get("token");
    if (!token) Promise.reject(this.events.publish("LogoutDotNet"));

    const jwt = JSON.parse(token) as JsonWebToken;
    if (!jwt) Promise.reject(this.events.publish("LogoutDotNet"));

    let isExpired = true;
    if (jwt && jwt.Expires)
      isExpired = moment(jwt.DateExpires).diff(moment(), "seconds") <= 10;

    if (!isExpired) {
      return Promise.resolve(jwt.AccessToken);
    } 
    
    try {
      const url = environment.API_URL + "api/Login/RefreshToken";
      const body = { RefreshToken: jwt.RefreshToken, AccessToken: jwt.AccessToken };
      const options = { headers: new HttpHeaders({ "Content-Type": "application/json" }) };

      const response = await this.http.post<JsonWebToken>(url, body, options).toPromise();
      set("token", JSON.stringify(response));
      return Promise.resolve(response.AccessToken);
    } catch(e) {
      Promise.reject(this.events.publish("LogoutDotNet"));
    }
  }
}
