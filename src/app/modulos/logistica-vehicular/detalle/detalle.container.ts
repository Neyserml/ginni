import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import * as store from './@store';
import { getAsociado, getAsociadoLoading, getAsociadoFailed } from './@store';
import {
  getSimuladorGuardar,
  getSimuladorGuardarLoading,
  getSimuladorGuardarFailed
} from './evaluacion/@store';
import { DetalleSandbox } from './detalle.sandbox';
import { DetalleApiService } from './detalle-api.service';
import * as AsociadoAction from './@store/detalle.action';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { getIdBloqueContrato } from 'app/@compartidos/utils/helpers';
import { isNullOrUndefined } from 'util';
import { EvaluacionApiService } from 'app/modulos/logistica-vehicular/detalle/evaluacion/evaluacion-api.service';
import { dateFormat } from 'app/@compartidos/utils/helpers';
import { IDetallePersona } from 'app/@compartidos/interfaces/detalle.interface';
import { environment } from 'environments/environment';

@Component({
  selector: 'ginni-detalle',
  templateUrl: './detalle.container.html',
  encapsulation: ViewEncapsulation.None
})
export class DetalleContainer implements OnInit, OnDestroy {
  public accesoEditar: boolean;
  public subscriptions: Subscription[] = [];
  public fechaActualizacion: string;
  public categoria: string;
  public numeroDias: number;
  public idBloqueContrato: string;
  public datosAsociados: IDetallePersona[];
  public personaActualIndex = 0;
  public mensajesSistema: Array<string>;
  public tabs = [
    {
      icon: 'coins-pile',
      link: 'crediticia',
      text: 'Evaluación Crediticia'
    } /*,
    {
      icon: 'coins-pile',
      link: 'pedido',
      text: 'Pedido'
    }*/
  ];

  // Observadores
  public asociados$ = this.appState$.select(getAsociado);
  public asociadoLoading$ = this.appState$.select(getAsociadoLoading);
  public asociadoFailed$ = this.appState$.select(getAsociadoFailed);
  public guardarSimulador$ = this.appState$.select(getSimuladorGuardar);
  public guarSimuladorLoading$ = this.appState$.select(getSimuladorGuardarLoading);
  public guarSimuladorFailed$ = this.appState$.select(getSimuladorGuardarFailed);
  public loading: boolean;
  public _dateFormat = dateFormat;

  constructor(
    public portalSandbox: PortalSandbox,
    public asociadoSandbox: DetalleSandbox,
    private evaluacionApiService: EvaluacionApiService,
    private asociadoApiService: DetalleApiService,
    private router: Router,
    public appState$: Store<store.State>
  ) {}

  ngOnInit() {
    const { accesoEditar } = this.portalSandbox.getRestriccion();
    this.accesoEditar = accesoEditar;
    this.loading = true;
    this.idBloqueContrato = getIdBloqueContrato();
    window.scroll(0, 0);
    this.appState$.dispatch(new AsociadoAction.LoadAction(this.asociadoSandbox.obtenerId()));

    this.registrarEventos();
    if (!environment.testing) {
      this.router.navigate([this.portalSandbox.getUrlWithoutParams()], {
        replaceUrl: true
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.asociadoApiService.guardarMensajesSistema([]);
    this.appState$.dispatch(new AsociadoAction.ResetAction(this.asociadoSandbox.obtenerId()));
  }

  private registrarEventos() {
    this.subscriptions.push(
      this.asociadoApiService.obtenerMensajesSistema$.subscribe(
        (mensajesSistema: Array<string>) => {
          // Cuando se guarda el garante o Respaldo
          if (mensajesSistema) {
            this.mensajesSistema = mensajesSistema;
          }
        }
      ),
      this.evaluacionApiService
        .validarInicioEvaluacion(this.idBloqueContrato)
        .subscribe(validarInicio => {
          if (validarInicio && validarInicio.iniciada) {
            this.servicioMensajesSistema();
          }
        }),
      this.asociados$.subscribe(asociados => {
        this.loading = true;
        if (!isNullOrUndefined(asociados)) {
          this.loading = false;
          this.fechaActualizacion = dateFormat(asociados.fechaActualizacion);
          this.categoria = asociados.segmento;
          this.datosAsociados = asociados.personas;
          this.asociadoApiService.actualizarAsociadoPersonaDatos(asociados);
          this.numeroDias = asociados.numeroDias;
        }
      }),
      this.guardarSimulador$.subscribe(simulador => {
        this.loading = true;
        if (simulador) {
          this.loading = false;
          this.categoria = simulador.nuevaCategoria;
        }
      })
    );
  }

  private servicioMensajesSistema() {
    this.asociadoApiService
      .asociadoMensajesSistema(this.idBloqueContrato)
      .subscribe((mensajesSistema: Array<string>) => {
        // Al cargar el container
        if (mensajesSistema) {
          this.mensajesSistema = mensajesSistema;
        }
      });
  }

  public cambiarAsociado() {
    if (this.personaActualIndex < this.datosAsociados.length - 1) {
      this.personaActualIndex += 1;
      this.asociadoApiService.personaActualIndex(this.personaActualIndex);
    } else {
      this.personaActualIndex = 0;
    }
  }
}
