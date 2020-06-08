import {
  getData,
  getFailed,
  getLoading,
  getLoaded,
  INITIAL_STATE,
  reducer
} from './personal.reducer';
import { LoadAction, LoadFailAction, LoadSuccessAction } from './personal.action';
import { tipoTelefono } from '../@models/personal.model';

const state = {
  loading: true,
  loaded: false,
  failed: false,
  data: null
};

describe('Personal', () => {
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

    describe('[Personal] Load', () => {
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

    describe('[Personal] Load Fail', () => {
      it('should load fail', () => {
        const action = new LoadFailAction('state');
        const result = reducer(INITIAL_STATE, action);

        expect(result).toEqual({
          ...INITIAL_STATE,
          loading: false,
          loaded: true,
          failed: action.payload
        });
      });
    });

    describe('[Personal] Load Success', () => {
      it('should load success', () => {
        const actionState = {
          nombreCompleto: 'abcdef',
          tipoDocumento: '123456',
          numeroDocumento: '456789',
          correo: 'a@b.co',
          direccion: {
            idDepartamento: '789123',
            idProvincia: '159357',
            idDistrito: '753951',
            idTipoZona: 'a1',
            nombreZona: 'defghi',
            idTipoVia: 'ghijkl',
            direccionTexto: 'jklmno'
          },
          telefonos: [
            {
              tipo: tipoTelefono.FIJO,
              valor: '123456',
              id: 123456
            }
          ],
          telefonosFijos: [
            {
              tipo: tipoTelefono.FIJO,
              valor: '123456',
              id: 123456
            }
          ],
          celulares: [
            {
              tipo: tipoTelefono.FIJO,
              valor: '123456',
              id: 123456
            }
          ]
        };
        const action = new LoadSuccessAction(actionState);
        const result = reducer(INITIAL_STATE, action);

        expect(result).toEqual({
          ...INITIAL_STATE,
          loading: false,
          failed: null,
          loaded: true,
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

  describe('GetLoaded', () => {
    it('should return loaded', () => {
      const result = getLoaded(state);

      expect(result).toEqual(state.loaded);
    });
  });

  describe('GetFailed', () => {
    it('should return failed', () => {
      const result = getFailed(state);

      expect(result).toEqual(state.failed);
    });
  });
});
