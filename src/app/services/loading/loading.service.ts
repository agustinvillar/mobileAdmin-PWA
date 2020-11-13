import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  currentLoader;

  constructor(public loadingCtrl: LoadingController) { }

  async present(message?: string, logoAnimation?: boolean) {
    if (!this.currentLoader) {
      let opts = {};
      if (logoAnimation === false) { 
        opts = {
          content: message
        }    
      } else {
        opts = {
          spinner: 'hide',
          content: this.getLogoAnimation(),
          cssClass: 'logo-animation-loader'
        }      
      }
      this.currentLoader = await this.loadingCtrl.create(opts);
      await this.currentLoader.present();
    }
  }

  async dismiss() {
    this.currentLoader && await this.currentLoader.dismiss(); 
    this.currentLoader = null;
  }

  getLogoAnimation() {
    return '<div id="iso-animation" class="viewport animate">'+
        '<div class="holder">'+
            '<div class="logo-scale">'+
                '<div class="logo animated">'+
                    '<div class="letter animated"></div>'+
                    '<div class="tools-holder animated">'+
                        '<div class="tools"></div>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>';
  }
}
