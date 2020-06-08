import { EditarModelStub } from './editar-model.stub';
import { LaboralModel } from './laboral.model';

describe('LaboralModel', () => {
  let model: LaboralModel;
  const ingreso = EditarModelStub.response;

  it('should create', () => {
    model = new LaboralModel(ingreso);
    expect(model).toBeDefined();
  });
});
