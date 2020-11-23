import { Injectable } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class BrowserService {

  constructor(
    private iab: InAppBrowser
  ) { }

  async showUrl(url: string) {
    const options: InAppBrowserOptions = { 
      zoom: 'no', 
      hardwareback: 'no', 
      location: 'no', 
      toolbar: 'yes', 
      toolbarposition: 'top' 
    };
    const browser = this.iab.create(url, '', options);    
    const subExit = browser.on('exit').subscribe(() => { 
      subExit.unsubscribe();
    });
    const loadStop = browser.on('loadstop').subscribe(() => { 
      loadStop.unsubscribe();
    });
  }
}
