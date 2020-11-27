import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { orderStatus } from 'src/app/models/enums';
import { Order } from 'src/app/models/order';
import { Store } from 'src/app/models/store';
import { ERROR_INVALID_QR, ERROR_TRY_AGAIN } from 'src/app/services/errors.service';
import { SwalService } from 'src/app/services/swal/swal.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private afs: AngularFirestore, public swalService: SwalService
  ) { }

  async getActions(orderId: string, store: Store) {
    try {
      const order: Order = await this.get(orderId);
      if (order.store.id !== store.id) throw(ERROR_INVALID_QR);

      let actions: orderStatus[] = null;
      switch (order.status) {
        case orderStatus.Pendiente:
          actions = [ orderStatus.Aceptado, orderStatus.Cancelado ]; break;
        case orderStatus.Aceptado:
          actions = [ orderStatus.Pronto, orderStatus.Cancelado ]; break;
        case orderStatus.Preparando:
          actions = [ orderStatus.Servido, orderStatus.Cancelado ]; break;          
        case orderStatus.Pronto: break;
        case orderStatus.Cancelado: break;
        case orderStatus.Servido: break;
        default: 
          throw(ERROR_TRY_AGAIN);
      }
      return { order, actions };

    } catch (error) {
      this.swalService.showGeneric(error, 'error');
    }
  }

  async get(orderId: string): Promise<Order> {
    const doc = await this.afs.collection<Order>('orders').doc(orderId).ref.get();
    return <Order>doc.data();
  }
}
