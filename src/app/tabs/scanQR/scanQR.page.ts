import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { SwalService } from '../../services/swal/swal.service';
import { SEMI_BORDER_BOX_IMG } from '../../services/constants.service';
import { ERROR_TRY_AGAIN, ERROR_ALLOW_CAMERA } from '../../services/errors.service';

@Component({
  selector: 'app-scanQR',
  templateUrl: 'scanQR.page.html',
  styleUrls: ['scanQR.page.scss']
})
export class ScanQRPage {
  readonly SEMI_BORDER_BOX_IMG: string = SEMI_BORDER_BOX_IMG;
  
  constructor(private qrScanner: QRScanner, private swalService: SwalService) 
  { }

  ionViewWillEnter() {
    this.scan();
  }
  ionViewDidLeave() {
    this.stopScanning();
  }
  
  async scan() {
    try {
      const status: QRScannerStatus = await this.qrScanner.prepare();
      if (!status.authorized) return this.openCameraSettings();

      // start scanning
      let scanSub = this.qrScanner.scan().subscribe((text: string) => {
        scanSub.unsubscribe(); // stop scanning
        this.swalService.showGeneric(text, 'success');   
      });        
      this.qrScanner.show();
    } catch(e) {
      e.name === 'CAMERA_ACCESS_DENIED' ? 
        this.openCameraSettings() :
        this.swalService.showGeneric(ERROR_TRY_AGAIN, 'error');      
    }
  }
  
  private stopScanning() {
    this.qrScanner.hide();
    this.qrScanner.destroy();
  }

  async openCameraSettings() {
    await this.swalService.showGeneric(ERROR_ALLOW_CAMERA, 'error');
    this.qrScanner.openSettings();
  }
}
