import { EditarModelStub } from './editar-model.stub';
import { IngresoResponse } from './ingresos.model';

describe('IngresoResponse', () => {
  let model: IngresoResponse;
  const ingreso = EditarModelStub.ingreso;

  it('should create', () => {
    model = new IngresoResponse(ingreso);
    expect(model).toBeDefined();
  });
});
