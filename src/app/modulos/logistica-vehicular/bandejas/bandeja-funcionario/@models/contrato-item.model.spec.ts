import { ContratoItem } from './contrato-item.model';

describe('ContratoItem', () => {
  let model: ContratoItem;
  const contratoItem = {
    bloqueContratoID: 'asdf456',
    contratos: '987',
    dias: '',
    fechaSituacionActual: '',
    modalidades: 'Program',
    nombres: 'John Doe',
    personaId: '123456789',
    segmento: 'C4'
  };

  afterEach(() => {
    model = null;
  });

  it('should create', () => {
    contratoItem.fechaSituacionActual = '2019-08-22T22:07:18.00Z';
    contratoItem.dias = '312';
    model = new ContratoItem(contratoItem);
    expect(model).toBeDefined();
  });

  it('should assign fecha situacion actual when no specified', () => {
    contratoItem.fechaSituacionActual = null;
    contratoItem.dias = undefined;
    model = new ContratoItem(contratoItem);
    expect(model).toBeDefined();
  });
});
