import { ObtenerGarante } from './garante.model';
import { GaranteStub } from './garante.stub';

describe('ObtenerGarante', () => {
  it('should create', () => {
    const model = new ObtenerGarante(GaranteStub.garanteDetalle);
    expect(model).toBeDefined();
  });

  it('should create with domicilio', () => {
    const model = new ObtenerGarante(GaranteStub.garanteDetalleDomicilio);
    expect(model).toBeDefined();
  });
});
