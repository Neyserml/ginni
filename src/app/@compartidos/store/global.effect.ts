import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { InicioSesionApiService } from 'app/autenticacion/inicio-sesion/inicio-sesion-api.service';

import * as store from './index';
import * as sesionActions from './sesion.action';
import * as restablecerActions from './restablecer.action';

import { Sesion, APIError } from '../models';
import { RefreshApiService } from '../services/refresh-api.service';

@Injectable()
export class GlobalEffect {
  /**
   * Inicio sesion effect
   */
  @Effect()
  public inicioSesion$: Observable<Action> = this.actions$
    .ofType(sesionActions.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [sesionActions.LoadAction, store.State]) => action.payload)
    .switchMap((payload: any) => {
      return this.inicioSesionApi
        .login(payload)
        .map(sesion => {
          this.router.navigateByUrl('/portal');

          return new sesionActions.LoadSuccessAction(new Sesion(sesion));
        })
        .catch((error: APIError) => of(new sesionActions.LoadFailAction(error)));
    });

  /**
   * Refresh token
   */
  @Effect()
  public refreshToken$: Observable<Action> = this.actions$
    .ofType(sesionActions.ActionTypes.REFRESH)
    .withLatestFrom(this.appState$)
    .map(([action]: [sesionActions.RefreshAction, store.State]) => action.payload)
    .switchMap((payload: Sesion) => {
      if (payload && payload.refreshToken) {
        return this.refreshApiService
          .refresh({ refreshToken: payload.refreshToken })
          .map(res => new sesionActions.LoadSuccessAction(new Sesion(res)))
          .catch((error: APIError) => of(new sesionActions.LoadFailAction(error)));
      } else {
        this.redireccionarInicio();

        return of(new sesionActions.LogoutSuccessAction(true));
      }
    });

  /**
   * Restablecer effect
   */
  @Effect()
  public restablecer$: Observable<Action> = this.actions$
    .ofType(restablecerActions.ActionTypes.LOAD)
    .withLatestFrom(this.appState$)
    .map(([action]: [restablecerActions.LoadAction, store.State]) => action.payload)
    .switchMap((payload: any) => {
      return this.inicioSesionApi
        .recuperarContrasenia(payload)
        .map((res: any) => new restablecerActions.LoadSuccessAction(res))
        .catch((error: APIError) => of(new restablecerActions.LoadFailAction(error.mensaje)));
    });

  /**
   * Logout effect
   */
  @Effect()
  public logout$: Observable<Action> = this.actions$
    .ofType(sesionActions.ActionTypes.LOG_OUT)
    .withLatestFrom(this.appState$)
    .map(([, state]: [sesionActions.LogoutAction, store.State]) => state)
    .switchMap((state: store.State) => {
      if (state.sesion.token) {
        return this.inicioSesionApi
          .logout()
          .map(() => {
            this.redireccionarInicio();
            return new sesionActions.LogoutSuccessAction(true);
          })
          .catch((error: APIError) => {
            this.redireccionarInicio();
            return of(new sesionActions.LogoutFailAction(error));
          });
      }
      this.redireccionarInicio();
      return of(new sesionActions.LogoutSuccessAction(true));
    });

  public redireccionarInicio() {
    if (this.router.url.indexOf('/inicio-sesion') === -1) {
      this.router.navigate(['/inicio-sesion']);
    }
  }
  constructor(
    private actions$: Actions,
    private inicioSesionApi: InicioSesionApiService,
    private refreshApiService: RefreshApiService,
    private router: Router,
    private appState$: Store<store.State>
  ) {}
}
