import { Action } from '@ngrx/store';

import { IPayloadLaboral } from '../@models/guardar-form-laboral.model';
import { type } from 'app/@compartidos/utils/helpers';

export const ActionTypes = {
  LOAD: type('[Laboral detalle] laboral Load'),
  LOAD_SUCCESS: type('[Laboral detalle] laboral Success'),
  LOAD_FAIL: type('[Laboral detalle] laboral Fail'),
  SAVE: type('[Laboral detalle] laboral Save')
};

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;
  constructor(public payload: string) {}
}

export class LoadAction implements Action {
  type = ActionTypes.LOAD;
  constructor(public payload: string) {}
}

export class SaveAction implements Action {
  type = ActionTypes.SAVE;
  constructor(public payload: IPayloadLaboral) {}
}

export type Actions = LoadSuccessAction | LoadFailAction | LoadAction | SaveAction;
