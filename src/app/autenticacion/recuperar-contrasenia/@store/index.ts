import { createSelector } from 'reselect';
import * as fromEnviarContrasenia from './enviar-contrasenia.reducer';

export interface State {
  enviarContrasenia: fromEnviarContrasenia.State;
}

export const reducers = {
  enviarContrasenia: fromEnviarContrasenia.reducer
};

export const getState = state => state.recuperarContrasenia;

export const getEnviarContraseniaState = createSelector(
  getState,
  (state: State) => state.enviarContrasenia
);
export const getEnviarContrasenia = createSelector(
  getEnviarContraseniaState,
  fromEnviarContrasenia.getData
);
export const getEnviarContraseniaLoading = createSelector(
  getEnviarContraseniaState,
  fromEnviarContrasenia.getLoading
);
export const getEnviarContraseniaFailed = createSelector(
  getEnviarContraseniaState,
  fromEnviarContrasenia.getFailed
);
