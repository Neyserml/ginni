import { Action } from '@ngrx/store';

import { type } from 'app/@compartidos/utils/helpers';
import { IinicioEvaluacion } from '../@interface/evaluacion-asociado.interface';

export const ActionTypes = {
  LOAD: type('[Validar Inicio] datos asociados Load'),
  LOAD_SUCCESS: type('[Validar Inicio] datos asociados Success'),
  LOAD_FAIL: type('[Validar Inicio] datos asociados Fail')
};

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;

  constructor(public payload: IinicioEvaluacion) {}
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;

  constructor(public payload: string) {}
}

export class LoadAction implements Action {
  type = ActionTypes.LOAD;

  constructor(public payload: string) {}
}

export type Actions = LoadSuccessAction | LoadFailAction | LoadAction;
