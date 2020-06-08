import { getData, getFailed, getLoading, INITIAL_STATE, reducer } from './configuracion.reducer';
import { LoadAction, LoadFailAction, LoadSuccessAction } from './configuracion.action';
import { ArrayProp } from 'app/@compartidos/models/prop.interface';

const state = {
  loading: true,
  loaded: false,
  failed: false,
  data: null
};

describe('Configuracion', () => {
  describe('Reducer', () => {
    describe('undefined state', () => {
      it('should return the default state', () => {
        const action = { type: 'NOOP' } as any;
        const result = reducer(undefined, action);

        expect(result).toBe(INITIAL_STATE);
      });
    });
    describe('undefined action', () => {
      it('should return the default state', () => {
        const result = reducer(undefined, undefined);

        expect(result).toBe(INITIAL_STATE);
      });
    });

    describe('[Configuracion] Load', () => {
      it('should load', () => {
        const action = new LoadAction('state');
        const result = reducer(INITIAL_STATE, action);

        expect(result).toEqual({
          ...INITIAL_STATE,
          loading: true,
          failed: null
        });
      });
    });

    describe('[Configuracion] Load Fail', () => {
      it('should load fail', () => {
        const action = new LoadFailAction('state');
        const result = reducer(INITIAL_STATE, action);

        expect(result).toEqual({
          ...INITIAL_STATE,
          loading: false,
          failed: action.payload
        });
      });
    });

    describe('[Configuracion] Load Success', () => {
      it('should load success', () => {
        const actionState = {
          estadoCivil: new ArrayProp(),
          ingresoEconomico: new ArrayProp(),
          origenIngreso: new ArrayProp(),
          sexo: new ArrayProp(),
          tipoCambio: 123456,
          tipoDocumento: new ArrayProp(),
          tipoMoneda: new ArrayProp(),
          tipoRelacion: new ArrayProp(),
          tipoRelacionJuridico: new ArrayProp(),
          tipoRelacionVinculado: new ArrayProp(),
          tipoTrabajador: new ArrayProp(),
          tipoZona: new ArrayProp(),
          tipoVia: new ArrayProp(),
          tipoRespaldo: new ArrayProp(),
          tipoRespaldoJuridico: new ArrayProp()
        };
        const action = new LoadSuccessAction(actionState);
        const result = reducer(INITIAL_STATE, action);

        expect(result).toEqual({
          ...INITIAL_STATE,
          loading: false,
          data: action.payload
        });
      });
    });
  });

  describe('GetData', () => {
    it('should return data', () => {
      const result = getData(state);

      expect(result).toEqual(state.data);
    });
  });

  describe('GetLoading', () => {
    it('should return loading', () => {
      const result = getLoading(state);

      expect(result).toEqual(state.loading);
    });
  });

  describe('GetFailed', () => {
    it('should return failed', () => {
      const result = getFailed(state);

      expect(result).toEqual(state.failed);
    });
  });
});
