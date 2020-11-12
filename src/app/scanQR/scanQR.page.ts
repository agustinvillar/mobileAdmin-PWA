import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';

@Component({
  selector: 'app-scanQR',
  templateUrl: 'scanQR.page.html',
  styleUrls: ['scanQR.page.scss']
})
export class ScanQRPage {

  constructor(private qrScanner: QRScanner) {}
  
  ionViewWillEnter() {
    this.scan();
  }
  ionViewDidLeave() {
    this.stopScanning();
  }
  
  scan() {
    this.qrScanner.prepare().then((status: QRScannerStatus) => {
      if (status.authorized) {
        // start scanning
        let scanSub = this.qrScanner.scan().subscribe((text: string) => {
          scanSub.unsubscribe(); // stop scanning
          console.log('SCAN OK', text) 
        });        
        this.qrScanner.show();
      } else {
        this.openCameraSettings()
      }
    }).catch((e) => {
      console.log('Error: ', JSON.stringify(e));
      e.name === 'CAMERA_ACCESS_DENIED' ? 
        this.openCameraSettings() :
        // this.swalProvider.showInfo(ERROR_TRY_AGAIN, 'error');
        console.log('ERROR_TRY_AGAIN')      
    });
  }
  
  private stopScanning() {
    this.qrScanner.hide();
    this.qrScanner.destroy();
  }

  async openCameraSettings() {
    // await this.swalProvider.showInfo(ERROR_ALLOW_CAMERA, 'error');
    console.log('ERROR_ALLOW_CAMERA') 
    this.qrScanner.openSettings();
  }

}
