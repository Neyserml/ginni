import { createSelector } from 'reselect';
import * as fromReactivacion from './bandeja.reducer';
import * as fromDescargaExcel from './descarga-excel.reducer';

export interface State {
  reactivacion: fromReactivacion.State;
  descargar: fromDescargaExcel.State;
}

export const reducers = {
  reactivacion: fromReactivacion.reducer,
  descargar: fromDescargaExcel.reducer
};

export const getState = state => state.bandejaReactivaciones;

/**
 * En Reactivacionstore functions
 */
export const getReactivacionState = createSelector(
  getState,
  (state: State) => state.reactivacion
);

export const getReactivacion = createSelector(
  getReactivacionState,
  fromReactivacion.getData
);

export const getReactivacionLoading = createSelector(
  getReactivacionState,
  fromReactivacion.getLoading
);

export const getReactivacionFailed = createSelector(
  getReactivacionState,
  fromReactivacion.getFailed
);

export const getDescargaExcelState = createSelector(
  getState,
  (state: State) => state.descargar
);

export const getDescargaExcelLoading = createSelector(
  getDescargaExcelState,
  fromDescargaExcel.getLoading
);
