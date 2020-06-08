import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { State, getSesion } from 'app/@compartidos/store';

@Injectable()
export class PortalGuard implements CanActivate {
  private token;

  constructor(private router: Router, private store: Store<State>) {
    this.subscribeToTokenChanges();
  }

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkLogin();
  }

  private subscribeToTokenChanges() {
    this.store.select(getSesion).subscribe(this.setToken);
  }

  private setToken = sesion => {
    if (sesion) {
      this.token = !!sesion.token;
    }
  };

  checkLogin() {
    if (this.token) {
      return true;
    }
    this.router.navigate(['/inicio-sesion']);
    return false;
  }
}
