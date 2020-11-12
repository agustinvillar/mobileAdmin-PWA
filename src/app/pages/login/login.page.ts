import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MENOO_LOGO } from '../../services/constants/constants.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  readonly MENOO_LOGO: string = MENOO_LOGO;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.router.navigateByUrl('/tabs');
  }

}
