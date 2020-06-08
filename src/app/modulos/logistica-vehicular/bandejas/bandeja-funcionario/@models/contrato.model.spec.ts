import { ContratoModel } from './contrato.model';

describe('ContratoModel', () => {
  let model: ContratoModel;
  const contratoModal = {
    lista: [
      {
        fechaSituacionActual: '',
        nombres: 'John Doe',
        personaId: '123456789',
        contratos: '987',
        segmento: 'C4',
        modalidades: 'Program',
        dias: '312',
        bloqueContratoID: 'asdf456'
      }
    ],
    numeroPaginas: 3,
    totalRegistros: 10
  };

  beforeEach(() => {
    model = new ContratoModel(contratoModal);
  });

  afterEach(() => {
    model = null;
  });

  it('should create', () => {
    expect(model).toBeDefined();
  });
});
