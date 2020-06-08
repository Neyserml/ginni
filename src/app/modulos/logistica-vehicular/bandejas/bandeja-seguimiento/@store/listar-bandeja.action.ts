import { Action } from '@ngrx/store';

import { type } from 'app/@compartidos/utils/helpers';

export const ActionTypes = {
  LOAD: type('[Mi Bandeja legal] bandeja Load'),
  LOAD_SUCCESS: type('[Mi Bandeja legal] bandeja Success'),
  LOAD_FAIL: type('[Mi Bandeja legal] bandeja Fail')
};

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;
  constructor(public payload: any = null) {}
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;
  constructor(public payload: string) {}
}

export class LoadAction implements Action {
  type = ActionTypes.LOAD;
  constructor(public payload: any = null) {}
}

export type Actions = LoadSuccessAction | LoadFailAction | LoadAction;
