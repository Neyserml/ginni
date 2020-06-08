import { Action } from '@ngrx/store';

import { type } from '../utils/helpers';
import { Sesion, InicioSesionModel, APIError } from '../models';

export const ActionTypes = {
  RECOVER: type('[Sesion] Extraer de cookie'),
  LOAD: type('[Sesion] Load'),
  LOAD_SUCCESS: type('[Sesion] Load Success'),
  LOAD_FAIL: type('[Sesion] Load Fail'),
  REFRESH: type('[Sesion] Refresh'),
  LOG_OUT: type('[Sesion] Logout'),
  LOG_OUT_SUCESS: type('[Sesion] Logout Sucess'),
  LOG_OUT_FAIL: type('[Sesion] Logout Fail'),
  EXPIRE: type('[Sesion] Expire')
};

/**
 * Sesion Actions
 */
export class RecoverAction implements Action {
  type = ActionTypes.RECOVER;

  constructor(public payload: Sesion) {}
}

export class LoadAction implements Action {
  type = ActionTypes.LOAD;

  constructor(public payload: InicioSesionModel) {}
}

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;

  constructor(public payload: Sesion) {}
}

export class RefreshAction implements Action {
  type = ActionTypes.REFRESH;

  constructor(public payload: Sesion) {}
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;

  constructor(public payload: APIError = null) {}
}

export class LogoutAction implements Action {
  type = ActionTypes.LOG_OUT;

  constructor(public payload: any = null) {}
}

export class LogoutSuccessAction implements Action {
  type = ActionTypes.LOG_OUT_SUCESS;

  constructor(public payload: any = null) {}
}

export class LogoutFailAction implements Action {
  type = ActionTypes.LOG_OUT_FAIL;

  constructor(public payload: APIError = null) {}
}

export class ExpireAction implements Action {
  type = ActionTypes.EXPIRE;

  constructor(public payload: APIError = null) {}
}

export type Actions =
  | LoadAction
  | LoadSuccessAction
  | LoadFailAction
  | RefreshAction
  | LogoutAction
  | LogoutSuccessAction
  | LogoutFailAction;
