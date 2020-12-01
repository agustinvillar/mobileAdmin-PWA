import { Injectable } from '@angular/core';
import { orderStatus } from 'src/app/models/enums';
import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class SwalService {
  readonly imgsFolder: string = 'assets/img/status';
  readonly defaultOptions = { 
    confirmButtonText: 'aceptar',
    cancelButtonText: 'cancelar',
    heightAuto: false
  };

  constructor() { }

  showGeneric(message: string, type: string, options?: any) {
    return Swal.fire({ 
      html: this.getInfoHtml(message, type), 
      ...{ ...this.defaultOptions, ...options } 
    });
  }

  showConfirm(message: string, options?: any) {
    return Swal.fire({ 
      html: this.getInfoHtml(message, 'question'), 
      showCancelButton: true,
      reverseButtons: true,
      ...{ ...this.defaultOptions, ...options } 
    });
  }

  showNotification(message: string) {
    return this.showGeneric(message, 'success', { showConfirmButton: false, timer: 2000 });
  }

  showStatusChangeConfirm(action: string) {
    const swal = { 
      html: this.getStatusChangeHtml(action),
      allowOutsideClick: false,
      confirmButtonText: 'confirmar'
    };
    if (action === orderStatus.Cancelado) { swal['input'] = 'textarea'; }

    return this.showConfirm('', swal);
  }

  getInfoHtml(content: string, type: string) {
    const img = `${this.imgsFolder}/${this.getTypeImg(type)}`;

    return `<div class='swal-container'>
      <ion-row class='swal-img'>
        <ion-col><img src="${img}"></ion-col>
      </ion-row>
      <ion-row class='swal-header'>
        <ion-col>${content}</ion-col>
      </ion-row>
      </div>`;
  }

  getStatusChangeHtml(action: string) {  
    let html = `<ion-row>
        <ion-col>Nuevo estado:</ion-col>
      </ion-row>
      <ion-row>
        <ion-col class="status-badge">
          <ion-badge color="${action}" mode="ios">
            ${ action.toUpperCase() }
          </ion-badge>
        </ion-col>
      </ion-row>`;

    if (action === orderStatus.Cancelado) { 
      html += `<ion-row>
          <ion-col class="ion-text-start ion-margin-top">Motivo:</ion-col>
        </ion-row>`;
    }
    
    return html;
  }

  getTypeImg(type: string) {
    switch (type) {
      case 'success': return 'success_img.svg';
      case 'error': return 'error_img.svg';
      case 'warning': return 'warning_img.svg';
      case 'question': return 'question_img.svg';
      default: return 'info_img.svg';
    }
  }
}
