import { Action } from '@ngrx/store';
import { type } from '../utils/helpers';

export const ActionTypes = {
  LOAD: type('[Page] Load'),
  LOAD_SUCCESS: type('[Page] Load Success')
};

export class LoadAction implements Action {
  type = ActionTypes.LOAD;

  constructor(public payload: any = null) {}
}

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;

  constructor(public payload: string = null) {}
}

export type Actions = LoadAction | LoadSuccessAction;
