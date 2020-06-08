import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { esMobile, isSafari } from 'app/@compartidos/utils/helpers';
import { IDetallePersona } from 'app/@compartidos/interfaces/detalle.interface';
import { TipoEstado } from 'app/modulos/logistica-vehicular/detalle/detalle.enum';

declare global {
  interface Window {
    TweenLite: any;
    Bounce: any;
  }
}

@Component({
  selector: 'ginni-header-asociado',
  templateUrl: './header-detalle.component.html'
})
export class HeaderDetalleComponent implements OnInit, OnDestroy {
  @Input() fechaActualizacion: string;
  @Input() idBloqueContrato: string;
  @Input() categoria: string;
  @Input() datosAsociados: IDetallePersona[];
  @Input() numeroDias: number;
  @Input() personaActualIndex: number;
  @Input() puedeEditar = false;
  @Input() mensajesSistema: Array<string>;

  @Output() cambiarAsociado = new EventEmitter();

  public _esMobile = esMobile;
  public _isSafari = isSafari;
  public activeMasDatos = false;
  public browserIsSafari: boolean;
  public datosAsociadoHeight = 80;
  private path: string[];
  public percentCircle = 0; // 12, 24, 34, 44, 54, 64, 75, 87, 100
  public showAsociadoDesktop = true;

  private subscriptions: Subscription[] = [];

  get datosAsociadoActual(): IDetallePersona {
    return this.datosAsociados[this.personaActualIndex];
  }

  get numeroDiasAsociado() {
    return this.numeroDias + ' ' + (this.numeroDias === 1 ? 'día' : 'días');
  }

  constructor(private router: Router) {}

  public ngOnInit() {
    window.scroll(0, 0);
    this.personaActualIndex = 0;
    this.showAsociadoDesktop = this.showAsociadoHeader();
    this.browserIsSafari = this._isSafari();
    this.path = this.router.url.split('/');
  }

  public ngOnDestroy() {
    this.desregistrarEventos();
  }

  public abrirEditar() {
    const ruta = window.location.href;
    if (ruta.endsWith(TipoEstado.Aprobados)) {
      this.router.navigate([
        `/portal/${this.path[2]}/detalle/${this.idBloqueContrato}/ver/${this.datosAsociadoActual.idPersona}`
      ]);
    } else {
      this.router.navigate([
        `/portal/${this.path[2]}/detalle/${this.idBloqueContrato}/editar/${this.datosAsociadoActual.idPersona}`
      ]);
    }
  }

  public activeIfNotSafari() {
    return this.browserIsSafari ? this.activeMasDatos : false;
  }

  public showAsociadoHeader() {
    return this._esMobile() ? this.activeMasDatos : true;
  }

  public toggleMasDatos() {
    this.activeMasDatos = !this.activeMasDatos;
    this.showAsociadoDesktop = this.showAsociadoHeader();
  }

  private desregistrarEventos() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
