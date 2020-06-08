import { createSelector } from 'reselect';
import * as fromSesion from './sesion.reducer';
import * as fromRestablecer from './restablecer.reducer';
import * as fromPage from './page.reducer';

export interface State {
  sesion: fromSesion.State;
  restablecer: fromRestablecer.State;
  page: fromPage.State;
  portal?: any;
  editarAsociado?: any;
  asociados?: any;
  evaluacion?: any;
}

export const reducers = {
  sesion: fromSesion.reducer,
  restablecer: fromRestablecer.reducer,
  page: fromPage.reducer
};

/**
 * Sesion store functions
 */
export const getSesionState = (state: State) => state.sesion;
export const getSesion = createSelector(
  getSesionState,
  fromSesion.getData
);
export const getSesionLoading = createSelector(
  getSesionState,
  fromSesion.getLoading
);
export const getSesionFailed = createSelector(
  getSesionState,
  fromSesion.getFailed
);

export const getPageState = (state: State) => state.page;
export const getPath = createSelector(
  getPageState,
  fromPage.getPath
);
export const getPageLoading = createSelector(
  getPageState,
  fromPage.getLoading
);

export const getSesionToken = createSelector(
  getSesionState,
  (state: fromSesion.State) => {
    return {
      token: state.token,
      data: state.data
    };
  }
);

/**
 * Restablecer store functions
 */
export const getRestablecerState = (state: State) => state.restablecer;
export const getRestablecer = createSelector(
  getRestablecerState,
  fromRestablecer.getData
);
export const getRestablecerLoading = createSelector(
  getRestablecerState,
  fromRestablecer.getLoading
);
export const getRestablecerFailed = createSelector(
  getRestablecerState,
  fromRestablecer.getFailed
);
