import { Action } from '@ngrx/store';

import { type } from 'app/@compartidos/utils/helpers';
import { ITramiteRequest } from '../@models/tramite-request.interface';
import { ContratoModel } from '../@models/contrato.model';

export const ActionTypes = {
  LOAD: type('[Mi Bandeja] contrato tramite Load'),
  LOAD_SUCCESS: type('[Mi Bandeja] contrato tramite Success'),
  LOAD_FAIL: type('[Mi Bandeja] contrato tramite Fail')
};

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;
  constructor(public payload: ContratoModel) {}
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;
  constructor(public payload: string) {}
}

export class LoadAction implements Action {
  type = ActionTypes.LOAD;
  constructor(public payload: ITramiteRequest = null) {}
}

export type Actions = LoadSuccessAction | LoadFailAction | LoadAction;
