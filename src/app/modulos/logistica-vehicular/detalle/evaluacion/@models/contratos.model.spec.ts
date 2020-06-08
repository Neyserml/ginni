import { ModalContratos } from './contratos.model';
import { ContratosStub } from './contratos.stub';

describe('ModalContratos', () => {
  let model: ModalContratos;

  it('should create', () => {
    const modalContratos = ContratosStub.modalContratos;
    model = new ModalContratos(modalContratos);
    expect(model).toBeDefined();
  });

  it('should create', () => {
    model = new ModalContratos();
    expect(model).toEqual([]);
  });
});
