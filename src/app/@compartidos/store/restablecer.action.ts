import { Action } from '@ngrx/store';

import { type } from '../utils/helpers';
import { RestablecerModel } from '../models/restablecer.model';

export const ActionTypes = {
  LOAD: type('[Restablecer] Load'),
  LOAD_SUCCESS: type('[Restablecer] Load Success'),
  LOAD_FAIL: type('[Restablecer] Load Fail'),
  RESET: type('[Restablecer] Reset')
};

/**
 * Restablecer Actions
 */
export class LoadAction implements Action {
  type = ActionTypes.LOAD;

  constructor(public payload: RestablecerModel) {}
}

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;

  constructor(public payload: any) {}
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;

  constructor(public payload: any = null) {}
}

export class ResetAction implements Action {
  type = ActionTypes.RESET;

  constructor(public payload: any = null) {}
}

export type Actions = LoadAction | LoadSuccessAction | LoadFailAction | ResetAction;
