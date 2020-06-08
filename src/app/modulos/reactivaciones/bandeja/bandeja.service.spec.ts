import { HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';

import { BandejaService } from './bandeja.service';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { BandejaStub } from './bandeja.stub';
import { StoreModuleForRootTest } from 'test/utils';

describe('MiBandejaDeReactivacionesService', () => {
  let service;
  let httpMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StoreModuleForRootTest],
      providers: [BandejaService, ...providersHttpInterceptors]
    });

    const injector = getTestBed();
    service = injector.get(BandejaService);
    httpMock = injector.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call api on en reactivacion', () => {
    spyOn((service as any).http, 'get');
    const endpoint = (service as any).url + 'bandeja';
    const reactivacionRequest = 'request';
    service.enReactivacion(reactivacionRequest);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint, {
      params: reactivacionRequest
    });
  });

  it('should call api on descargar excel', () => {
    const binaryData = [];
    binaryData.push('https://developer.mozilla.org/es/docs/Web/API/Blob');
    spyOn((service as any).http, 'get').and.returnValue([
      new Blob(binaryData, { type: 'application/zip' })
    ]);
    const endpoint = (service as any).url + 'reportes/cartera/excel';
    service.descargarExcel();
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint, {
      responseType: 'blob',
      params: {}
    });
  });

  it('should call api on descargar excel with search string', () => {
    const binaryData = [];
    binaryData.push('https://developer.mozilla.org/es/docs/Web/API/Blob');
    spyOn((service as any).http, 'get').and.returnValue([
      new Blob(binaryData, { type: 'application/zip' })
    ]);
    const endpoint = (service as any).url + 'reportes/cartera/excel';
    service.descargarExcel('buscar');
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint, {
      responseType: 'blob',
      params: {
        buscar: 'buscar'
      }
    });
  });

  it('should call api on cartera general', () => {
    spyOn((service as any).http, 'get');
    const endpoint = (service as any).url + 'bandejaCartera';
    const carteraGeneralRequest = {
      buscar: 'request',
      pagina: 1
    };
    service.enCarteraGeneral(carteraGeneralRequest);
    const params = new HttpParams()
      .set('buscar', carteraGeneralRequest.buscar ? carteraGeneralRequest.buscar.toString() : '')
      .set('pagina', carteraGeneralRequest.pagina ? carteraGeneralRequest.pagina.toString() : '');
    const options = { params };
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint, options);
  });

  it('should call api on cartera general without params', () => {
    spyOn((service as any).http, 'get');
    const endpoint = (service as any).url + 'bandejaCartera';
    const carteraGeneralRequest = {};
    service.enCarteraGeneral(carteraGeneralRequest);
    const params = new HttpParams().set('buscar', '').set('pagina', '');
    const options = { params };
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint, options);
  });

  it('should call api on cartera general without payload', () => {
    spyOn((service as any).http, 'get');
    const endpoint = (service as any).url + 'bandejaCartera';
    service.enCarteraGeneral();
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call api on reactivacion summary', () => {
    spyOn((service as any).http, 'get');
    const endpoint = (service as any).url + 'tooltipBandejaResueltos';
    service.reactivacionSummary();
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call http get on ingresa al caso', () => {
    spyOn((service as any).http, 'get');
    const reactivacionContratoID = 123456;
    const endpoint =
      (service as any).apiUrl +
      `/fondoColectivo/reactivacionpago/detalleContrato/bloqueosEnBandeja/${reactivacionContratoID}`;
    service.ingresaAlCaso(reactivacionContratoID);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should return contrato actual on get contrato actual', () => {
    service.contratoActual = BandejaStub.reactivaciones.input[0];
    const contratoActual = service.getContratoActual();
    expect(contratoActual).toEqual(BandejaStub.reactivaciones.input[0]);
    expect(service.contratoActual).toEqual(BandejaStub.reactivaciones.input[0]);
  });

  it('should return persona ids on get persona ids', () => {
    service.personaIds = BandejaStub.personaIds;
    const personaIds = service.getPersonaIds();
    expect(personaIds).toEqual(BandejaStub.personaIds);
    expect(service.personaIds).toEqual(BandejaStub.personaIds);
  });
});
