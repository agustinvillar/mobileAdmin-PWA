import { Injectable } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { LoadingService } from 'src/app/services/loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class BrowserService {

  constructor(
    private iab: InAppBrowser, protected loadingService: LoadingService
  ) { }

  async showUrl(url: string) {
    await this.loadingService.present();
    const options: InAppBrowserOptions = { 
      zoom: 'no', 
      hardwareback: 'no', 
      location: 'no', 
      toolbar: 'yes', 
      toolbarposition: 'top' 
    };
    const browser = this.iab.create(url, '_blank', options);    
    const subExit = browser.on('exit').subscribe(() => { 
      subExit.unsubscribe();
    });
    const loadStop = browser.on('loadstop').subscribe(() => { 
      this.loadingService.dismiss(); 
      loadStop.unsubscribe();
    });
  }
}
