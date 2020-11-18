import { Component, ViewChild, ElementRef } from '@angular/core';
import jsQR from 'jsqr';

import { LoadingService } from 'src/app/services/loading/loading.service';
import { SwalService } from '../../services/swal/swal.service';
import { ERROR_TRY_AGAIN } from '../../services/errors.service';

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
  
  constructor(public swalService: SwalService, public loadingService: LoadingService) 
  { }

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
 
    if (code) {
      const scanResult = code.data;
      scanResult ?
        await this.swalService.showGeneric(scanResult, 'info') :
        await this.swalService.showGeneric(ERROR_TRY_AGAIN, 'error');
      this.startScan();
    } else if (this.scanActive) {
      requestAnimationFrame(this.scan.bind(this));
    }
  }
}
