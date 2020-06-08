import * as fromListaBandejas from './listar-bandeja.reducer';
import { createSelector } from 'reselect';

export interface State {
  listaBandeja: fromListaBandejas.State;
}

export const reducers = {
  listaBandeja: fromListaBandejas.reducer
};

export const getState = state => state.bandejaSeguimientoEvaluacion;

/**
 * Listar Bandeja
 */

export const getListaState = createSelector(
  getState,
  (state: State) => state.listaBandeja
);

export const getListar = createSelector(
  getListaState,
  fromListaBandejas.getData
);

export const getListarLoading = createSelector(
  getListaState,
  fromListaBandejas.getLoading
);

export const getListarFailed = createSelector(
  getListaState,
  fromListaBandejas.getFailed
);
