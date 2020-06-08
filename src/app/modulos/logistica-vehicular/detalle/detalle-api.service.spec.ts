import { TestBed, getTestBed } from '@angular/core/testing';

import { DetalleApiService } from './detalle-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('DetalleApiService', () => {
  let httpMock;
  let service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DetalleApiService]
    });
    const injector = getTestBed();
    service = injector.get(DetalleApiService);
    httpMock = injector.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call api get on asociado', () => {
    spyOn((service as any).http, 'get');
    const bloquecontrato = '123456';
    const endpoint =
      (service as any).url + `/logistica/evaluacionCrediticia/bloquecontrato/${bloquecontrato}`;
    service.asociado(bloquecontrato);
    expect((service as any).http.get).toHaveBeenCalledWith(endpoint);
  });

  it('should call api post on asociado cabecera', () => {
    spyOn((service as any).http, 'post');
    const personasId = ['123', '456'];
    const endpoint = (service as any).url + '/administracion/persona/asociadosCabecera/';
    service.asociadoCabecera(personasId);
    expect((service as any).http.post).toHaveBeenCalledWith(endpoint, personasId);
  });
});
