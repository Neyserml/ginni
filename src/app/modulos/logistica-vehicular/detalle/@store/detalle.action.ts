import { Action } from '@ngrx/store';
import { type } from 'app/@compartidos/utils/helpers';
import { ISuccess } from './detalle.interface';

export const ActionTypes = {
  LOAD: type('[Detalles] datos detalles Load'),
  LOAD_SUCCESS: type('[Detalles] datos detalles Success'),
  LOAD_FAIL: type('[Detalles] datos detalles Fail'),
  RESET: type('[Detalles] datos detalles Reset')
};

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;
  constructor(public payload: ISuccess = null) {}
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;
  constructor(public payload: string) {}
}

export class LoadAction implements Action {
  type = ActionTypes.LOAD;
  constructor(public payload: string) {}
}

export class ResetAction implements Action {
  type = ActionTypes.RESET;
  constructor(public payload: any = null) {}
}

export type Actions = LoadSuccessAction | LoadFailAction | LoadAction | ResetAction;
