import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, getTestBed, inject, fakeAsync, tick } from '@angular/core/testing';

import 'app/@nucleo/operadores-rxjs';
import { CompartidosModule } from '../compartidos.module';
import { APIError, ERROR_MESSAGE } from '../models/api-error.model';
import { CatchInterceptorService } from './catch-interceptor.service';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { StoreModuleForRootTest, RouterTestingModuleMockup } from 'test/utils';

const TEST_URL = '/test';
const TEST_STRING = `I'm a body!`;

describe('CatchInterceptorService', () => {
  let service;
  let httpMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModuleMockup,
        HttpClientTestingModule,
        StoreModuleForRootTest,
        CompartidosModule.forRoot()
      ],
      providers: [CatchInterceptorService, ...providersHttpInterceptors]
    });

    const injector = getTestBed();
    service = injector.get(HttpClient);
    httpMock = injector.get(HttpTestingController);
  });

  it('should be created', inject(
    [CatchInterceptorService],
    (catchInterceptor: CatchInterceptorService) => {
      expect(catchInterceptor).toBeTruthy();
    }
  ));

  function validMockup(mockErrorResponse) {
    return fakeAsync(() => {
      service.get(TEST_URL).subscribe(
        () => {},
        (error: APIError) => {
          expect(error.mensaje).toEqual(ERROR_MESSAGE);
        }
      );

      httpMock.expectOne(TEST_URL).flush({}, mockErrorResponse);
      tick(5);
    });
  }

  it(
    'deberia retornar un mensaje generico en un error de 404',
    validMockup({
      status: 404,
      statusText: TEST_STRING
    })
  );

  it(
    'deberia retornar un mensaje de no autorizado en caso 401',
    validMockup({
      status: 401,
      statusText: TEST_STRING
    })
  );

  it(
    'deberia retornar un mensaje generico en un error de 500',
    validMockup({
      status: 500,
      statusText: TEST_STRING
    })
  );
});
