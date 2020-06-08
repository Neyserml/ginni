import { Action } from '@ngrx/store';

import { type } from 'app/@compartidos/utils/helpers';
import {
  ISeguimientoResponse,
  ISeguimientoRequest
} from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/seguimiento.interface';

export const ActionTypes = {
  LOAD: type('[Seguimiento Inicio] seguimiento Load'),
  LOAD_SUCCESS: type('[Seguimiento Inicio] seguimiento Success'),
  LOAD_FAIL: type('[Seguimiento Inicio] seguimiento Fail')
};

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;

  constructor(public payload: ISeguimientoResponse) {}
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;

  constructor(public payload) {}
}

export class LoadAction implements Action {
  type = ActionTypes.LOAD;

  constructor(public payload: ISeguimientoRequest) {}
}

export type Actions = LoadSuccessAction | LoadFailAction | LoadAction;
