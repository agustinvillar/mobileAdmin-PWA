import { Injectable } from '@angular/core';
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
      ...{ ...this.defaultOptions, ...options } 
    });
  }

  showNotification(message: string) {
    return this.showGeneric(message, 'success', { showConfirmButton: false, timer: 2000 });
  }

  showStatusChangeConfirm(action: string) {
    return this.showConfirm('', { 
      html: this.getStatusChangeHtml(action),
      confirmButtonText: 'confirmar'
    });
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
    const img = `${this.imgsFolder}/${this.getTypeImg('question')}`;

    return `<div class='swal-container'>
      <ion-row class='swal-img'>
        <ion-col><img src="${img}"></ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          Nuevo estado:
          <ion-badge class="status-badge" color="${action}">
            ${ action.toUpperCase() }
          </ion-badge>
        </ion-col>
      </ion-row>
    </div>`;
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
