import { EditarModelStub } from './editar-model.stub';
import { PersonaRelacionada } from './persona-relacionada.model';

describe('PersonaRelacionada', () => {
  let model: PersonaRelacionada;
  const ingreso = EditarModelStub.ingreso;

  it('should create', () => {
    model = new PersonaRelacionada(ingreso, true, false);
    expect(model).toBeDefined();
  });
});
