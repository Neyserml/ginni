import { getData, getFailed, getLoading, INITIAL_STATE, reducer } from './restablecer.reducer';
import { LoadAction, LoadFailAction, LoadSuccessAction } from './restablecer.action';

const state = {
  loading: true,
  failed: false,
  data: null
};

describe('Restablecer', () => {
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

    describe('[Restablecer] Load', () => {
      it('should load', () => {
        const actionState = {
          nombreUsuario: '123456'
        };
        const action = new LoadAction(actionState);
        const result = reducer(INITIAL_STATE, action);

        expect(result).toEqual({
          ...INITIAL_STATE,
          loading: true,
          failed: null
        });
      });
    });

    describe('[Restablecer] Load Fail', () => {
      it('should load fail', () => {
        const action = new LoadFailAction('state');
        const result = reducer(INITIAL_STATE, action);

        expect(result).toEqual({
          ...INITIAL_STATE,
          loading: false,
          failed: action.payload
        });
      });

      it('should load fail without payload', () => {
        const action = new LoadFailAction();
        const result = reducer(INITIAL_STATE, action);

        expect(result).toEqual({
          ...INITIAL_STATE,
          loading: false
        });
      });
    });

    describe('[Restablecer] Load Success', () => {
      it('should load success', () => {
        const action = new LoadSuccessAction({
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
