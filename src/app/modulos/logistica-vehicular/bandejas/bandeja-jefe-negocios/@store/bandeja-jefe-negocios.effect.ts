import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { Store, Action } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { APIError } from 'app/@compartidos/models';
import { BandejaJefeNegociosApiService } from '../bandeja-jefe-negocios-api.service';
import * as store from './index';
import * as descargaActions from '../../@store/descarga-excel.action';
import * as listarEnTramiteActions from './listaEnTramites.action';
import * as listaAprobadosAction from './listaAprobados.action';
import { IListarEnTramitesResponse } from '../@interfaces/listar-en-tramite.interface';
import { ListarEnTramite } from '../@model/listar-en-tramite.model';
import {
  IListarBandejaRequest,
  IBandejaAprobadoRequest,
  IDescargaExcelRequest
} from '../@interfaces/bandeja.interface';
import { ListarAprobados } from '../@model/listar-aprobados.model';

@Injectable()
export class BanjedaJefeNegociosEffect {
  /**
   * Descarga excel
   */
  @Effect()
  public descargarExcel$: Observable<Action> = this.actions$
    .ofType(descargaActions.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [descargaActions.LoadAction, store.State]) => action.payload)
    .switchMap((payload: IDescargaExcelRequest) => {
      return this.bandejaJefeNegociosApiService
        .descargarExcel(payload)
        .map(() => new descargaActions.LoadSuccessAction(true))
        .catch((error: APIError) => of(new descargaActions.LoadSuccessAction(error.mensaje)));
    });

  /**
   * Listar En tramites
   */
  @Effect()
  public listarEnTramites$: Observable<Action> = this.actions$
    .ofType(listarEnTramiteActions.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [listarEnTramiteActions.LoadAction, store.State]) => action.payload)
    .switchMap((payload: IListarBandejaRequest) => {
      return this.bandejaJefeNegociosApiService
        .busqueda(payload)
        .map(
          (res: IListarEnTramitesResponse) =>
            new listarEnTramiteActions.LoadSuccessAction(new ListarEnTramite(res))
        )
        .catch((error: APIError) => of(new listarEnTramiteActions.LoadFailAction(error.mensaje)));
    });

  /**
   * Listar Aprobados
   */
  @Effect()
  public listarAprobados$: Observable<Action> = this.actions$
    .ofType(listaAprobadosAction.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [listaAprobadosAction.LoadAction, store.State]) => action.payload)
    .switchMap((payload: IBandejaAprobadoRequest) => {
      return this.bandejaJefeNegociosApiService
        .bandejaAprobados(payload)
        .map(res => new listaAprobadosAction.LoadSuccessAction(new ListarAprobados(res)))
        .catch((error: APIError) => of(new listaAprobadosAction.LoadFailAction(error.mensaje)));
    });

  constructor(
    private actions$: Actions,
    private appState$: Store<store.State>,
    private bandejaJefeNegociosApiService: BandejaJefeNegociosApiService
  ) {}
}
