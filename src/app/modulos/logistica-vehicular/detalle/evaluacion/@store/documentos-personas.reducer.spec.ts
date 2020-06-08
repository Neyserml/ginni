import {
  getData,
  getFailed,
  getLoading,
  INITIAL_STATE,
  reducer
} from './documentos-personas.reducer';
import { LoadAction, LoadFailAction, LoadSuccessAction } from './documentos-personas.action';

const state = {
  loading: true,
  failed: false,
  data: null
};

describe('DocumentosPersonas', () => {
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

    describe('[Documentos Personas] Load', () => {
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

    describe('[Documentos Personas] Load Fail', () => {
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

    describe('[Documentos Personas] Load Success', () => {
      it('should load success', () => {
        const action = new LoadSuccessAction([
          {
            documentos: [
              {
                archivoCargado: true,
                descripcion: 'abcdef',
                id: 123456,
                idCreditoPersona: 456789,
                nombre: 'defghi',
                url: 'http://a.co'
              }
            ],
            idCreditoPersona: 789123,
            idPersona: 159357,
            idTipoDocumento: '123456',
            garantiaReal: false,
            nombre: 'ghijkl',
            numeroDocumento: '456789',
            razonSocial: 'abc sac',
            readOnly: true,
            tipo: 'jklmno',
            tipoDocumento: 'mnopqr',
            tipoPersona: 'pqrstu',
            verificaciones: [
              {
                id: 155,
                descripcion: 'Laboral',
                estado: false,
                creditoPersonaId: 233
              }
            ]
          }
        ]);
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
