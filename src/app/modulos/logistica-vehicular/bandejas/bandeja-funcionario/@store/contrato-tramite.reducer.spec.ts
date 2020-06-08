import { getData, getFailed, getLoading, INITIAL_STATE, reducer } from './contrato-tramite.reducer';
import { LoadAction, LoadFailAction, LoadSuccessAction } from './contrato-tramite.action';

const state = {
  loading: true,
  failed: false,
  data: null
};

describe('ContratoTramite', () => {
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

    describe('[Contrato Tramite] Load', () => {
      it('should load', () => {
        const actionState = {
          pagina: 123456,
          orden: '123456',
          filtro: 'abcdef'
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

    describe('[Contrato Tramite] Load Fail', () => {
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

    describe('[Contrato Tramite] Load Success', () => {
      it('should load success', () => {
        const action = new LoadSuccessAction({
          contratos: [
            {
              ecAprobada: false,
              fechaSituacionActual: 'abcdef',
              nombres: ['defghi'],
              personaId: '123456',
              contratoId: '456789',
              numeroContrato: '789123',
              segmento: '159357',
              modalidades: ['ghijkl'],
              dias: 'jklmno',
              contratos: ['357159']
            }
          ],
          numeroPaginas: 123456,
          totalRegistros: 456789,
          mensajeDocumentos: {
            mensaje: '',
            tipo: 'error'
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
