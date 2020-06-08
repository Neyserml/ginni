import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { IListaContratos } from '../@interface/contratos.interface';
import { IinicioEvaluacion } from '../@interface/evaluacion-asociado.interface';
import { EvaluacionApiService } from '../evaluacion-api.service';
import * as contratosAction from './contratos.action';
import * as documentosPersonasAction from './documentos-personas.action';
import * as validarInicioAction from './validar-inicio.action';
import * as buscarRespaldoAction from './buscar-respaldo.action';
import { APIError } from 'app/@compartidos/models';
import * as store from 'app/@compartidos/store';
import {
  IGaranteDetalle,
  IBuscarGarante
} from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/garante.interface';
import { ObtenerGarante } from 'app/modulos/logistica-vehicular/detalle/evaluacion/@models/garante.model';
import * as simuladorGuardarAction from './simulador-guardar.action';
import * as seguimientoAction from './seguimiento.action';
import { ISeguimientoRequest } from '../@interface/seguimiento.interface';

@Injectable()
export class EvaluacionCrediticiaEffect {
  /**
   * Validar Inicio Evaluacion
   */
  @Effect()
  public validarInicioEvaluacion$: Observable<Action> = this.actions$
    .ofType(validarInicioAction.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [validarInicioAction.LoadAction, store.State]) => action.payload)
    .switchMap((payload: string) => {
      return this.evaluacionApiService
        .validarInicioEvaluacion(payload)
        .map((res: IinicioEvaluacion) => new validarInicioAction.LoadSuccessAction(res))
        .catch((error: APIError) => of(new validarInicioAction.LoadFailAction(error.mensaje)));
    });

  /**
   * Contratos
   */
  @Effect()
  public contratos$: Observable<Action> = this.actions$
    .ofType(contratosAction.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [contratosAction.LoadAction, store.State]) => action.payload)
    .switchMap((payload: string) => {
      return this.evaluacionApiService
        .contratos(payload)
        .map((res: IListaContratos[]) => new contratosAction.LoadSuccessAction(res))
        .catch((error: APIError) => of(new contratosAction.LoadFailAction(error.mensaje)));
    });

  /**
   * Documentos por Persona
   */
  @Effect()
  public documentosPersona$: Observable<Action> = this.actions$
    .ofType(documentosPersonasAction.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [documentosPersonasAction.LoadAction, store.State]) => action.payload)
    .switchMap((payload: string) => {
      return this.evaluacionApiService
        .documentosPersonas(payload)
        .map(res => new documentosPersonasAction.LoadSuccessAction(res))
        .catch((error: APIError) => of(new documentosPersonasAction.LoadFailAction(error.mensaje)));
    });

  /**
   *Buscar respaldo
   */
  @Effect()
  public buscarRespaldo$: Observable<Action> = this.actions$
    .ofType(buscarRespaldoAction.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [buscarRespaldoAction.LoadAction, store.State]) => action.payload)
    .switchMap((payload: IBuscarGarante) =>
      this.evaluacionApiService
        .buscarRespaldo(payload)
        .map(
          (res: IGaranteDetalle) =>
            new buscarRespaldoAction.LoadSuccessAction(new ObtenerGarante(res))
        )
        .catch((error: APIError) => of(new buscarRespaldoAction.LoadFailAction(error.mensaje)))
    );

  /**
   * Guardar evaluación con financiamiento
   */
  @Effect()
  public guardarSimulador$: Observable<Action> = this.actions$
    .ofType(simuladorGuardarAction.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [simuladorGuardarAction.LoadAction, store.State]) => action.payload)
    .switchMap((idBloqueContrato: string) => {
      return this.evaluacionApiService
        .aceptarCambiofinanciamiento(idBloqueContrato)
        .map(res => new simuladorGuardarAction.LoadSuccessAction(res))
        .catch((error: APIError) => of(new simuladorGuardarAction.LoadFailAction(error.mensaje)));
    });

  /**
   * Seguimiento
   */
  @Effect()
  public seguimiento$: Observable<Action> = this.actions$
    .ofType(seguimientoAction.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [seguimientoAction.LoadAction, store.State]) => action.payload)
    .switchMap((payload: ISeguimientoRequest) => {
      return this.evaluacionApiService
        .listarSeguimiento(payload)
        .map(res => new seguimientoAction.LoadSuccessAction(res))
        .catch((error: APIError) => of(new seguimientoAction.LoadFailAction(error.mensaje)));
    });

  constructor(
    private actions$: Actions,
    private evaluacionApiService: EvaluacionApiService,
    private appState$: Store<store.State>
  ) {}
}
