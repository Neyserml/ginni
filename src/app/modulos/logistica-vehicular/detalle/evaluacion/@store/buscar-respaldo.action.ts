import { Action } from '@ngrx/store';
import { type } from 'app/@compartidos/utils/helpers';

export const ActionTypes = {
  LOAD: type('[Agregar garante] Buscar respaldo Load'),
  LOAD_SUCCESS: type('[Agregar garante] Buscar respaldo Success'),
  LOAD_FAIL: type('[Agregar garante] Buscar respaldo Fail'),
  RESET: type('[Agregar garante] Buscar respaldo Reset')
};

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;
  constructor(public payload: any) {}
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;
  constructor(public payload: string) {}
}

export class LoadAction implements Action {
  type = ActionTypes.LOAD;
  constructor(public payload: any) {}
}

export class ResetAction implements Action {
  type = ActionTypes.RESET;
  constructor(public payload: any = null) {}
}

export type Actions = LoadSuccessAction | LoadFailAction | LoadAction | ResetAction;
