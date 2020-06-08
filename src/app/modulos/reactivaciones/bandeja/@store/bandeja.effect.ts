import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { APIError } from 'app/@compartidos/models';
import { BandejaModel } from '../@models/bandeja.model';
import { IReactivacionRequest } from '../@models/bandeja.interface';
import { BandejaService } from '../bandeja.service';
import * as store from './index';
import * as reactivacionActions from './bandeja.action';
import * as descargaActions from './descarga-excel.action';

@Injectable()
export class BandejaEffect {
  /**
   * En reactivacion effect
   */
  @Effect()
  public reactivacion$: Observable<Action> = this.actions$
    .ofType(reactivacionActions.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [reactivacionActions.LoadAction, store.State]) => action.payload)
    .switchMap((payload: IReactivacionRequest) => {
      return this.bandejaService
        .enReactivacion(payload)
        .map(res => new reactivacionActions.LoadSuccessAction(new BandejaModel(res)))
        .catch((error: APIError) => of(new reactivacionActions.LoadFailAction(error.mensaje)));
    });

  @Effect()
  public descarga$: Observable<Action> = this.actions$
    .ofType(descargaActions.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [descargaActions.LoadAction, store.State]) => action.payload)
    .switchMap((payload: any) => {
      return this.bandejaService
        .descargarExcel(payload)
        .map(() => new descargaActions.LoadSuccessAction(true))
        .catch((error: APIError) => of(new descargaActions.LoadFailAction(error.mensaje)));
    });

  constructor(
    private actions$: Actions,
    private bandejaService: BandejaService,
    private appState$: Store<store.State>
  ) {}
}
