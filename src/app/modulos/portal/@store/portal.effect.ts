import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store, Action } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';

import * as store from 'app/@compartidos/store';
import { APIError } from 'app/@compartidos/models';
import { PortalApiService } from '../portal.api.service';
import { Usuario } from '../usuario';
import * as configuracionActions from './configuracion.action';
import * as storePortal from './index';
import * as localidadesActions from './localidades.action';
import * as perfilesAction from './perfiles.action';
import * as usuarioAction from './usuario.action';
import { isEmpty } from 'app/@compartidos/utils/helpers';
import { Configuracion } from 'app/modulos/portal/@models/configuracion.model';

@Injectable()
export class PortalEffect {
  /**
   * Inicio sesion effect
   */
  @Effect()
  public perfiles$: Observable<Action> = this.actions$
    .ofType(perfilesAction.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [perfilesAction.LoadAction, store.State]) => action.payload)
    .switchMap(() => {
      return this.portalApiService
        .perfiles()
        .map(res => {
          return new perfilesAction.LoadSuccessAction(res);
        })
        .catch((error: APIError) => of(new perfilesAction.LoadFailAction(error.mensaje)));
    });

  @Effect()
  public configuracion$: Observable<Action> = this.actions$
    .ofType(configuracionActions.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .switchMap(() => {
      return this.portalApiService
        .configuracionGeneral()
        .map(res => new configuracionActions.LoadSuccessAction(new Configuracion(res)))
        .catch((error: APIError) => of(new configuracionActions.LoadFailAction(error.mensaje)));
    });

  @Effect()
  public usuario$: Observable<Action> = this.actions$
    .ofType(usuarioAction.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [usuarioAction.LoadAction, store.State]) => action.payload)
    .switchMap(() => {
      return this.portalApiService
        .usuario()
        .map(res => {
          return new usuarioAction.LoadSuccessAction(new Usuario(res));
        })
        .catch((error: APIError) => of(new usuarioAction.LoadFailAction(error.mensaje)));
    });

  @Effect()
  public paises$: Observable<Action> = this.actions$
    .ofType(localidadesActions.ActionTypes.LOAD_PAISES)
    .withLatestFrom(this.appState$)
    .map(([_action, state]: [localidadesActions.LoadPaisesAction, store.State]) => state.portal)
    .switchMap((portal: storePortal.State) => {
      const { paises } = portal.localidades.data;
      if (isEmpty(paises)) {
        return this.portalApiService
          .paises()
          .map(res => new localidadesActions.LoadPaisesSuccessAction(res))
          .catch(res => of(new localidadesActions.LoadFailedAction(res)));
      }
      return Observable.of(new localidadesActions.LoadPaisesSuccessAction(paises));
    });

  @Effect()
  public departamentos$: Observable<Action> = this.actions$
    .ofType(localidadesActions.ActionTypes.LOAD_DEPARTAMENTO)
    .withLatestFrom(this.appState$)
    .map(
      ([_action, state]: [localidadesActions.LoadDepartametoAction, store.State]) => state.portal
    )
    .switchMap((portal: storePortal.State) => {
      const { departamentos } = portal.localidades.data;
      if (isEmpty(departamentos)) {
        return this.portalApiService
          .departamentos()
          .map(res => new localidadesActions.LoadDepartametoSuccessAction(res))
          .catch(res => of(new localidadesActions.LoadFailedAction(res)));
      }
      return Observable.of(new localidadesActions.LoadDepartametoSuccessAction(departamentos));
    });

  public eliminarRepetidos = (arr: string[], cache = {}): string[] => {
    const repeated = {};
    return arr.filter(item => {
      if (repeated[item] || isEmpty(item)) {
        return false;
      }
      repeated[item] = true;
      return isEmpty(cache[item]);
    });
  };

  constructor(
    private actions$: Actions,
    private portalApiService: PortalApiService,
    private appState$: Store<store.State>
  ) {}
}
