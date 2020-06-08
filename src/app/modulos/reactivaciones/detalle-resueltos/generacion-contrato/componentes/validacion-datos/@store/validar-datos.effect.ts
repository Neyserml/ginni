import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import * as store from 'app/@compartidos/store';
import * as datosPersonaActions from './obtener-datos-persona.action';

import { APIError } from 'app/@compartidos/models';
import { ValidacionDatosService } from '../validacion.service';
import { DatosPersona } from '../@model/datos-persona.model';

@Injectable()
export class ValidarDatosEffect {
  /**
   * Datos del Asociado
   */
  @Effect()
  public datosPersonales$: Observable<Action> = this.actions$
    .ofType(datosPersonaActions.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [datosPersonaActions.LoadAction, store.State]) => action.payload)
    .switchMap((payload: number) => {
      return this.validacionDatosApiService
        .getDatosPersona(payload)
        .map(res => new datosPersonaActions.LoadSuccessAction(new DatosPersona(res)))
        .catch((error: APIError) => of(new datosPersonaActions.LoadFailAction(error.mensaje)));
    });

  constructor(
    private actions$: Actions,
    private validacionDatosApiService: ValidacionDatosService,
    private appState$: Store<store.State>
  ) {}
}
