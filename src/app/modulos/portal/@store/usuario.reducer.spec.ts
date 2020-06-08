import {
  getData,
  getFailed,
  getLoaded,
  getLoading,
  INITIAL_STATE,
  reducer
} from './usuario.reducer';
import { LoadAction, LoadFailAction, LoadSuccessAction } from './usuario.action';

const state = {
  loading: true,
  loaded: true,
  failed: false,
  data: null
};

describe('Usuario', () => {
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

    describe('[Usuario] Load', () => {
      it('should load', () => {
        const actionState = {
          token: 'ef4654da5c1d5',
          contrasenia: '123456'
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

    describe('[Usuario] Load Fail', () => {
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

    describe('[Usuario] Load Success', () => {
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
          loaded: true,
          data: action.payload
        });
      });

      it('should load success without payload', () => {
        const action = new LoadSuccessAction();
        const result = reducer(INITIAL_STATE, action);

        expect(result).toEqual({
          ...INITIAL_STATE,
          loading: false,
          loaded: true,
          failed: null,
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
