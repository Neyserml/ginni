import { getLoaded, getLoading, getPath, INITIAL_STATE, reducer } from './page.reducer';
import { LoadAction, LoadSuccessAction } from './page.action';

const state = {
  loaded: false,
  loading: false,
  path: null
};

describe('Page', () => {
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

    describe('[Page] Load', () => {
      it('should load', () => {
        const actionState = {
          token: 'ef4654da5c1d5',
          contrasenia: '123456'
        };
        const action = new LoadAction(actionState);
        const result = reducer(INITIAL_STATE, action);

        expect(result).toEqual({
          ...INITIAL_STATE,
          loading: true
        });
      });

      it('should load without payload', () => {
        const action = new LoadAction();
        const result = reducer(INITIAL_STATE, action);

        expect(result).toEqual({
          ...INITIAL_STATE,
          loading: true
        });
      });
    });

    describe('[Page] Load Success', () => {
      it('should load success', () => {
        const action = new LoadSuccessAction('state');
        const result = reducer(INITIAL_STATE, action);

        expect(result).toEqual({
          ...INITIAL_STATE,
          loaded: true,
          loading: false,
          path: 'state'
        });
      });

      it('should load success without payload', () => {
        const action = new LoadSuccessAction();
        const result = reducer(INITIAL_STATE, action);

        expect(result).toEqual({
          ...INITIAL_STATE,
          loading: false,
          loaded: true
        });
      });
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

  describe('GetPath', () => {
    it('should return path', () => {
      const result = getPath(state);

      expect(result).toEqual(state.path);
    });
  });
});
