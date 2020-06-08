import { getData, getFailed, getLoading, getToken, INITIAL_STATE, reducer } from './sesion.reducer';
import { LoadAction, LoadFailAction, LoadSuccessAction } from './sesion.action';
import { APIError, Sesion } from 'app/@compartidos/models';

const state = {
  token: '',
  loading: true,
  failed: null,
  data: new Sesion()
};

describe('Sesion', () => {
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

    describe('[Sesion] Load', () => {
      it('should load', () => {
        const actionState = {
          nombreUsuario: 'abcdef',
          contrasenia: '123456',
          recaptchaToken: 'efefad545fd'
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

    describe('[Sesion] Load Fail', () => {
      it('should load fail', () => {
        const action = new LoadFailAction(new APIError());
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

    describe('[Sesion] Load Success', () => {
      it('should load success', () => {
        const action = new LoadSuccessAction(new Sesion());
        const result = reducer(INITIAL_STATE, action);

        expect(result).toEqual({
          ...INITIAL_STATE,
          loading: false,
          data: action.payload,
          token: undefined
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

  describe('GetToken', () => {
    it('should return token', () => {
      const result = getToken(state);

      expect(result).toEqual(state.token);
    });
  });
});
