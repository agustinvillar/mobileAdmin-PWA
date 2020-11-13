import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BrowserService } from 'src/app/services/browser/browser.service';
import { MENOO_LOGO, TERMS_AND_CONDITIONS_URL, PRIVACY_POLICY_URL } from '../../services/constants.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  readonly MENOO_LOGO: string = MENOO_LOGO;

  constructor(private router: Router, public browserService: BrowserService) { }

  ngOnInit() {
  }

  login() {
    this.router.navigateByUrl('/tabs');
  }

  termsAndConditions() {
    this.browserService.showUrl(TERMS_AND_CONDITIONS_URL);
  }

  privacyPolicy() {
    this.browserService.showUrl(PRIVACY_POLICY_URL);
  }
}
