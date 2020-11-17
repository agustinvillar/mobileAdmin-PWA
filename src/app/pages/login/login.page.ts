import { Component } from '@angular/core';

import { ERROR_LOGIN } from 'src/app/services/errors.service';
import { MENOO_LOGO, TERMS_AND_CONDITIONS_URL, PRIVACY_POLICY_URL } from 'src/app/services/constants.service';

import { AuthService } from 'src/app/services/auth/auth.service';
import { LoadingService } from 'src/app/services/loading/loading.service';
import { SwalService } from 'src/app/services/swal/swal.service';
import { BrowserService } from 'src/app/services/browser/browser.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  readonly MENOO_LOGO: string = MENOO_LOGO;
  email: string;
  password: string;

  constructor(
    public browserService: BrowserService, private authService: AuthService,
    private loadingService: LoadingService, private swalService: SwalService
  ) { }

  async login() {
    try {
      await this.loadingService.present();
      await this.authService.login(this.email, this.password);
    } catch(e) {
      await this.swalService.showGeneric(ERROR_LOGIN, 'error');
    }
    this.loadingService.dismiss();
  }

  termsAndConditions() {
    this.browserService.showUrl(TERMS_AND_CONDITIONS_URL);
  }

  privacyPolicy() {
    this.browserService.showUrl(PRIVACY_POLICY_URL);
  }
}
