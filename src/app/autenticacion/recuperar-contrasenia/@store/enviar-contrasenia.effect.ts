import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Router } from '@angular/router';

import { RecuperarContraseniaApiService } from '../recuperar-contrasenia-api.service';

import * as store from './index';
import * as enviarContraseniaAction from './enviar-contrasenia.action';
import { APIError } from '../../../@compartidos/models';

@Injectable()
export class EnviarContraseniaEffect {
  /**
   * Inicio sesion effect
   */
  @Effect()
  public inicioSesion$: Observable<Action> = this.actions$
    .ofType(enviarContraseniaAction.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [enviarContraseniaAction.LoadAction, store.State]) => action.payload)
    .switchMap((payload: any) => {
      return this.recuperarContraseniaApiService
        .restore(payload)
        .map(res => {
          this.router.navigate(['/inicio-sesion', { 'clave-actualizada': true }]);
          return new enviarContraseniaAction.LoadSuccessAction(res);
        })
        .catch((error: APIError) => of(new enviarContraseniaAction.LoadFailAction(error)));
    });

  constructor(
    private actions$: Actions,
    private recuperarContraseniaApiService: RecuperarContraseniaApiService,
    private router: Router,
    private appState$: Store<store.State>
  ) {}
}
