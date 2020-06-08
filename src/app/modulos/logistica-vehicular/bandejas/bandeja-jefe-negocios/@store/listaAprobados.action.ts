import { Action } from '@ngrx/store';
import { type } from 'app/@compartidos/utils/helpers';

export const ActionTypes = {
  LOAD: type('[Mi Bandeja] Lista aprobados Load'),
  LOAD_SUCCESS: type('[Mi Bandeja] Lista aprobados Success'),
  LOAD_FAIL: type('[Mi Bandeja] Lista aprobados Fail')
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
  constructor(public payload: any = null) {}
}

export type Actions = LoadSuccessAction | LoadFailAction | LoadAction;
