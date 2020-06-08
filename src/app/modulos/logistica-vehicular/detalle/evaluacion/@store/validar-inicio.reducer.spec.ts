import { getData, getFailed, getLoading, INITIAL_STATE, reducer } from './validar-inicio.reducer';
import { LoadAction, LoadFailAction, LoadSuccessAction } from './validar-inicio.action';

const state = {
  loading: true,
  failed: false,
  data: null
};

describe('ValidarInicio', () => {
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

    describe('[Validar Inicio] Load', () => {
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

    describe('[Validar Inicio] Load Fail', () => {
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

    describe('[Validar Inicio] Load Success', () => {
      it('should load success', () => {
        const action = new LoadSuccessAction({
          aprobada: true,
          iniciada: true,
          mensaje: 'abcdef'
        });
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
