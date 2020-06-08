import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { DetalleApiService } from '../detalle-api.service';

import * as store from 'app/@compartidos/store';
import * as detalleAction from './detalle.action';
import * as laboralActions from './laboral.action';
import * as personalActions from './personal.action';
import * as personasRelacionadasAction from './personas-relacionadas.action';
import * as ingresosActions from './ingresos.action';

import { APIError } from 'app/@compartidos/models';
import { Detalle } from '../@models/detalle.model';
import { IInformacionPersonalResponse, PersonalModel } from '../@models/personal.model';
import { LaboralModel } from '../@models/laboral.model';
import {
  IBloqueContratoResponse,
  IDetalleCabeceraResponse
} from 'app/@compartidos/interfaces/detalle.interface';
import { TiposPersona } from '../detalle.enum';

@Injectable()
export class DetalleEffect {
  /**
   * Datos del Asociado
   */
  @Effect()
  public asociados$: Observable<Action> = this.actions$
    .ofType(detalleAction.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .switchMap(([action]: [detalleAction.LoadAction, store.State]) => {
      const payload = action.payload;
      return this.asociadoApiService
        .asociado(payload)
        .mergeMap((bloqueContratoRes: IBloqueContratoResponse) => {
          const observable: Observable<Action> = new Observable(observer => {
            this.asociadoApiService.asociadoCabecera(bloqueContratoRes.personasId).subscribe(
              (asociadoCabeceraRes: IDetalleCabeceraResponse) => {
                const asociado = new Detalle(bloqueContratoRes, asociadoCabeceraRes);

                observer.next(new detalleAction.LoadSuccessAction({ id: payload, data: asociado }));
              },
              (error: APIError) => {
                observer.next(new detalleAction.LoadFailAction(error.mensaje));
              }
            );
          });

          return observable;
        })
        .catch((error: APIError) => of(new detalleAction.LoadFailAction(error.mensaje)));
    });

  /**
   * En laboral effect
   */
  @Effect()
  public laboral$: Observable<Action> = this.actions$
    .ofType(laboralActions.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [laboralActions.LoadAction, store.State]) => action.payload)
    .switchMap((payload: string) => {
      return this.asociadoApiService
        .informacionLaboral(payload)
        .map(res => new laboralActions.LoadSuccessAction(new LaboralModel(res)))
        .catch((error: APIError) => of(new laboralActions.LoadFailAction(error.mensaje)));
    });

  /**
   * En personal effect
   */
  @Effect()
  public personal$: Observable<Action> = this.actions$
    .ofType(personalActions.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [personalActions.LoadAction, store.State]) => action.payload)
    .switchMap(payload => {
      const service =
        payload.tipoPersona === TiposPersona.NATURAL
          ? 'informacionPersonal'
          : 'informacionAsociado';
      return this.asociadoApiService[service](payload.idPersona)
        .map((res: IInformacionPersonalResponse) => {
          return new personalActions.LoadSuccessAction(new PersonalModel(res));
        })
        .catch((error: APIError) => of(new personalActions.LoadFailAction(error.mensaje)));
    });

  /**
   * En Personas Relacionadas effect
   */
  @Effect()
  public personasRelacionadas$: Observable<Action> = this.actions$
    .ofType(personasRelacionadasAction.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [personasRelacionadasAction.LoadAction, store.State]) => action.payload)
    .switchMap((payload: string) => {
      return this.asociadoApiService
        .personasRelacionadas(payload)
        .map(res => new personasRelacionadasAction.LoadSuccessAction(res))
        .catch((error: APIError) =>
          of(new personasRelacionadasAction.LoadFailAction(error.mensaje))
        );
    });

  /**
   * En Ingresos effect
   */

  @Effect()
  public ingresos$: Observable<Action> = this.actions$
    .ofType(ingresosActions.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [ingresosActions.LoadAction, store.State]) => action.payload)
    .switchMap(payload => {
      return this.asociadoApiService
        .obtenerIngresos(payload)
        .map(res => new ingresosActions.LoadSuccessAction(res))
        .catch((error: APIError) => of(new ingresosActions.LoadFailAction(error.mensaje)));
    });

  constructor(
    private actions$: Actions,
    private asociadoApiService: DetalleApiService,
    private appState$: Store<store.State>
  ) {}
}
