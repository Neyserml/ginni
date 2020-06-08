import { Action } from '@ngrx/store';

import { type } from 'app/@compartidos/utils/helpers';
import { IPersonaRelacionadaItem } from '../@models/persona-relacionada.model';

export const ActionTypes = {
  LOAD: type('[Persona Relacionada] persona relacionada Load'),
  LOAD_SUCCESS: type('[Persona Relacionada] persona relacionada Success'),
  LOAD_FAIL: type('[Persona Relacionada] persona relacionada Fail')
};

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;
  constructor(public payload: IPersonaRelacionadaItem[]) {}
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;
  constructor(public payload: any) {}
}

export class LoadAction implements Action {
  type = ActionTypes.LOAD;
  constructor(public payload: any = null) {}
}

export type Actions = LoadSuccessAction | LoadFailAction | LoadAction;
