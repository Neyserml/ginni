import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { APIError, Sesion } from 'app/@compartidos/models';
import * as store from 'app/@compartidos/store';
import { CookieStorage } from 'app/@compartidos/utils/storage';
import { SESION_ACTUAL } from 'app/@compartidos/utils/consts';
import { URL_SESION_FINALIZADA } from 'app/@compartidos/utils/consts';
import {
  getPerfilesLoading,
  getPerfilesFailed,
  getPerfiles,
  getUsuario,
  getUsuarioFailed,
  getUsuarioLoading,
  getPortalLoading,
  getUsuarioLoaded,
  getLocalidades,
  getPortalFailed
} from './@store';
import { PortalSandbox } from './portal.sandbox';
import { IMenuItem } from 'app/@compartidos/utils/perfiles-items';
import { BANDEJA_TRABAJO } from './portal.enum';
import * as sesionAction from 'app/@compartidos/store/sesion.action';
import { Usuario } from './usuario';
import { isNotEmpty } from '../../@compartidos/utils/helpers';
import * as usuarioAction from 'app/modulos/portal/@store/usuario.action';

@Component({
  selector: 'ginni-portal',
  template: `
    <div class="portal-container" *ngIf="usuario?.perfil">
      <ginni-modal-expiracion
        [(show)]="modalExpiracion"
        [cuentaRegresiva]="cuentaRegresivaModal"
        (continuarSesion)="continuarSesion()"
      ></ginni-modal-expiracion>
      <ginni-cargando
        [ginni]="true"
        [loading]="(portalLoading$ | async) || loading"
        [failed]="portalFailed$ | async"
        className="fixed"
      >
        <ginni-header
          [(activeMenu)]="activeMenu"
          [usuario]="portalSandbox.usuario"
          (cerrarSesion)="cerrarSesion()"
        ></ginni-header>
        <div class="portal-container-page">
          <ginni-pagina id="main-page">
            <ginni-sidebar
              [(activeMenu)]="activeMenu"
              [activeSubmenu]="activeSubmenu"
              [showRouterBack]="showRouterBack"
              (routerBack)="routerBack()"
              (clickedRoute)="clickedRoute()"
              [menu]="portalSandbox.menu"
            ></ginni-sidebar>
            <router-outlet></router-outlet>
          </ginni-pagina>
        </div>
      </ginni-cargando>
    </div>
  `,
  styleUrls: ['./portal.container.scss']
})
export class PortalContainer implements OnInit, OnDestroy {
  public activeMenu = false;
  public activeSubmenu = false;
  public showRouterBack = false;
  private timeSession: number;
  public cuentaRegresivaModal = 0;
  public modalExpiracion = false;
  public loading: boolean;
  public modalInterval;

  private sesion$ = this.appState$.select(store.getSesion);
  private sesion = new Sesion();

  public perfilesLoading$ = this.appState$.select(getPerfilesLoading);
  public perfilesFailed$ = this.appState$.select(getPerfilesFailed);
  public perfiles$ = this.appState$.select(getPerfiles);

  public path$ = this.appState$.select(store.getPath);

  public usuarioLoading$ = this.appState$.select(getUsuarioLoading);
  public usuarioFailed$ = this.appState$.select(getUsuarioFailed);
  public usuario$ = this.appState$.select(getUsuario);
  public usuarioLoaded$ = this.appState$.select(getUsuarioLoaded);
  public usuario;
  public localidades$ = this.appState$.select(getLocalidades);

  public portalLoading$ = this.appState$.select(getPortalLoading);
  public portalFailed$ = this.appState$.select(getPortalFailed);

  private subscriptions: Subscription[] = [];

  private desregistrarEventos() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.timeSession) {
      clearInterval(this.timeSession);
    }
    if (this.modalInterval) {
      clearInterval(this.modalInterval);
    }
  }

  private registrarEventos() {
    this.subscriptions.push(
      this.sesion$.subscribe((sesion: Sesion) => {
        if (sesion && isNotEmpty(sesion)) {
        } else {
          this.loading = false;
          this.appState$.dispatch(new sesionAction.ExpireAction());
          this.appState$.dispatch(new sesionAction.LogoutAction());
          this.router.navigate(URL_SESION_FINALIZADA);
          localStorage.clear();
        }
      }),
      this.perfiles$.subscribe(perfiles => {
        if (perfiles) {
          this.portalSandbox.actualizarPerfil(perfiles);
          if (perfiles.menu.length === 0) {
            this.router.navigate(['/portal/pagina-en-construccion']);
          }
          this.portalSandbox.setTitle();
          this.portalSandbox.updateBreadcrumbs();
        }
      }),
      this.localidades$.subscribe(localidades => {
        if (localidades.departamentos && localidades.paises) {
          this.portalSandbox.handleLocalidades(localidades);
        }
      }),
      this.perfilesFailed$.subscribe((error: APIError) => {
        if (error) {
          this.sesion.eliminar();
        }
      }),
      this.usuario$.subscribe((usuario: Usuario) => {
        if (usuario.nombresPersona !== '') {
          this.usuario = usuario;
          this.portalSandbox.usuario = usuario;
        }
      }),
      this.usuarioFailed$.subscribe((error: APIError) => {
        if (error) {
          this.sesion.eliminar();
        }
      }),
      this.path$.subscribe(path => {
        this.redirectBandeja();
        this.reviewRoute();
        if (path) {
          this.portalSandbox.updateBreadcrumbs();
        }
      })
    );
  }

  constructor(
    private router: Router,
    private appState$: Store<store.State>,
    public portalSandbox: PortalSandbox,
    public location: Location
  ) {}

  public clickedRoute(): void {
    localStorage.removeItem('bandeja');
  }

  public continuarSesion() {
    const sesionActual = CookieStorage.get(SESION_ACTUAL);
    this.modalExpiracion = false;
    this.cuentaRegresivaModal = 0;
    clearInterval(this.modalInterval);
    this.appState$.dispatch(new sesionAction.RefreshAction(sesionActual));
  }

  ngOnInit() {
    this.appState$.dispatch(new usuarioAction.LoadAction());
    this.loading = false;
    this.registrarEventos();
    this.reviewRoute();
    this.redirectBandeja();
  }

  ngOnDestroy(): void {
    this.desregistrarEventos();
  }

  private redirectBandeja() {
    if (this.router.url === '/portal') {
      const menuBandeja = this.portalSandbox.menu.filter(
        (menu: IMenuItem) => menu.nombre === BANDEJA_TRABAJO
      )[0];
      this.router.navigate([menuBandeja.url]);
    }
  }

  private reviewRoute() {
    this.portalSandbox.setTitle();
    this.handleSubmenu();
  }

  private handleSubmenu() {
    this.showRouterBack = this.router.url.split('/').length > 3;
  }

  public routerBack() {
    const breadcrumbs = this.portalSandbox.breadcrumbs;
    const urlBack = breadcrumbs[breadcrumbs.length - 2].url;

    this.router.navigate([urlBack], {
      replaceUrl: true
    });
  }

  public cerrarSesion() {
    this.loading = true;
    this.appState$.dispatch(new sesionAction.LogoutAction());
  }
}
