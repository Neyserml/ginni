import { TestBed, getTestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';

import { TokenInterceptorService } from './token-interceptor.service';
import { HttpClient, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';

import { State, getSesionState } from '../store';
import * as sesionActions from '../store/sesion.action';
import { Sesion } from '../models';
import { StoreModuleForRootTest, RouterTestingModuleMockup } from 'test/utils';
import { SESION_RESPONSE, TOKEN } from 'test/utils.stub';

import 'app/@nucleo/operadores-rxjs';
import { CompartidosModule } from '../compartidos.module';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';

const TEST_URL = '/test';
const TEST_STRING = `I'm a body!`;

describe('TokenInterceptorService', () => {
  let store: Store<State>;
  let sesion$: Observable<any>;
  let httpClient: HttpClient;
  let service: TokenInterceptorService;
  let httpMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModuleMockup,
        CompartidosModule.forRoot(),
        HttpClientTestingModule,
        StoreModuleForRootTest
      ],
      providers: [TokenInterceptorService, ...providersHttpInterceptors]
    });

    store = TestBed.get(Store);
    sesion$ = store.select(getSesionState);

    spyOn(store, 'dispatch').and.callThrough();

    const injector = getTestBed();
    service = injector.get(TokenInterceptorService);
    httpClient = injector.get(HttpClient);
    httpMock = injector.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deberia retornar exitoso', done => {
    const mockErrorResponse = {
      status: 200,
      statusText: TEST_STRING
    };

    httpClient.post(TEST_URL, {}).subscribe(res => {
      expect((res as any)['data']).toEqual('hello world');
      done();
    });

    const req = httpMock.expectOne(TEST_URL);

    req.flush({ data: 'hello world' }, mockErrorResponse);
  });

  it('no deberia enviar como header el authorization si no existe sesion en el store', done => {
    const mockErrorResponse = {
      status: 200,
      statusText: TEST_STRING
    };

    httpClient.post(TEST_URL, {}).subscribe(() => {
      done();
    });

    const req = httpMock.expectOne(TEST_URL);
    expect(req.request.method).toEqual('POST');
    expect(req.request.headers.get('Authorization')).toBeNull();

    req.flush({ data: 'hello world' }, mockErrorResponse);
  });

  it('deberia retornar authorization Bearer token', done => {
    store.dispatch(new sesionActions.LoadSuccessAction(new Sesion(SESION_RESPONSE)));

    sesion$.subscribe(() => {
      const mockErrorResponse = {
        status: 200,
        statusText: TEST_STRING
      };

      httpClient.post(TEST_URL, {}, {}).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(TEST_URL);
      expect(req.request.method).toEqual('POST');
      expect(req.request.headers.get('Authorization')).toEqual('Bearer ' + TOKEN);

      req.flush({}, mockErrorResponse);
    });
  });

  it('should handle http response on intercept', () => {
    const httpResponse = new HttpResponse();
    const next: HttpHandler = {
      handle: () => Observable.of(httpResponse)
    };
    const req = new HttpRequest('GET', 'http://www.test.com/');
    spyOn(service as any, '_esUnSVG').and.returnValue(true);
    spyOn(next, 'handle');
    service.intercept(req, next);
    expect(next.handle).toHaveBeenCalledWith(req);
  });
});
