import { Action } from '@ngrx/store';
import { type } from 'app/@compartidos/utils/helpers';
import { IListarEnTramitesResponse } from '../@interfaces/listar-en-tramite.interface';

export const ActionTypes = {
  LOAD: type('[Mi Bandeja] Lista tramite Load'),
  LOAD_SUCCESS: type('[Mi Bandeja] Lista tramite Success'),
  LOAD_FAIL: type('[Mi Bandeja] Lista tramite Fail')
};

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;
  constructor(public payload: IListarEnTramitesResponse) {}
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
