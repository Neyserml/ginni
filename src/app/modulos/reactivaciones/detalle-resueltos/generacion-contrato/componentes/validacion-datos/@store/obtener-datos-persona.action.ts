import { Action } from '@ngrx/store';

import { type } from 'app/@compartidos/utils/helpers';
import { IObtenerDatosPersona } from '../@interfaces/datos-persona.interface';

export const ActionTypes = {
  LOAD: type('[Obtener datos] generación contratos Load'),
  LOAD_SUCCESS: type('[Obtener datos] generación contratos Success'),
  LOAD_FAIL: type('[Obtener datos] generación contratos Fail')
};

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;
  constructor(public payload: IObtenerDatosPersona) {}
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
