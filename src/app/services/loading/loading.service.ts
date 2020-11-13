import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  currentLoader;

  constructor(public loadingCtrl: LoadingController) { }

  async present(message?: string) {
    if (!this.currentLoader) {
      this.currentLoader = await this.loadingCtrl.create({ 
        message: message
      });
      await this.currentLoader.present();
    }
  }

  async dismiss() {
    this.currentLoader && await this.currentLoader.dismiss(); 
    this.currentLoader = null;
  }
}
