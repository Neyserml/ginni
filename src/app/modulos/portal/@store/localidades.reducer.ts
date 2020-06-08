import * as actions from './localidades.action';
import { Localidades } from '../@models/localidades.model';

export interface State {
  failed: boolean;
  data: Localidades;
}

export const INITIAL_STATE: State = {
  failed: false,
  data: new Localidades()
};

export function reducer(state = INITIAL_STATE, action: actions.Actions): State {
  if (!action) {
    return state;
  }

  switch (action.type) {
    case actions.ActionTypes.LOAD_PAISES: {
      return Object.assign({}, state, {
        data: {
          ...state.data,
          paises: action.payload
        }
      });
    }
    case actions.ActionTypes.LOAD_PAISES_SUCCESS: {
      return Object.assign({}, state, {
        data: {
          ...state.data,
          paises: action.payload
        }
      });
    }
    case actions.ActionTypes.LOAD_DEPARTAMENTO: {
      return Object.assign({}, state, {
        data: {
          ...state.data,
          departamentos: action.payload
        }
      });
    }
    case actions.ActionTypes.LOAD_DEPARTAMENTO_SUCCESS: {
      return Object.assign({}, state, {
        data: {
          ...state.data,
          departamentos: action.payload
        }
      });
    }
    case actions.ActionTypes.LOAD_FAILED: {
      return Object.assign({}, state, {
        failed: action.payload
      });
    }

    default: {
      return state;
    }
  }
}

export const getData = (state: State) => state.data;
export const getFailed = (state: State) => state.failed;
