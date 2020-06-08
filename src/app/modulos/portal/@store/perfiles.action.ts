import { Action } from '@ngrx/store';

import { type } from 'app/@compartidos/utils/helpers';

export const ActionTypes = {
  LOAD: type('[Portal] perfiles Load'),
  LOAD_SUCCESS: type('[Portal] perfiles Success'),
  LOAD_FAIL: type('[Portal] perfiles Fail')
};

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;
  constructor(public payload: any = null) {}
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;
  constructor(public payload: string = null) {}
}

export class LoadAction implements Action {
  type = ActionTypes.LOAD;
  constructor(public payload: any = null) {}
}

export type Actions = LoadSuccessAction | LoadFailAction | LoadAction;
