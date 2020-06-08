import { Action } from '@ngrx/store';

import { type } from 'app/@compartidos/utils/helpers';
import { Configuracion } from '../@models/configuracion.model';

export const ActionTypes = {
  LOAD: type('[Editar asociado] configuracion Load'),
  LOAD_SUCCESS: type('[Editar asociado] configuracion Success'),
  LOAD_FAIL: type('[Editar asociado] configuracion Fail')
};

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;
  constructor(public payload: Configuracion) {}
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
