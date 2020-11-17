import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { take } from 'rxjs/operators';

import { AngularFireAuth } from "@angular/fire/auth";
import { UserService } from './services/user/user.service';
import { LoadingService } from './services/loading/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private router: Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private afAuth: AngularFireAuth,
    private userService: UserService,
    private loadingService: LoadingService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    this.statusBar.styleDefault();
    this.splashScreen.hide();
    
    await this.loadingService.present();
    const authData = await this.afAuth.authState.pipe(take(1)).toPromise();
    authData ? 
      await this.userService.initUser(authData) :
      await this.router.navigateByUrl('/login');
    
    this.loadingService.dismiss();
  }
}
