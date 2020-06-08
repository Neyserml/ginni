import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { APIError } from 'app/@compartidos/models';
import { ContratoModel } from '../@models/contrato.model';
import { ITramiteRequest } from '../@models/tramite-request.interface';
import { BandejaFuncionarioApiService } from '../bandeja-funcionario-api.service';
import * as store from './index';
import * as tramiteActions from './contrato-tramite.action';
import * as descargaActions from '../../@store/descarga-excel.action';

@Injectable()
export class BandejaFuncionarioEffect {
  /**
   * En tramite effect
   */
  @Effect()
  public tramite$: Observable<Action> = this.actions$
    .ofType(tramiteActions.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [tramiteActions.LoadAction, store.State]) => action.payload)
    .switchMap((payload: ITramiteRequest) => {
      return this.bandejaFuncionarioApi
        .enTramite(payload)
        .map(res => new tramiteActions.LoadSuccessAction(new ContratoModel(res)))
        .catch((error: APIError) => of(new tramiteActions.LoadFailAction(error.mensaje)));
    });

  @Effect()
  public descarga$: Observable<Action> = this.actions$
    .ofType(descargaActions.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [descargaActions.LoadAction, store.State]) => action.payload)
    .switchMap((payload: any) => {
      return this.bandejaFuncionarioApi
        .descargarExcel(payload)
        .map(() => new descargaActions.LoadSuccessAction(true))
        .catch((error: APIError) => of(new descargaActions.LoadFailAction(error.mensaje)));
    });

  constructor(
    private actions$: Actions,
    private appState$: Store<store.State>,
    private bandejaFuncionarioApi: BandejaFuncionarioApiService
  ) {}
}
