import * as actions from './sesion.action';
import { Sesion, APIError } from '../models';

export interface State {
  token: string;
  loading: boolean;
  failed: APIError;
  data: Sesion;
}

export const INITIAL_STATE: State = {
  token: '',
  loading: false,
  failed: null,
  data: new Sesion()
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

    case actions.ActionTypes.LOAD_SUCCESS:
    case actions.ActionTypes.RECOVER: {
      const token = action.payload.token;
      return Object.assign({}, state, {
        token,
        failed: null,
        loading: false,
        data: action.payload
      });
    }

    case actions.ActionTypes.REFRESH: {
      const sesion: Sesion = state.data;
      const refreshSesion: Sesion = action.payload;
      if (refreshSesion && refreshSesion.token) {
        sesion.token = refreshSesion.token;
        const token = sesion.token;
        sesion.refreshToken = refreshSesion.refreshToken;
        sesion.fechaExpiracion = refreshSesion.fechaExpiracion;

        return Object.assign({}, state, {
          loading: false,
          token
        });
      } else {
        return INITIAL_STATE;
      }
    }

    case actions.ActionTypes.LOAD_FAIL: {
      return Object.assign({}, state, {
        loading: false,
        failed: action.payload
      });
    }

    case actions.ActionTypes.LOG_OUT_SUCESS:
    case actions.ActionTypes.EXPIRE:
    case actions.ActionTypes.LOG_OUT_FAIL: {
      return INITIAL_STATE;
    }

    default: {
      return state;
    }
  }
}

export const getData = (state: State) => state.data;
export const getToken = (state: State) => state.token;
export const getLoading = (state: State) => state.loading;
export const getFailed = (state: State) => state.failed;
