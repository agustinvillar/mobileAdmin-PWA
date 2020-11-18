import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
export class LoginPage implements OnInit {
  readonly MENOO_LOGO: string = MENOO_LOGO;
  credentials: FormGroup;

  constructor(
    private formBuilder: FormBuilder, public browserService: BrowserService, private authService: AuthService,
    private loadingService: LoadingService, private swalService: SwalService
  ) { }

  ngOnInit() {
    this.credentials = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async login() {
    try {
      await this.loadingService.present();
      await this.authService.login(this.credentials.value);
    } catch(e) {
      await this.swalService.showGeneric(ERROR_LOGIN, 'error');
    }
    this.loadingService.dismiss();
  }

  get email() {
    return this.credentials.get('email');
  }  
  get password() {
    return this.credentials.get('password');
  }

  termsAndConditions() {
    this.browserService.showUrl(TERMS_AND_CONDITIONS_URL);
  }

  privacyPolicy() {
    this.browserService.showUrl(PRIVACY_POLICY_URL);
  }
}
