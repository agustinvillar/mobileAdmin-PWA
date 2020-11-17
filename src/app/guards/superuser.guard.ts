import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { UserService } from '../services/user/user.service';

import { AuthGuard } from './auth.guard';

@Injectable({
  providedIn: 'root'
})
export class SuperuserGuard implements CanLoad {
  constructor(
    private router: Router, private userService: UserService, private authGuard: AuthGuard
  ) {}

  async canLoad(): Promise<boolean> {
    const authGuardRes = await this.authGuard.canLoad().toPromise();
    if (!authGuardRes) return false;

    const user = this.userService.getCurrentUser(); 
    if (user && user.isSuperUser) return true;

    this.router.navigateByUrl('/tabs', { replaceUrl:true });
    return false;
  }
}
