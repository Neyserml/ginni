import * as actions from './personas-relacionadas.action';
import { IPersonaRelacionadaItem } from '../@models/persona-relacionada.model';

export interface State {
  loading: boolean;
  failed: any;
  data: IPersonaRelacionadaItem[];
}

export const INITIAL_STATE: State = {
  loading: false,
  failed: null,
  data: null
};

export function reducer(state = INITIAL_STATE, action: actions.Actions): State {
  if (!action) {
    return state;
  }

  switch (action.type) {
    case actions.ActionTypes.LOAD: {
      return Object.assign({}, state, {
        loading: true,
        data: null,
        failed: null
      });
    }
    case actions.ActionTypes.LOAD_SUCCESS: {
      return Object.assign({}, state, {
        loading: false,
        data: action.payload,
        failed: null
      });
    }
    case actions.ActionTypes.LOAD_FAIL: {
      return Object.assign({}, state, {
        loading: false,
        data: null,
        failed: action.payload
      });
    }
    default: {
      return state;
    }
  }
}

export const getData = (state: State) => state.data;
export const getLoading = (state: State) => state.loading;
export const getFailed = (state: State) => state.failed;
