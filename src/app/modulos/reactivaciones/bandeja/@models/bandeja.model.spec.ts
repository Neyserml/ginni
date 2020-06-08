import { BandejaModel } from './bandeja.model';
import { BandejaStub } from '../bandeja.stub';

describe('ReactivacionModel', () => {
  let model: BandejaModel;
  const reactivacionModal = BandejaStub.contratoResponse;

  it('should create', () => {
    model = new BandejaModel(reactivacionModal);
    expect(model).toBeDefined();
  });
});
