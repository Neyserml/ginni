import * as actions from './usuario.action';
import { Usuario } from '../usuario';

export interface State {
  loading: boolean;
  failed: any;
  loaded: boolean;
  data: Usuario;
}

export const INITIAL_STATE: State = {
  loading: false,
  failed: null,
  loaded: false,
  data: new Usuario()
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
    case actions.ActionTypes.LOAD_SUCCESS: {
      return Object.assign({}, state, {
        loading: false,
        failed: null,
        loaded: true,
        data: action.payload
      });
    }
    case actions.ActionTypes.LOAD_FAIL: {
      return Object.assign({}, state, {
        loading: false,
        failed: action.payload
      });
    }
    default: {
      return state;
    }
  }
}

export const getData = (state: State) => state.data;
export const getLoaded = (state: State) => state.loaded;
export const getLoading = (state: State) => state.loading;
export const getFailed = (state: State) => state.failed;
