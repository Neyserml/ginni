import { Action } from '@ngrx/store';

import { type } from 'app/@compartidos/utils/helpers';
import { IInformacionPersonalResponse } from '../@models/personal.model';

export const ActionTypes = {
  LOAD: type('[Personal asociado] personal Load'),
  LOAD_JURIDICO: type('[Personal asociado] personal juridico Load'),
  LOAD_SUCCESS: type('[Personal asociado] personal Success'),
  LOAD_FAIL: type('[Personal asociado] personal Fail')
};

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;
  constructor(public payload: IInformacionPersonalResponse) {}
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;
  constructor(public payload: string) {}
}

export class LoadAction implements Action {
  type = ActionTypes.LOAD;
  constructor(public payload) {}
}

export type Actions = LoadSuccessAction | LoadFailAction | LoadAction;
