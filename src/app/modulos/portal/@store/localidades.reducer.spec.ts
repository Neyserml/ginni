import { getData, getFailed, INITIAL_STATE, reducer } from './localidades.reducer';
import {
  LoadPaisesAction,
  LoadPaisesSuccessAction,
  LoadDepartametoAction,
  LoadDepartametoSuccessAction,
  LoadFailedAction
} from './localidades.action';

const state = {
  failed: false,
  data: null
};

describe('Localidades', () => {
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

    describe('[Localidades] Load Paises', () => {
      it('should load paises', () => {
        const paises = 'paises';
        const action = new LoadPaisesAction(paises);
        const result = reducer(INITIAL_STATE, action);

        expect<any>(result).toEqual({
          ...INITIAL_STATE,
          data: {
            paises
          }
        });
      });
    });

    describe('[Localidades] Load Paises Success', () => {
      it('should load paises success', () => {
        const paises = 'paises';
        const action = new LoadPaisesSuccessAction(paises);
        const result = reducer(INITIAL_STATE, action);

        expect<any>(result).toEqual({
          ...INITIAL_STATE,
          data: {
            paises
          }
        });
      });

      it('should load paises success without payload', () => {
        const action = new LoadPaisesSuccessAction();
        const result = reducer(INITIAL_STATE, action);

        expect<any>(result).toEqual({
          ...INITIAL_STATE,
          data: {
            paises: null
          }
        });
      });
    });

    describe('[Localidades] Load Departamento', () => {
      it('should load departamento', () => {
        const departamentos = 'departamentos';
        const action = new LoadDepartametoAction(departamentos);
        const result = reducer(INITIAL_STATE, action);

        expect<any>(result).toEqual({
          ...INITIAL_STATE,
          data: {
            departamentos
          }
        });
      });

      it('should load departamento without payload', () => {
        const action = new LoadDepartametoAction();
        const result = reducer(INITIAL_STATE, action);

        expect<any>(result).toEqual({
          ...INITIAL_STATE,
          data: {
            departamentos: null
          }
        });
      });
    });

    describe('[Localidades] Load Departamento success', () => {
      it('should load departamento success', () => {
        const departamentos = 'departamentos';
        const action = new LoadDepartametoSuccessAction(departamentos);
        const result = reducer(INITIAL_STATE, action);

        expect<any>(result).toEqual({
          ...INITIAL_STATE,
          data: {
            departamentos
          }
        });
      });

      it('should load departamento success without payload', () => {
        const action = new LoadDepartametoSuccessAction();
        const result = reducer(INITIAL_STATE, action);

        expect<any>(result).toEqual({
          ...INITIAL_STATE,
          data: {
            departamentos: null
          }
        });
      });
    });

    describe('[Localidades] Load failed', () => {
      it('should load fail', () => {
        const action = new LoadFailedAction('state');
        const result = reducer(INITIAL_STATE, action);

        expect<any>(result).toEqual({
          ...INITIAL_STATE,
          failed: action.payload
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

  describe('GetFailed', () => {
    it('should return failed', () => {
      const result = getFailed(state);

      expect(result).toEqual(state.failed);
    });
  });
});
