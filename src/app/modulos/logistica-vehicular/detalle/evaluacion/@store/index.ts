import { createSelector } from 'reselect';
import * as fromContratos from './contratos.reducer';
import * as fromDocumentosPersonas from './documentos-personas.reducer';
import * as fromValidarInicioEvaluacion from './validar-inicio.reducer';
import * as fromBuscarRespaldo from './buscar-respaldo.reducer';
import * as fromGuardarRespaldo from './guardar-respaldo.reducer';
import * as fromSimuladorGuardar from './simulador-guardar.reducer';
import * as fromSeguimiento from './seguimiento.reducer';

export interface State {
  contratos: fromContratos.State;
  documentosPersonas: fromDocumentosPersonas.State;
  validarInicioEvaluacion: fromValidarInicioEvaluacion.State;
  buscarRespaldo: fromBuscarRespaldo.State;
  guardarRespaldo: fromGuardarRespaldo.State;
  simuladorGuardar: fromSimuladorGuardar.State;
  seguimiento: fromSeguimiento.State;
}

export const reducers = {
  validarInicioEvaluacion: fromValidarInicioEvaluacion.reducer,
  contratos: fromContratos.reducer,
  documentosPersonas: fromDocumentosPersonas.reducer,
  buscarRespaldo: fromBuscarRespaldo.reducer,
  guardarRespaldo: fromGuardarRespaldo.reducer,
  simuladorGuardar: fromSimuladorGuardar.reducer,
  seguimiento: fromSeguimiento.reducer
};

export const getState = state => state.evaluacion;

/**
 * Validar Inicio Evaluacion
 */
export const getValidarInicioEvaluacionState = createSelector(
  getState,
  (state: State) => state.validarInicioEvaluacion
);

export const getValidarInicioEvaluacion = createSelector(
  getValidarInicioEvaluacionState,
  fromValidarInicioEvaluacion.getData
);

export const getValidarInicioEvaluacionLoading = createSelector(
  getValidarInicioEvaluacionState,
  fromValidarInicioEvaluacion.getLoading
);

export const getValidarInicioEvaluacionFailed = createSelector(
  getValidarInicioEvaluacionState,
  fromValidarInicioEvaluacion.getFailed
);

/**
 * Contratos
 */

export const getContratosState = createSelector(
  getState,
  (state: State) => state.contratos
);

export const getContratos = createSelector(
  getContratosState,
  fromContratos.getData
);

export const getContratosLoading = createSelector(
  getContratosState,
  fromContratos.getLoading
);

export const getContratosFailed = createSelector(
  getContratosState,
  fromContratos.getFailed
);

/**
 * Documentos Personas
 */

export const getDocumentosPersonasState = createSelector(
  getState,
  (state: State) => state.documentosPersonas
);

export const getDocumentosPersonas = createSelector(
  getDocumentosPersonasState,
  fromDocumentosPersonas.getData
);

export const getDocumentosPersonasLoading = createSelector(
  getDocumentosPersonasState,
  fromDocumentosPersonas.getLoading
);

export const getDocumentosPersonasFailed = createSelector(
  getDocumentosPersonasState,
  fromDocumentosPersonas.getFailed
);

/**
 * Buscar Respaldo
 */
export const getBuscarRespaldoState = createSelector(
  getState,
  (state: State) => state.buscarRespaldo
);

export const getBuscarRespaldo = createSelector(
  getBuscarRespaldoState,
  fromBuscarRespaldo.getData
);

export const getBuscarRespaldoLoading = createSelector(
  getBuscarRespaldoState,
  fromBuscarRespaldo.getLoading
);

export const getBuscarRespaldoFailed = createSelector(
  getBuscarRespaldoState,
  fromBuscarRespaldo.getFailed
);

/**
 * Guardar Respaldo
 */
export const getGuardarRespaldoState = createSelector(
  getState,
  (state: State) => state.guardarRespaldo
);

export const getGuardarRespaldo = createSelector(
  getGuardarRespaldoState,
  fromGuardarRespaldo.getData
);

export const getGuardarRespaldoLoading = createSelector(
  getGuardarRespaldoState,
  fromGuardarRespaldo.getLoading
);

export const getGuardarRespaldoFailed = createSelector(
  getGuardarRespaldoState,
  fromGuardarRespaldo.getFailed
);

/**
 * Guardando Simulador financiamiento
 */
export const getSimuladorGuardarState = createSelector(
  getState,
  (state: State) => state.simuladorGuardar
);

export const getSimuladorGuardar = createSelector(
  getSimuladorGuardarState,
  fromSimuladorGuardar.getData
);

export const getSimuladorGuardarLoading = createSelector(
  getSimuladorGuardarState,
  fromSimuladorGuardar.getLoading
);

export const getSimuladorGuardarFailed = createSelector(
  getSimuladorGuardarState,
  fromSimuladorGuardar.getFailed
);

/**
 * Seguimiento
 */
export const getSeguimientoState = createSelector(
  getState,
  (state: State) => state.seguimiento
);

export const getSeguimiento = createSelector(
  getSeguimientoState,
  fromSeguimiento.getData
);

export const getSeguimientoLoading = createSelector(
  getSeguimientoState,
  fromSeguimiento.getLoading
);

export const getSeguimientoFailed = createSelector(
  getSeguimientoState,
  fromSeguimiento.getFailed
);
