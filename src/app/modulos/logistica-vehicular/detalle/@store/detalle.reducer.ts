import * as actions from './detalle.action';
import { Detalle } from '../@models/detalle.model';

export interface State {
  loading: boolean;
  failed: any;
  id: string;
  data: Detalle;
}

export const INITIAL_STATE: State = {
  loading: false,
  failed: null,
  id: null,
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
        failed: null
      });
    }
    case actions.ActionTypes.LOAD_FAIL: {
      return Object.assign({}, state, {
        loading: false,
        failed: action.payload
      });
    }
    case actions.ActionTypes.LOAD_SUCCESS: {
      if (action.payload) {
        return Object.assign({}, state, {
          loading: false,
          failed: null,
          id: action.payload.id,
          data: action.payload.data
        });
      }
      return Object.assign({}, state, {
        loading: false,
        failed: null
      });
    }
    case actions.ActionTypes.RESET: {
      return Object.assign({}, state, INITIAL_STATE);
    }
    default: {
      return state;
    }
  }
}

export const getData = (state: State) => state.data;
export const getLoading = (state: State) => state.loading;
export const getFailed = (state: State) => state.failed;
