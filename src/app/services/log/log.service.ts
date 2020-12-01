import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { environment } from 'src/environments/environment';

import { ErrorLog } from 'src/app/models/errorLog';
import { GeneralService } from '../API/general/general.service';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(
    private http : HttpClient, private afs: AngularFirestore, private generalService: GeneralService
  ) { }

  async addError(error: ErrorLog) {
    error.datetime = await this.generalService.getServerMoment('YYYY-MM-DD HH:mm');
    return this.afs.collection<ErrorLog>('errorLog').add(error);
  }

  async logErrors(error: ErrorLog) {
    const token = await this.generalService.getJsonWebToken();
    const body = error;
    const options = { 
      headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', token) 
    };
    this.http.post(environment.API_URL + 'api/Utils/ErrorLog', body, options).toPromise();
  }

  async sendErrorViaEmail(error : ErrorLog) {
    const token = await this.generalService.getJsonWebToken();
    const body = {
      "To": ["soporte@menoo.com.uy", "avillar@menoo.com.uy"],
      "CC": [],
      "CCO": [],
      "Title": `Error en Pagina ${error.module}`,
      "Body": `<h1>Ocurrio un error: </h1><br>
        <p>Error en: ${error.page}</p><br>
        <p>Funcion: ${error.function}</p><br>
        <p>Detalle: ${error.error}</p><br>
        <p>Usuario: ${error.userId}</p>`,
      "IsHtml": true,
      "DisplayName": "MenooError"
    }
    const options = { 
      headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', token) 
    };
    this.http.post(environment.API_URL + 'api/Messaging/Email', body, options).toPromise();
  }
}
