import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Action, Store } from '@ngrx/store';
import * as listarContratosActions from './listar-contratos.action';
import * as store from './index';
import { SimuladorApiService } from '../simulador-api.service';
import { APIError } from 'app/@compartidos/models';
import { of } from 'rxjs/observable/of';
import { IListaContratosSimulador } from '../@interfaces/simulador.interface';

@Injectable()
export class SimuladorEvaluacionCrediticiaEffect {
  /**
   * Obtener contratos effect
   */
  @Effect()
  public obtenerContratos$: Observable<Action> = this.actions$
    .ofType(listarContratosActions.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [listarContratosActions.LoadAction, store.State]) => {
      return {
        servicio: action.servicio,
        payload: action.payload
      };
    })
    .switchMap(data => {
      this.simuladorApiService.listarServiciosPayload = data;
      return this.simuladorApiService[data.servicio](data.payload)
        .map((res: IListaContratosSimulador[]) => new listarContratosActions.LoadSuccessAction(res))
        .catch((error: APIError) => of(new listarContratosActions.LoadFailAction(error.mensaje)));
    });

  constructor(
    private actions$: Actions,
    private appState$: Store<store.State>,
    private simuladorApiService: SimuladorApiService
  ) {}
}
