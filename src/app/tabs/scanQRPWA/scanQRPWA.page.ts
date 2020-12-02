import { Component, ViewChild, ElementRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import jsQR from 'jsqr';

import { ERROR_INVALID_QR } from 'src/app/services/errors.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { StoreService } from 'src/app/services/store/store.service';
import { SwalService } from 'src/app/services/swal/swal.service';
import { ticketQRCode } from 'src/app/models/ticketQRCode';
import { OrderStatusChangePage } from 'src/app/pages/order-status-change/order-status-change.page';

@Component({
  selector: 'app-scanQRPWA',
  templateUrl: 'scanQRPWA.page.html',
  styleUrls: ['scanQRPWA.page.scss']
})
export class ScanQRPWAPage {
  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;

  canvasElement: any;
  videoElement: any;
  canvasContext: any;
  scanActive: boolean = true;
  
  constructor(
    public storeService: StoreService, public swalService: SwalService, public loadingService: LoadingService,
    public modalController: ModalController
  ) 
  { }

  doRefresh() {
    window.location.reload();
  }

  ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
    this.canvasContext = this.canvasElement.getContext('2d');
    this.videoElement = this.video.nativeElement;
  }

  ionViewWillEnter() {
    this.scanActive = true;
    this.startScan();
  }
  ionViewWillLeave() {
    this.scanActive = false;
  }

  async startScan() {
    if (!this.scanActive) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
   
    this.videoElement.srcObject = stream;
    // Required for Safari
    this.videoElement.setAttribute('playsinline', true);
   
    await this.loadingService.present();
   
    this.videoElement.play();
    requestAnimationFrame(this.scan.bind(this));
  }
   
  async scan() {
    if (!this.scanActive) return;

    if (this.videoElement.readyState !== this.videoElement.HAVE_ENOUGH_DATA) {
      return requestAnimationFrame(this.scan.bind(this));
    }
    await this.loadingService.dismiss();
 
    this.canvasElement.height = this.videoElement.videoHeight;
    this.canvasElement.width = this.videoElement.videoWidth;
 
    this.canvasContext.drawImage(
      this.videoElement,
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );
    const imageData = this.canvasContext.getImageData(
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert'
    });
 
    if (code && code.data) {
      try {
        const scanResult: ticketQRCode = JSON.parse(code.data);
        const store = this.storeService.getCurrentStore();
  
        if (scanResult.storeId !== store.id || !scanResult.orderId || !scanResult.orderType) {
          throw('JSON ERROR');
        }
        
        const modal = await this.modalController.create({
          component: OrderStatusChangePage,
          componentProps: {
            orderId: scanResult.orderId,
            orderType: scanResult.orderType,
            store: store
          }
        });
        await modal.present();
        await modal.onWillDismiss();
        requestAnimationFrame(this.scan.bind(this));

      } catch (e) {
        await this.swalService.showGeneric(ERROR_INVALID_QR, 'error');
        return requestAnimationFrame(this.scan.bind(this));
      }

    } else if (this.scanActive) {
      requestAnimationFrame(this.scan.bind(this));
    }
  }
}
