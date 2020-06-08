import { SimuladorDetalleContrato } from './simulador.model';
import { DetalleStub } from '../detalle-resueltos.stub';

describe('SimuladorDetalleContrato', () => {
  let model: SimuladorDetalleContrato;
  const simulationResponse = DetalleStub.simulationResponse;

  it('should create', () => {
    model = new SimuladorDetalleContrato(simulationResponse);
    expect(model).toBeDefined();
  });

  it('should create without parameter', () => {
    model = new SimuladorDetalleContrato();
    expect(model).toBeDefined();
  });
});
