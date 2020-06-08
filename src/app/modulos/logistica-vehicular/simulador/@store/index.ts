import { createSelector } from 'reselect';

import * as fromListarContratos from './listar-contratos.reducer';

export interface State {
  listarContratos: fromListarContratos.State;
}

export const reducers = {
  listarContratos: fromListarContratos.reducer
};

export const getState = state => state.simuladorEvaluacionCrediticia;

/**
 * Listar contratos del simulador
 */
export const getListarContratosState = createSelector(
  getState,
  (state: State) => state.listarContratos
);

export const getListarContratos = createSelector(
  getListarContratosState,
  fromListarContratos.getData
);

export const getListarContratosLoading = createSelector(
  getListarContratosState,
  fromListarContratos.getLoading
);
export const getListarContratosFailed = createSelector(
  getListarContratosState,
  fromListarContratos.getFailed
);
