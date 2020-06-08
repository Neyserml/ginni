import { createSelector } from 'reselect';
import * as fromDescargaExcel from '../../@store/descarga-excel.reducer';
import * as fromListaEnTramites from './listaEnTramites.reducer';
import * as fromListaAprobados from './listaAprobados.reducer';

export interface State {
  descargar: fromDescargaExcel.State;
  listaEnTramites: fromListaEnTramites.State;
  listaAprobados: fromListaAprobados.State;
}

export const reducers = {
  descargar: fromDescargaExcel.reducer,
  listaEnTramites: fromListaEnTramites.reducer,
  listaAprobados: fromListaAprobados.reducer
};

export const getState = state => state.bandejaJefeNegocios;

/**
 * Descargar Excel
 */
export const getDescargarExcelState = createSelector(
  getState,
  (state: State) => state.descargar
);

export const getDescargarExcelLoading = createSelector(
  getDescargarExcelState,
  fromDescargaExcel.getLoading
);

/**
 * Lista en Trámites
 */
export const getListaEnTramitesState = createSelector(
  getState,
  (state: State) => state.listaEnTramites
);

export const getListaEnTramites = createSelector(
  getListaEnTramitesState,
  fromListaEnTramites.getData
);

export const getListaEnTramitesLoading = createSelector(
  getListaEnTramitesState,
  fromListaEnTramites.getLoading
);

export const getListaEnTramitesFailed = createSelector(
  getListaEnTramitesState,
  fromListaEnTramites.getFailed
);

/**
 * Lista en Aprobados
 */
export const getListaAprobadosState = createSelector(
  getState,
  (state: State) => state.listaAprobados
);

export const getListaAprobados = createSelector(
  getListaAprobadosState,
  fromListaAprobados.getData
);

export const getListaAprobadosLoading = createSelector(
  getListaAprobadosState,
  fromListaAprobados.getLoading
);

export const getListaAprobadosFailed = createSelector(
  getListaAprobadosState,
  fromListaAprobados.getFailed
);
