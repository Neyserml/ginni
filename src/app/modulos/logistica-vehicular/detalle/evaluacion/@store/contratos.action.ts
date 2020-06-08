import { Action } from '@ngrx/store';

import { type } from 'app/@compartidos/utils/helpers';
import { IListaContratos } from '../@interface/contratos.interface';

export const ActionTypes = {
  LOAD: type('[Evaluacion crediticia] contratos Load'),
  LOAD_SUCCESS: type('[Evaluacion crediticia] contratos Success'),
  LOAD_FAIL: type('[Evaluacion crediticia] contratos Fail')
};

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;
  constructor(public payload: IListaContratos[]) {}
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
