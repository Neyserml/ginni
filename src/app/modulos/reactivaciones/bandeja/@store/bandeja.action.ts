import { Action } from '@ngrx/store';

import { type } from 'app/@compartidos/utils/helpers';
import { BandejaModel } from '../@models/bandeja.model';
import { IReactivacionRequest } from '../@models/bandeja.interface';

export const ActionTypes = {
  LOAD: type('[Mi Bandeja] reactivacion Load'),
  LOAD_SUCCESS: type('[Mi Bandeja] reactivacion Success'),
  LOAD_FAIL: type('[Mi Bandeja] reactivacion Fail')
};

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;
  constructor(public payload: BandejaModel) {}
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;
  constructor(public payload: string) {}
}

export class LoadAction implements Action {
  type = ActionTypes.LOAD;
  constructor(public payload: IReactivacionRequest = null) {}
}

export type Actions = LoadSuccessAction | LoadFailAction | LoadAction;
