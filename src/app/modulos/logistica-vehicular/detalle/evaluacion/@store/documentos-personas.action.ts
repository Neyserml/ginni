import { Action } from '@ngrx/store';

import { type } from 'app/@compartidos/utils/helpers';
import { IDocumentosPersonas } from '../@interface/documentos-personas.interface';

export const ActionTypes = {
  LOAD: type('[Evaluacion crediticia] documentos personas Load'),
  LOAD_SUCCESS: type('[Evaluacion crediticia] documentos personas Success'),
  LOAD_FAIL: type('[Evaluacion crediticia] documentos personas Fail')
};

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;
  constructor(public payload: IDocumentosPersonas[]) {}
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;
  constructor(public payload: string) {}
}

export class LoadAction implements Action {
  type = ActionTypes.LOAD;
  constructor(public payload: string) {}
}

export type Actions = LoadSuccessAction | LoadFailAction | LoadAction;
