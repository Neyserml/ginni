import { getData, getFailed, getLoading, INITIAL_STATE, reducer } from './detalle.reducer';
import { LoadAction, LoadFailAction, LoadSuccessAction, ResetAction } from './detalle.action';

const state = {
  loading: true,
  failed: false,
  id: 'id',
  data: null
};

describe('DetalleReducer', () => {
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

    describe('[Detalles] datos detalles Load', () => {
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

    describe('[Detalles] datos detalles Fail', () => {
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

    describe('[Detalles] datos detalles Success', () => {
      it('should load success', () => {
        const action = new LoadSuccessAction({
          id: 'id',
          data: {
            segmento: 'segmento',
            numeroDias: 2,
            fechaActualizacion: new Date().toString(),
            personas: []
          }
        });
        const result = reducer(INITIAL_STATE, action);

        expect(result).toEqual({
          ...INITIAL_STATE,
          loading: false,
          id: action.payload.id,
          data: action.payload.data
        });
      });

      it('should load success without payload', () => {
        const action = new LoadSuccessAction();
        const result = reducer(INITIAL_STATE, action);

        expect(result).toEqual({
          ...INITIAL_STATE,
          loading: false
        });
      });
    });

    describe('[Detalles] datos asociados Reset', () => {
      it('should reset without', () => {
        const action = new ResetAction();
        const result = reducer(INITIAL_STATE, action);

        expect(result).toEqual(INITIAL_STATE);
      });

      it('should reset with payload', () => {
        const action = new ResetAction(state);
        const result = reducer(INITIAL_STATE, action);

        expect(result).toEqual(INITIAL_STATE);
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
