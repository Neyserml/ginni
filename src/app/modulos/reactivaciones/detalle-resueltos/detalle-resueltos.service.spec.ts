import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, getTestBed } from '@angular/core/testing';

import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { DetalleResueltosService } from './detalle-resueltos.service';
import { DetalleStub } from './detalle-resueltos.stub';
import { StoreModuleForRootTest } from 'test/utils';

describe('DetalleService', () => {
  let service;
  let httpMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StoreModuleForRootTest],
      providers: [DetalleResueltosService, ...providersHttpInterceptors]
    });

    const injector = getTestBed();
    service = injector.get(DetalleResueltosService);
    httpMock = injector.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call http post on asociado cabecera', () => {
    spyOn((service as any).http, 'post');
    const personaIds = [123, 456];
    const endpoint =
      (service as any).url + `/administracion/persona/reactivaciones/asociadosCabecera`;
    service.asociadoCabecera(personaIds);
    expect((service as any).http.post).toHaveBeenCalledWith(endpoint, personaIds);
  });

  it('should call http get on asociado cabecera', () => {
    spyOn((service as any).http, 'get');
    const contratoId = 123456;
    const endpoint =
      (service as any).url + `/fondoColectivo/reactivacionpago/contratoResueltoInfo/${contratoId}`;
    service.getInformacionContratoResuelto(contratoId);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http post on get asociado cabecera', () => {
    spyOn((service as any).http, 'get');
    const contratoId = '123456';
    const endpoint =
      (service as any).url + `/fondoColectivo/reactivacioncontrato/asociados/${contratoId}`;
    service.getAsociadoCabecera(contratoId);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http get on fondo de remate', () => {
    spyOn((service as any).http, 'get');
    const contratoId = 123456;
    const endpoint =
      (service as any).url + `/fondoColectivo/reactivacionpago/fondoRemateInfo/${contratoId}`;
    service.getFondoDeRemate(contratoId);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http get on movimientos administrativos', () => {
    spyOn((service as any).http, 'get');
    const reactivacionContratoId = 123456;
    const endpoint =
      (service as any).url +
      `/fondoColectivo/reactivacionpago/movimientoadministrativo/${reactivacionContratoId}/detalle`;
    service.getMovimientosAdministrativos(reactivacionContratoId);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http get on cia detalle', () => {
    spyOn((service as any).http, 'get');
    const reactivacionContratoId = 123456;
    const endpoint =
      (service as any).url +
      `/fondoColectivo/reactivacionpago/ci/detalle?reactivacionContratoId=${reactivacionContratoId}`;
    service.getCiaDetalle(reactivacionContratoId);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http get on proximas asambleas', () => {
    spyOn((service as any).http, 'get');
    const reactivacionContratoId = 123456;
    const endpoint =
      (service as any).url +
      `/fondoColectivo/reactivacionpago/proximasAsambleas/${reactivacionContratoId}`;
    service.getProximasAsambleas(reactivacionContratoId);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http get on contrato resuelto info simulacion', () => {
    spyOn((service as any).http, 'get');
    const reactivacionContratoId = 123456;
    const endpoint =
      (service as any).url +
      `/fondoColectivo/reactivacionpago/contratoResueltoInfoSimulacion/${reactivacionContratoId}`;
    service.getContratoResueltoInfoSimulacion(reactivacionContratoId);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http get on contrato resuelto relacionados simulacion', () => {
    spyOn((service as any).http, 'get');
    const reactivacionContratoId = 123456;
    const endpoint =
      (service as any).url +
      `/fondoColectivo/reactivacionpago/contratoResueltoRelacionadosSimulacion/${reactivacionContratoId}`;
    service.getContratoResueltoRelacionadosSimulacion(reactivacionContratoId);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http get on tipos de bien', () => {
    spyOn((service as any).http, 'get');
    const endpoint = (service as any).url + `/fondoColectivo/reactivacionpago/tipoBien`;
    service.getTiposDeBien();
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http post on productos por programas y tipo de bien', () => {
    spyOn((service as any).http, 'post');
    const endpoint =
      (service as any).url +
      `/fondoColectivo/reactivacionpago/contratoResueltoSimulacion/productos`;
    service.getProductosPorContratosYTipoDeBien(DetalleStub.contratosYTipoDeBien);
    expect((service as any).http.post).toHaveBeenCalledWith(
      endpoint,
      DetalleStub.contratosYTipoDeBien
    );
  });

  it('should call http post on lista de grupos', () => {
    spyOn((service as any).http, 'post');
    const endpoint =
      (service as any).url + `/fondoColectivo/reactivacionpago/contratoResueltoSimulacion/grupos`;
    service.getListaDeGrupos(DetalleStub.listaDeGruposRequest);
    expect((service as any).http.post).toHaveBeenCalledWith(
      endpoint,
      DetalleStub.listaDeGruposRequest
    );
  });

  it('should call http get on asambleas adjudicadas', () => {
    spyOn((service as any).http, 'get');
    const grupoId = 123456;
    const endpoint =
      (service as any).url +
      `/fondoColectivo/reactivacionpago/detalleContrato/asambleasAdjudicadas/${grupoId}`;
    service.getAsambleasAdjudicadas(grupoId);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http get on inversion inmobiliaria', () => {
    spyOn((service as any).http, 'get');
    const tipoDeBien = 123456;
    const endpoint =
      (service as any).url + `/fondoColectivo/reactivacionpago/inversionInmobiliaria/${tipoDeBien}`;
    service.getInversionInmobiliaria(tipoDeBien);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http get on certificados', () => {
    spyOn((service as any).http, 'get');
    const grupoId = 123456;
    const endpoint =
      (service as any).url + `/fondoColectivo/reactivacionpago/certificados/${grupoId}`;
    service.getCertificados(grupoId);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http get on marcas by producto id', () => {
    spyOn((service as any).http, 'get');
    const productoId = 123456;
    const endpoint = (service as any).url + `/fondoColectivo/reactivacionpago/marcas/${productoId}`;
    service.getMarcasByProductoId(productoId);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http get on modelos by marca id', () => {
    spyOn((service as any).http, 'get');
    const marcaId = 123456;
    const endpoint = (service as any).url + `/fondoColectivo/reactivacionpago/modelos/${marcaId}`;
    service.getModelosByMarcaId(marcaId);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http post on get simulation', () => {
    spyOn((service as any).http, 'post');
    const simulacionRequest = DetalleStub.simuladorRequest;
    const endpoint = (service as any).url + `/fondoColectivo/reactivacionpago/simular`;
    service.getSimulation(simulacionRequest);
    expect((service as any).http.post).toHaveBeenCalledWith(endpoint, simulacionRequest);
  });

  it('should call http get on get metodos', () => {
    spyOn((service as any).http, 'get');
    const grupoId = 123456;
    const endpoint =
      (service as any).url + `/fondoColectivo/reactivacionpago/simular/metodos?grupoId=${grupoId}`;
    service.getMetodos(grupoId);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http post on guardar simulacion', () => {
    spyOn((service as any).http, 'post');
    const payload = DetalleStub.guardarSimulacionRequest;
    const endpoint = (service as any).url + `/fondoColectivo/reactivacionpago/guardarSimulacion`;
    service.guardarSimulacion(payload);
    expect((service as any).http.post).toHaveBeenCalledWith(endpoint, payload);
  });

  it('should call http put on guardar simulacion', () => {
    spyOn((service as any).http, 'put');
    const payload = DetalleStub.simuladorPutRequest;
    const endpoint = (service as any).url + `/fondoColectivo/reactivacionpago/simular`;
    service.putSimulation(payload);
    expect((service as any).http.put).toHaveBeenCalledWith(endpoint, payload);
  });

  it('should call http get on consultar validacion', () => {
    spyOn((service as any).http, 'get');
    const contratoId = 123456;
    const endpoint =
      (service as any).url + `/fondoColectivo/reactivacionpago/validarSimulacion/${contratoId}`;
    service.consultarValidacion(contratoId);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http get on cargar simulacion grupos', () => {
    spyOn((service as any).http, 'get');
    const contratoId = 123456;
    const endpoint =
      (service as any).url +
      `/fondoColectivo/reactivacionpago/cargaListaContratosInfoSimulacion/${contratoId}`;
    service.cargarSimulacionGrupos(contratoId);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http get on cargar simulacion listas', () => {
    spyOn((service as any).http, 'get');
    const contratoId = 123456;
    const endpoint =
      (service as any).url +
      `/fondoColectivo/reactivacionpago/cargarListasSimulacion/${contratoId}`;
    service.cargarSimulacionListas(contratoId);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http get on cargar simulacion', () => {
    spyOn((service as any).http, 'get');
    const contratoId = 123456;
    const endpoint =
      (service as any).url + `/fondoColectivo/reactivacionpago/cargarSimulacion/${contratoId}`;
    service.cargarSimulacion(contratoId);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http post on generar obligacion a cuenta', () => {
    spyOn((service as any).http, 'post');
    const payload = {
      bdImporte: '1120.00',
      reactivacionContratoId: '123456'
    };
    const endpoint = (service as any).url + `/fondoColectivo/reactivacionpago/contrato/generar`;
    service.generarObligacionACuenta(payload);
    expect((service as any).http.post).toHaveBeenCalledWith(endpoint, payload);
  });

  it('should call http post on pagar obligacion a cuenta', () => {
    spyOn((service as any).http, 'post');
    const payload = {
      bdImporte: '1120.00',
      reactivacionContratoId: '123456'
    };
    const endpoint =
      (service as any).url + `/fondoColectivo/reactivacionpago/pagarObligacionaCuenta`;
    service.pagarObligacionACuenta(payload);
    expect((service as any).http.post).toHaveBeenCalledWith(endpoint, payload);
  });

  it('should call http get on getting historial de pago', () => {
    spyOn((service as any).http, 'get');
    const contratoId = 123456;
    const endpoint =
      (service as any).url + `/fondoColectivo/reactivacionpago/historial/${contratoId}`;
    service.getHistorialDePago(contratoId);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http get on deletting historial de pago', () => {
    spyOn((service as any).http, 'get');
    const solicitudIdSaf = 123456;
    const endpoint =
      (service as any).url + `/fondoColectivo/reactivacionpago/eliminarPago/${solicitudIdSaf}`;
    service.deleteHistorialDePago(solicitudIdSaf);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http get on pago generado', () => {
    spyOn((service as any).http, 'get');
    const contratoId = 123456;
    const endpoint =
      (service as any).url + `/fondoColectivo/reactivacionpago/validarPagoGenerado/${contratoId}`;
    service.validarPagoGenerado(contratoId);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });
});
