import {
  getData,
  getFailed,
  getLoading,
  INITIAL_STATE,
  reducer
} from './personas-relacionadas.reducer';
import { LoadAction, LoadFailAction, LoadSuccessAction } from './personas-relacionadas.action';

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
          failed: action.payload
        });
      });
    });

    describe('[Personal] Load Success', () => {
      it('should load success', () => {
        const actionState = [
          {
            idPersona: 123456,
            idPersonaRelacionada: 456789,
            idRelacion: 789123,
            nombre: 'abcdef',
            tipoRelacion: '123456',
            tipoDocumento: '456789',
            idTipoDocumento: 159357,
            numeroDocumento: '789123'
          }
        ];
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
