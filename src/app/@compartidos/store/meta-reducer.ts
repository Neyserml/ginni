import { MetaReducer } from '@ngrx/store';

import * as sesionActions from '../store/sesion.action';

export function logout(reducer) {
  return function(state, action) {
    return reducer(
      action.type === sesionActions.ActionTypes.LOAD_SUCCESS ? undefined : state,
      action
    );
  };
}

export const metaReducers: MetaReducer<any>[] = [logout];
