import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { UpdateService } from './services/update/update.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private updateService: UpdateService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    this.updateService.checkForUpdates();  
    await this.platform.ready();
    this.statusBar.styleDefault();
    this.splashScreen.hide();
  }
}
