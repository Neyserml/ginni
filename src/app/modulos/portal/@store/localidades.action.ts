import { Action } from '@ngrx/store';
import { type } from 'app/@compartidos/utils/helpers';

export const ActionTypes = {
  LOAD_PAISES: type('[Localidades] Load Paises'),
  LOAD_PAISES_SUCCESS: type('[Localidades] Load Paises Success'),
  LOAD_DEPARTAMENTO: type('[Localidades] Load Departamento'),
  LOAD_DEPARTAMENTO_SUCCESS: type('[Localidades] Load Departamento Success'),
  LOAD_FAILED: type('[Localidades] Load Failed')
};

/**
 * Localidades Actions
 */
export class LoadPaisesAction implements Action {
  type = ActionTypes.LOAD_PAISES;

  constructor(public payload: any = null) {}
}

export class LoadPaisesSuccessAction implements Action {
  type = ActionTypes.LOAD_PAISES_SUCCESS;

  constructor(public payload: any = null) {}
}

export class LoadDepartametoAction implements Action {
  type = ActionTypes.LOAD_DEPARTAMENTO;

  constructor(public payload: any = null) {}
}

export class LoadDepartametoSuccessAction implements Action {
  type = ActionTypes.LOAD_DEPARTAMENTO_SUCCESS;

  constructor(public payload: any = null) {}
}

export class LoadFailedAction implements Action {
  type = ActionTypes.LOAD_FAILED;

  constructor(public payload: string = null) {}
}

export type Actions =
  | LoadPaisesAction
  | LoadPaisesSuccessAction
  | LoadDepartametoAction
  | LoadDepartametoSuccessAction
  | LoadFailedAction;
