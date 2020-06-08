import { Action } from '@ngrx/store';

import { RecuperarContraseniaModel } from 'app/@compartidos/models/recuperar-contrasenia.model';
import { type } from 'app/@compartidos/utils/helpers';

export const ActionTypes = {
  LOAD: type('[Enviar Contrasenia] Load'),
  LOAD_SUCCESS: type('[Enviar Contrasenia] Load Success'),
  LOAD_FAIL: type('[Enviar Contrasenia] Load Fail'),
  RESET: type('[Enviar Contrasenia] Reset')
};

export class LoadAction implements Action {
  type = ActionTypes.LOAD;

  constructor(public payload: RecuperarContraseniaModel) {}
}

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;

  constructor(public payload: any = null) {}
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;

  constructor(public payload: any = null) {}
}

export class ResetAction implements Action {
  type = ActionTypes.RESET;

  constructor(public payload: any = null) {}
}

export type Actions = LoadAction | LoadSuccessAction | LoadFailAction;
