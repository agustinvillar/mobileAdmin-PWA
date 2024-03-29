import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';

import { cancelSource, orderStatus, orderType } from 'src/app/models/enums';
import { Order } from 'src/app/models/order';
import { Store } from 'src/app/models/store';

import { ERROR_INVALID_QR, ERROR_STATUS_CHANGED, ERROR_TRY_AGAIN } from 'src/app/services/errors.service';
import { GeneralService } from 'src/app/services/API/general/general.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { SwalService } from 'src/app/services/swal/swal.service';
import { ErrorLog } from 'src/app/models/errorLog';
import { LogService } from '../log/log.service';

const ORDERS_MOBILE_PAGE = 'orders';
const SHIFT_PERIOD_HOURS = 12;
const TA_START_PERIOD_HOURS = 4;

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderSubjectsSubsciptions: Subscription[] = [];
  public tableOrdersSubject: BehaviorSubject<Array<Order>> = new BehaviorSubject<Array<Order>>([]);
  public takeAwayOrdersSubject: BehaviorSubject<Array<Order>> = new BehaviorSubject<Array<Order>>([]);
  public bookingOrdersSubject: BehaviorSubject<Array<Order>> = new BehaviorSubject<Array<Order>>([]);
  calculatedTime;

  constructor(
    private afs: AngularFirestore, private generalService: GeneralService, private logService: LogService,
    private notificationService: NotificationService, public swalService: SwalService
  ) { }

  async initOrderListeners(storeId: string, orderTypes: orderType[]) {
    this.resetOrdersSubjects();        
    this.calculatedTime = await this.generalService.getCalculatedTime();

    if (orderTypes.includes(orderType.Mesa)) {
      let sub = this.getTableOrdersForDate(storeId, orderType.Mesa).subscribe(orders => 
        this.tableOrdersSubject.next(orders)
      );
      this.orderSubjectsSubsciptions.push(sub);
    }

    if (orderTypes.includes(orderType.TakeAway)) {
      let sub = this.getTakeAwayOrders(storeId).subscribe(orders =>
        this.takeAwayOrdersSubject.next(orders)      
      );
      this.orderSubjectsSubsciptions.push(sub);
    }

    if (orderTypes.includes(orderType.Reserva)) {
      let sub = this.getTableOrdersForDate(storeId, orderType.Reserva).subscribe(orders => 
        this.bookingOrdersSubject.next(orders)
      );
      this.orderSubjectsSubsciptions.push(sub);
    }
  }

  resetOrdersSubjects() {
    this.orderSubjectsSubsciptions.forEach(sub => { if (sub) sub.unsubscribe(); });
    this.orderSubjectsSubsciptions = [];
    this.tableOrdersSubject.next([]);
    this.takeAwayOrdersSubject.next([]);
    this.bookingOrdersSubject.next([]);
  }

  async get(orderId: string): Promise<Order> {
    const doc = await this.afs.collection<Order>('orders').doc(orderId).ref.get();
    let order = doc.data() as Order;
    order.id = doc.id;
    return order;
  }

  getTableOrdersForDate(storeId: string, type: orderType) {
    const startTime = this.calculatedTime.clone().subtract(SHIFT_PERIOD_HOURS, 'hours').format('YYYY-MM-DD HH:mm');
    const endTime = this.calculatedTime.clone().add(SHIFT_PERIOD_HOURS, 'hours').format('YYYY-MM-DD HH:mm');

    return this.afs.collection<Order>('orders', ref => 
      ref.where('store.id', '==', storeId)
        .where('orderType', "==", type)
        .where('orderDate', ">=", startTime)
        .where('orderDate', "<", endTime)
        .orderBy('orderDate', 'asc')
    ).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Order;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    }));
  }

  getTakeAwayOrders(storeId: string) {
    const startTime = this.calculatedTime.clone().subtract(TA_START_PERIOD_HOURS, 'hours').format('YYYY-MM-DD HH:mm');

    return this.afs.collection<Order>('orders', ref => 
      ref.where('store.id', '==', storeId)
        .where('orderType', "==", orderType.TakeAway)
        .where('orderDate', ">=", startTime)
        .orderBy('orderDate', 'asc')
    ).snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        let data = a.payload.doc.data() as Order;
        let id = a.payload.doc.id;
        return { id, ...data };
      });
    }));
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
    order: Order, 
    originalStatus: orderStatus, 
    newStatus: orderStatus, 
    cancelMotive?: string
  }) {
    try {      
      const docRefOrder = this.afs.firestore.collection('orders').doc(data.order.id);  
      
      await this.afs.firestore.runTransaction(async t => {
        const docOrder = await t.get(docRefOrder);
        const order = docOrder.data();
        if (order.status !== data.originalStatus) { 
          await this.swalService.showGeneric(ERROR_STATUS_CHANGED, 'error');
          throw { errorShown: true };
        }

        const incremental = await this.generalService.getServerIncremental();
        if (!incremental) throw '';

        await t.update(docOrder.ref, { 
          status: data.newStatus,
          cancelMotive: data.cancelMotive || null,
          cancelSource: data.cancelMotive ? cancelSource.restaurant : null,
          updatedAt: incremental
        });
      });
      
      const notificationsText = this.getNotificationsText({
        order: data.order, 
        status: data.newStatus,
        estimatedTime: data.order.estimatedTimeTA || ''
      });

      this.notificationService.sendPush({ 
        title: notificationsText.push.title, 
        content: notificationsText.push.text, 
        userId: data.order.userId 
      });
      
      this.notificationService.sendApp({
        msg: notificationsText.app.text,
        userId: data.order.userId,
        redirectTo: ORDERS_MOBILE_PAGE
      });
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
      throw(e);
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
