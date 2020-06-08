import { createSelector } from 'reselect';
import * as fromDatosPersona from './obtener-datos-personal.reducer';

export interface State {
  datosPersona: fromDatosPersona.State;
}

export const reducers = {
  datosPersona: fromDatosPersona.reducer
};

export const getState = state => state.validacionDatos;

/**
 * Datos Persona store functions
 */

export const getDatosPersonaState = createSelector(
  getState,
  (state: State) => state.datosPersona
);

export const getDatosPersona = createSelector(
  getDatosPersonaState,
  fromDatosPersona.getData
);

export const getDatosPersonaLoading = createSelector(
  getDatosPersonaState,
  fromDatosPersona.getLoading
);

export const getDatosPersonaFailed = createSelector(
  getDatosPersonaState,
  fromDatosPersona.getFailed
);
