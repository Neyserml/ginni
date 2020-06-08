import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, inject, TestBed } from '@angular/core/testing';

import { BandejaFuncionarioApiService } from './bandeja-funcionario-api.service';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { StoreModuleForRootTest } from 'test/utils';

describe('BandejaFuncionarioApiService', () => {
  let service;
  let httpMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, StoreModuleForRootTest],
      providers: [BandejaFuncionarioApiService, ...providersHttpInterceptors]
    });

    const injector = getTestBed();
    service = injector.get(BandejaFuncionarioApiService);
    httpMock = injector.get(HttpTestingController);
  });

  it('should be created', inject(
    [BandejaFuncionarioApiService],
    (bandejaDeTrabajoApi: BandejaFuncionarioApiService) => {
      expect(bandejaDeTrabajoApi).toBeTruthy();
    }
  ));

  it('should call api on evalCred validarEntrarCaso', inject(
    [BandejaFuncionarioApiService],
    (bandejaFuncionarioApi: BandejaFuncionarioApiService) => {
      spyOn((bandejaFuncionarioApi as any).http, 'post');
      const endpoint = (bandejaFuncionarioApi as any).urlEvalCred + 'bloquecontrato/entrarCaso';
      const numeroContrato = ['200-200-20'];

      bandejaFuncionarioApi.validarEntrarAlCaso(numeroContrato);
      expect((bandejaFuncionarioApi as any).http.post).toHaveBeenCalledWith(
        endpoint,
        numeroContrato
      );
    }
  ));

  it('should call api on en reactivacion', inject(
    [BandejaFuncionarioApiService],
    (bandejaDeReactivacionesApi: BandejaFuncionarioApiService) => {
      spyOn((bandejaDeReactivacionesApi as any).http, 'get');
      const endpoint = (bandejaDeReactivacionesApi as any).urlContrato + 'contrato/bandeja';
      const reactivacionRequest = 'request';
      bandejaDeReactivacionesApi.enTramite(reactivacionRequest);
      expect((bandejaDeReactivacionesApi as any).http.get).toHaveBeenCalledWith(endpoint, {
        params: reactivacionRequest
      });
    }
  ));

  it('should call api on descargar excel', inject(
    [BandejaFuncionarioApiService],
    (bandejaDeReactivacionesApi: BandejaFuncionarioApiService) => {
      const binaryData = [];
      binaryData.push('https://developer.mozilla.org/es/docs/Web/API/Blob');
      spyOn((bandejaDeReactivacionesApi as any).http, 'get').and.returnValue([
        new Blob(binaryData, { type: 'application/zip' })
      ]);
      const endpoint =
        (bandejaDeReactivacionesApi as any).urlContrato + 'contrato/bandeja/export/excel';
      bandejaDeReactivacionesApi.descargarExcel();
      expect((bandejaDeReactivacionesApi as any).http.get).toHaveBeenCalledWith(endpoint, {
        responseType: 'blob',
        params: {}
      });
    }
  ));

  it('should call api on descargar excel with search string', inject(
    [BandejaFuncionarioApiService],
    (bandejaDeReactivacionesApi: BandejaFuncionarioApiService) => {
      const binaryData = [];
      binaryData.push('https://developer.mozilla.org/es/docs/Web/API/Blob');
      spyOn((bandejaDeReactivacionesApi as any).http, 'get').and.returnValue([
        new Blob(binaryData, { type: 'application/zip' })
      ]);
      const endpoint =
        (bandejaDeReactivacionesApi as any).urlContrato + 'contrato/bandeja/export/excel';
      bandejaDeReactivacionesApi.descargarExcel('buscar');
      expect((bandejaDeReactivacionesApi as any).http.get).toHaveBeenCalledWith(endpoint, {
        responseType: 'blob',
        params: {
          filtro: 'buscar'
        }
      });
    }
  ));
});
