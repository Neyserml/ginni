import { Action } from '@ngrx/store';
import { type } from 'app/@compartidos/utils/helpers';
import { IListaContratosSimulador } from '../@interfaces/simulador.interface';

export const ActionTypes = {
  LOAD: type('[Simulador] Listar contratos Load'),
  LOAD_SUCCESS: type('[Simulador] Listar contratos Success'),
  LOAD_FAIL: type('[Simulador] Listar contratos Fail'),
  RESET: type('[Simulador] Listar contratos Reset')
};

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;
  constructor(public payload: IListaContratosSimulador[] = null) {}
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;
  constructor(public payload: any) {}
}

export class LoadAction implements Action {
  type = ActionTypes.LOAD;
  constructor(public payload: string | number = null, public servicio: string = '') {}
}

export class ResetAction implements Action {
  type = ActionTypes.RESET;
  constructor(public payload: any = null) {}
}

export type Actions = LoadSuccessAction | LoadFailAction | LoadAction | ResetAction;
