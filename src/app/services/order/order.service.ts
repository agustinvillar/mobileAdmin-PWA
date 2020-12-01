import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { cancelSource, orderStatus } from 'src/app/models/enums';
import { Order } from 'src/app/models/order';
import { Store } from 'src/app/models/store';

import { ERROR_INVALID_QR, ERROR_TRY_AGAIN } from 'src/app/services/errors.service';
import { GeneralService } from 'src/app/services/API/general/general.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SwalService } from 'src/app/services/swal/swal.service';
import { ErrorLog } from 'src/app/models/errorLog';
import { LogService } from '../log/log.service';

const ORDERS_MOBILE_PAGE = 'orders';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private afs: AngularFirestore, private generalService: GeneralService, private logService: LogService,
    private notificationService: NotificationService, public swalService: SwalService
  ) { }

  async get(orderId: string): Promise<Order> {
    const doc = await this.afs.collection<Order>('orders').doc(orderId).ref.get();
    return <Order>doc.data();
  }

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
        case orderStatus.Servido: 
          actions = [ orderStatus.Cancelado ]; break;
        case orderStatus.Pronto: break;
        case orderStatus.Cancelado: break;
        default: 
          throw(ERROR_TRY_AGAIN);
      }
      return { order, actions };

    } catch (e) {
      this.swalService.showGeneric(e, 'error');

      const error: ErrorLog = {
        error: JSON.stringify(e),
        extraData: JSON.stringify({ orderId, store: store.id }),
        page: "OrderService",
        function: "getActions PWA002",
        module: "adminPWA"
      }
      this.logService.addError(error);
      this.logService.logErrors(error);
      this.logService.sendErrorViaEmail(error);
    }
  }

  async updateStatus(data: {
    orderId: string, 
    action: orderStatus, 
    cancelMotive?: string,
    notify?: boolean
  }) {
    try {
      const incremental = await this.generalService.getServerIncremental();
      if (!incremental) return Promise.reject();
      
      await this.afs.doc<Order>('orders/' + data.orderId).update({
        status: data.action,
        cancelMotive: data.cancelMotive || null,
        cancelSource: data.cancelMotive ? cancelSource.restaurant : null,
        updatedAt: incremental
      });
      
      if (data.notify !== false) {
        const order = await this.get(data.orderId);
        const notificationsText = this.getNotificationsText({
          order, 
          status: data.action,
          estimatedTime: order.estimatedTimeTA || ''
        });

        this.notificationService.sendPush({ 
          title: notificationsText.push.title, 
          content: notificationsText.push.text, 
          userId: order.userId 
        });
        
        this.notificationService.sendApp({
          msg: notificationsText.app.text,
          userId: order.userId,
          redirectTo: ORDERS_MOBILE_PAGE
        });
      }
    } catch (e) {
      const error: ErrorLog = {
        error: JSON.stringify(e),
        extraData: JSON.stringify(data),
        page: "OrderService",
        function: "updateStatus PWA001",
        module: "adminPWA"
      }
      this.logService.addError(error);
      this.logService.logErrors(error);
      this.logService.sendErrorViaEmail(error);
    }
  }

  getNotificationsText(data: {
    order: Order, 
    status: orderStatus, 
    cancelMotive?: string, 
    estimatedTime?: string
  }) {
    const { order, status, cancelMotive, estimatedTime } = data;

    if (order.items && order.items.length > 0) {
      let pushText = "Su orden de ";
      let qty = order.items[0].quantity;
      let moreItems = order.items.length;

      if (qty > 1) {
        pushText += qty + "x "
      }
      pushText += order.items[0].name;

      if (moreItems > 1) {
        pushText += " y " + moreItems + " items más";
      }

      let pushTitle, appText;
      switch (status) {
        case orderStatus.Aceptado:
          pushTitle = "orden aceptada!"
          pushText += " ha sido aceptada por el restaurante";
          appText = '¡Tu pedido ha sido aceptado!';
          if(estimatedTime){ appText += ('Tiempo Estimado: ' + estimatedTime).fontsize(3); }
          break;
        case orderStatus.Preparando:
          pushTitle = "orden en preparación!"
          pushText += " está siendo preparada por el restaurante";
          appText = '¡Tu pedido está siendo preparado!';
          break;
        case orderStatus.Pronto:
          pushTitle = "Take Away listo para retirar!"
          pushText += " está pronta!";
          appText = '¡Tu pedido está pronto!';
          break;
        case orderStatus.Servido:
          pushTitle = "Su orden fue servida"
          pushText += " fue servida. Esperamos que disfrute su comida!";
          appText = '¡Tu pedido ha sido servido!';
          break;
        case orderStatus.Cancelado:
          pushTitle = "Su orden fue cancelada"
          pushText += " fue cancelada por el restaurante.";
          appText = `<p style="font-size: 15px; font-weigth: 500; font-family: "Poppins", sans-serif;">
              ¡Tu pedido ha sido cancelado por el restaurante!
            </p>`;

          if (cancelMotive) { 
            pushText += " El motivo es: " + cancelMotive; 
            appText += `<br><p style="font-size: 15px; font-weigth: 400; font-family: "Poppins", sans-serif;">
                Motivo: ${cancelMotive.fontsize(3)}
              </p>`;
          }
          break;  
        default: break;
      }
      
      return { 
        push: { title: pushTitle, text: pushText },
        app: { text: appText }
      };
    }
    throw "No hay items"
  }
}
