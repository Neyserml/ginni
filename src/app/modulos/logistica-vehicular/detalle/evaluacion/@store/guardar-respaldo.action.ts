import { Action } from '@ngrx/store';
import { type } from 'app/@compartidos/utils/helpers';

export const ActionTypes = {
  LOAD: type('[Evaluacion crediticia] Guardar respaldo Load'),
  LOAD_SUCCESS: type('[Evaluacion crediticia] Guardar respaldo Success'),
  LOAD_FAIL: type('[Evaluacion crediticia] Guardar respaldo Fail')
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
  constructor(public payload: any) {}
}

export type Actions = LoadSuccessAction | LoadFailAction | LoadAction;
