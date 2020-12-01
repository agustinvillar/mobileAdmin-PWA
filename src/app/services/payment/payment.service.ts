import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { GeneralService } from '../API/general/general.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient, private generalService: GeneralService) 
  { }

  async refundByOrder(orderId: string) {
    const token = await this.generalService.getJsonWebToken();
    const url = environment.API_URL + '/api/Payments/RefundByOrder';
    const options = { 
      headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', token) 
    };
    const body = { Id: orderId };
    return this.http.post<any>(url, body, options).toPromise();
  }

  async confirmPayment(id: string) {
    const token = await this.generalService.getJsonWebToken();
    const url = environment.API_URL + 'api/GeoPay/ConfirmPayment';
    const options = { 
      headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', token) 
    };
    const body = { EntityId: id };
    return this.http.post<any>(url, body, options).toPromise();
  }
}
