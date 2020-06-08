import * as actions from './page.action';

export interface State {
  loaded: boolean;
  loading: boolean;
  path: string;
}

export const INITIAL_STATE: State = {
  loaded: false,
  loading: false,
  path: null
};

export function reducer(state = INITIAL_STATE, action: actions.Actions): State {
  if (!action) {
    return state;
  }

  switch (action.type) {
    case actions.ActionTypes.LOAD: {
      return Object.assign({}, state, {
        loaded: false,
        loading: true
      });
    }

    case actions.ActionTypes.LOAD_SUCCESS: {
      return Object.assign({}, state, {
        loaded: true,
        loading: false,
        path: action.payload
      });
    }

    default: {
      return state;
    }
  }
}

export const getPath = (state: State) => state.path;
export const getLoading = (state: State) => state.loading;
export const getLoaded = (state: State) => state.loaded;
