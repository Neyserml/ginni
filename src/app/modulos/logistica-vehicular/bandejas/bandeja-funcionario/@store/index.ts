import { createSelector } from 'reselect';
import * as fromProgramacion from './contrato-programacion.reducer';
import * as fromTramite from './contrato-tramite.reducer';
import * as fromDescargaExcel from '../../@store/descarga-excel.reducer';

export interface State {
  tramite: fromTramite.State;
  programacion: fromProgramacion.State;
  descargar: fromDescargaExcel.State;
}

export const reducers = {
  tramite: fromTramite.reducer,
  programacion: fromProgramacion.reducer,
  descargar: fromDescargaExcel.reducer
};

export const getState = state => state.bandejaFuncionario;

/**
 * En Tramite store functions
 */
export const getTramiteState = createSelector(
  getState,
  (state: State) => state.tramite
);

export const getTramite = createSelector(
  getTramiteState,
  fromTramite.getData
);

export const getTramiteLoading = createSelector(
  getTramiteState,
  fromTramite.getLoading
);

export const getTramiteFailed = createSelector(
  getTramiteState,
  fromTramite.getFailed
);

/**
 * En Programacion store functions
 */
export const getProgramacionState = createSelector(
  getState,
  (state: State) => state.programacion
);

export const getProgramacion = createSelector(
  getProgramacionState,
  fromProgramacion.getData
);

export const getProgramacionLoading = createSelector(
  getProgramacionState,
  fromProgramacion.getLoading
);

export const getProgramacionFailed = createSelector(
  getProgramacionState,
  fromProgramacion.getFailed
);

/**
 * Descargar Excel
 */

export const getDescargaExcelState = createSelector(
  getState,
  (state: State) => state.descargar
);

export const getDescargaExcelLoading = createSelector(
  getDescargaExcelState,
  fromDescargaExcel.getLoading
);
