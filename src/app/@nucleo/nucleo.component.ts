import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as store from '../@compartidos/store';
import * as sesionActions from '../@compartidos/store/sesion.action';
import * as pageActions from '../@compartidos/store/page.action';

import { SESION_ACTUAL } from '../@compartidos/utils/consts';
import { CookieStorage } from '../@compartidos/utils/storage';
import { Sesion } from '../@compartidos/models';
import { NavigationEnd, NavigationStart, NavigationCancel, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AnalyticsService } from './analytics.service';

@Component({
  selector: 'app-core',
  template: `
    <div class="core"><router-outlet></router-outlet><notifier-container></notifier-container></div>
  `,
  styleUrls: ['./nucleo.component.scss']
})
export class NucleoComponent implements OnInit {
  private sesion$: Observable<Sesion> = this.appState$.select(store.getSesion);

  constructor(
    private appState$: Store<store.State>,
    private router: Router,
    private location: Location,
    private analytics: AnalyticsService
  ) {
    this.cargarSesion();
    this.bindRouter();
  }

  ngOnInit() {
    this.analytics.enableTrack();
    this.analytics.trackPageViews();
  }

  public cargarSesion() {
    const sesionActual = CookieStorage.get(SESION_ACTUAL);

    if (sesionActual) {
      this.appState$.dispatch(new sesionActions.RecoverAction(new Sesion(sesionActual)));
    }

    this.sesion$.subscribe((sesion: Sesion) => {
      if (sesion.token) {
        sesion.guardar();
      } else {
        sesion.eliminar();
      }
    });
  }

  public bindRouter() {
    this.router.events
      .filter(
        event =>
          event instanceof NavigationEnd ||
          event instanceof NavigationStart ||
          event instanceof NavigationCancel
      )
      .subscribe(event => {
        if (event instanceof NavigationStart) {
          this.appState$.dispatch(new pageActions.LoadAction());
        }
        if (event instanceof NavigationEnd) {
          this.appState$.dispatch(new pageActions.LoadSuccessAction(this.location.path()));
        }
      });
  }
}
