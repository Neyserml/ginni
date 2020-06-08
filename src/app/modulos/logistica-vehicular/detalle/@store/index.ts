import { createSelector } from 'reselect';
import * as fromDetalles from './detalle.reducer';
import { getConfiguracion } from 'app/modulos/portal/@store';
import * as fromLaboral from './laboral.reducer';
import * as fromPersonal from './personal.reducer';
import * as fromPersonasRelacionadas from './personas-relacionadas.reducer';
import * as fromIngresos from './ingresos.reducer';

export interface State {
  asociados: fromDetalles.State;
  laboral: fromLaboral.State;
  personal: fromPersonal.State;
  personasRelacionadas: fromPersonasRelacionadas.State;
  ingresos: fromIngresos.State;
}

export const reducers = {
  asociados: fromDetalles.reducer,
  laboral: fromLaboral.reducer,
  personal: fromPersonal.reducer,
  personasRelacionadas: fromPersonasRelacionadas.reducer,
  ingresos: fromIngresos.reducer
};

export const getState = state => state.asociados;

/**
 * Header asociado store functions
 */

export const getAsociadosState = createSelector(
  getState,
  (state: State) => state.asociados
);

export const getAsociado = createSelector(
  getAsociadosState,
  fromDetalles.getData
);

export const getAsociadoLoading = createSelector(
  getAsociadosState,
  fromDetalles.getLoading
);

export const getAsociadoFailed = createSelector(
  getAsociadosState,
  fromDetalles.getFailed
);

export const getAsociadoYConfiguracion = createSelector(
  [getAsociado, getConfiguracion],
  (asociado, configuracion) => ({ asociado, configuracion })
);

/**
 * En Laboral functions
 */
export const getLaboralState = createSelector(
  getState,
  (state: State) => state.laboral
);
export const getLaboral = createSelector(
  getLaboralState,
  fromLaboral.getData
);
export const getLaboralLoading = createSelector(
  getLaboralState,
  fromLaboral.getLoading
);
export const getLaboralFailed = createSelector(
  getLaboralState,
  fromLaboral.getFailed
);

/**
 * En Personal store functions
 */
export const getPersonalState = createSelector(
  getState,
  (state: State) => state.personal
);
export const getPersonal = createSelector(
  getPersonalState,
  fromPersonal.getData
);
export const getPersonalLoading = createSelector(
  getPersonalState,
  fromPersonal.getLoading
);
export const getPersonalFailed = createSelector(
  getPersonalState,
  fromPersonal.getFailed
);

/**
 * Persona relacionada
 */
export const getPersonasRelacionadasState = createSelector(
  getState,
  (state: State) => state.personasRelacionadas
);
export const getPersonasRelacionadas = createSelector(
  getPersonasRelacionadasState,
  fromPersonasRelacionadas.getData
);
export const getPersonasRelacionadasLoading = createSelector(
  getPersonasRelacionadasState,
  fromPersonasRelacionadas.getLoading
);
export const getPersonasRelacionadasFailed = createSelector(
  getPersonasRelacionadasState,
  fromPersonasRelacionadas.getFailed
);

/**
 * Obtener Ingresos
 */
export const getIngresosState = createSelector(
  getState,
  (state: State) => state.ingresos
);
export const getIngresos = createSelector(
  getIngresosState,
  fromIngresos.getData
);
export const getIngresosLoading = createSelector(
  getIngresosState,
  fromIngresos.getLoading
);
export const getIngresosFailed = createSelector(
  getIngresosState,
  fromIngresos.getFailed
);

export const getPersonalYConfiguracion = createSelector(
  [getPersonal, getConfiguracion],
  (personal, configuracion) => ({ personal, configuracion })
);
