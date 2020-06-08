import { EditarModelStub } from './editar-model.stub';
import { GuardarFormLaboral } from './guardar-form-laboral.model';

describe('GuardarFormLaboral', () => {
  let model: GuardarFormLaboral;
  const ingreso = EditarModelStub.payload;

  it('should create', () => {
    model = new GuardarFormLaboral(ingreso);
    expect(model).toBeDefined();
  });
});
