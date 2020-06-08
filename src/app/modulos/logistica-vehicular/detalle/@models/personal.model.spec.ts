import { EditarModelStub } from './editar-model.stub';
import { PersonalModel } from './personal.model';

describe('PersonalModel', () => {
  let model: PersonalModel;
  const informacion = EditarModelStub.informacionPersonalResponse;

  it('should create', () => {
    model = new PersonalModel(informacion);
    expect(model).toBeDefined();
  });
});
