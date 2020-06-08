import { createSelector } from 'reselect';

import * as fromConfiguracion from './configuracion.reducer';
import * as fromLocalidades from './localidades.reducer';
import * as fromPerfiles from './perfiles.reducer';
import * as fromUsuario from './usuario.reducer';
import { getPageLoading } from 'app/@compartidos/store';

export interface State {
  perfiles: fromPerfiles.State;
  configuracion: fromConfiguracion.State;
  usuario: fromUsuario.State;
  localidades: fromLocalidades.State;
}

export const reducers = {
  perfiles: fromPerfiles.reducer,
  configuracion: fromConfiguracion.reducer,
  usuario: fromUsuario.reducer,
  localidades: fromLocalidades.reducer
};

export const getState = state => state.portal;

/**
 * Perfiles store functions
 */
export const getPerfilesState = createSelector(
  getState,
  (state: State) => state.perfiles
);
export const getPerfiles = createSelector(
  getPerfilesState,
  fromPerfiles.getData
);
export const getPerfilesLoading = createSelector(
  getPerfilesState,
  fromPerfiles.getLoading
);
export const getPerfilesFailed = createSelector(
  getPerfilesState,
  fromPerfiles.getFailed
);

/**
 * En Configuracion store functions
 */
export const getConfiguracionState = createSelector(
  getState,
  (state: State) => state.configuracion
);
export const getConfiguracion = createSelector(
  getConfiguracionState,
  fromConfiguracion.getData
);
export const getConfiguracionLoading = createSelector(
  getConfiguracionState,
  fromConfiguracion.getLoading
);
export const getConfiguracionFailed = createSelector(
  getConfiguracionState,
  fromConfiguracion.getFailed
);

/**
 * Usuario store functions
 */
export const getUsuarioState = createSelector(
  getState,
  (state: State) => state.usuario
);
export const getUsuario = createSelector(
  getUsuarioState,
  fromUsuario.getData
);
export const getUsuarioLoaded = createSelector(
  getUsuarioState,
  fromUsuario.getLoaded
);
export const getUsuarioLoading = createSelector(
  getUsuarioState,
  fromUsuario.getLoading
);
export const getUsuarioFailed = createSelector(
  getUsuarioState,
  fromUsuario.getFailed
);

export const getPortalLoading = createSelector(
  [getPerfilesLoading, getUsuarioLoading, getPageLoading],
  (perfiles, usuario, page) => perfiles || usuario || page
);

export const getPortalFailed = createSelector(
  [getPerfilesFailed, getUsuarioFailed],
  (perfiles, usuario) => perfiles || usuario
);

/**
 * Localidades store functions
 */
export const getLocalidadesState = createSelector(
  getState,
  (state: State) => state.localidades
);
export const getLocalidades = createSelector(
  getLocalidadesState,
  fromLocalidades.getData
);

export const getLocalidadesFailed = createSelector(
  getLocalidadesState,
  fromLocalidades.getFailed
);
