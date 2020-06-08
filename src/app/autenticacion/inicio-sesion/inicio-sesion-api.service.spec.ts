import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject, getTestBed } from '@angular/core/testing';

import { InicioSesionApiService } from './inicio-sesion-api.service';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { StoreModuleForRootTest, RouterTestingModuleMockup } from 'test/utils';

describe('InicioSesionApiService', () => {
  let service;
  let httpMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModuleMockup,
        StoreModuleForRootTest,
        CompartidosModule.forRoot()
      ],
      providers: [InicioSesionApiService, ...providersHttpInterceptors]
    });

    const injector = getTestBed();
    service = injector.get(InicioSesionApiService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', inject(
    [InicioSesionApiService],
    (inicioSesionApi: InicioSesionApiService) => {
      expect(inicioSesionApi).toBeTruthy();
    }
  ));

  it('deberia retornar el usuario', () => {
    const request = {
      nombreUsuario: 'usuario',
      contrasenia: '1234536'
    };
    const usuarioMock = {
      token: 'token'
    };

    service.login(request).subscribe(response => {
      expect(response).toBeDefined();
      expect(response.token).toEqual(usuarioMock.token);
    });
    const req = httpMock.expectOne(`${service.url}login`);
    expect(req.request.method).toEqual('POST');
    req.flush(usuarioMock);
  });

  it('deberia recuperar contraseña', () => {
    const request = {
      nombreUsuario: 'usuario',
      contrasenia: '1234536'
    };
    const usuarioMock = {
      token: 'token'
    };

    service.recuperarContrasenia(request).subscribe(response => {
      expect(response).toBeDefined();
      expect(response.token).toEqual(usuarioMock.token);
    });
    const req = httpMock.expectOne(`${service.url}validaReestablecerContrasenia`);
    expect(req.request.method).toEqual('POST');
    req.flush(usuarioMock);
  });

  it('deberia recuperar contraseña', () => {
    const request = {
      nombreUsuario: 'usuario',
      contrasenia: '1234536'
    };
    const usuarioMock = {
      token: 'token'
    };

    service.logout(request).subscribe(response => {
      expect(response).toBeDefined();
      expect(response.token).toEqual(usuarioMock.token);
    });
    const req = httpMock.expectOne(`${service.url}salir`);
    expect(req.request.method).toEqual('POST');
    req.flush(usuarioMock);
  });
});
