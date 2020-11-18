import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ROUTE_TABS } from './../services/constants.service';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {
  constructor(private router: Router, private authService: AuthService) { }

  canLoad(): Observable<boolean> {  
    return this.authService.isAuthenticated.pipe(
      filter(val => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map(isAuthenticated => {
        if (isAuthenticated) {
          // Directly open inside area       
          this.router.navigateByUrl(`/${ROUTE_TABS}`, { replaceUrl: true });
        } else {          
          // Simply allow access to the login
          return true;
        }
      })
    );
  }
}
