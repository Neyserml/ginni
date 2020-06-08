import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import * as store from './index';
import * as listarActions from './listar-bandeja.action';
import { BandejaSeguimientoApiService } from '../bandeja-seguimiento-api.service';
import { APIError } from 'app/@compartidos/models';
import { IListarBandejaRequest } from '../@interfaces/bandeja-seguimiento.interface';

@Injectable()
export class BandejaSeguimientoEffect {
  /**
   * Listar Bandeja
   */
  @Effect()
  public tramite$: Observable<Action> = this.actions$
    .ofType(listarActions.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [listarActions.LoadAction, store.State]) => action.payload)
    .switchMap((pagina: IListarBandejaRequest) => {
      return this.bandejaSeguimientoApi
        .listar(pagina)
        .map(res => new listarActions.LoadSuccessAction(res))
        .catch((error: APIError) => of(new listarActions.LoadFailAction(error.mensaje)));
    });

  constructor(
    private actions$: Actions,
    private appState$: Store<store.State>,
    private bandejaSeguimientoApi: BandejaSeguimientoApiService
  ) {}
}
