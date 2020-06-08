import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import 'app/@nucleo/operadores-rxjs';
import { InicioSesionApiService } from 'app/autenticacion/inicio-sesion/inicio-sesion-api.service';
import { Sesion, InicioSesionModel } from '../models';
import { ERROR_MESSAGE, APIError } from '../models/api-error.model';
import { GlobalEffect } from './global.effect';
import * as sesionActions from './sesion.action';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import {
  RouterTestingModuleMockup,
  declarationsRouterTest,
  StoreModuleForRootTest
} from 'test/utils';
import { SESION_RESPONSE } from 'test/utils.stub';

describe('GlobalEffect', () => {
  const inicioSesionModel = new InicioSesionModel({ nombreUsuario: '', contrasenia: '' }, '');
  let effects: GlobalEffect;
  let inicioSesionApi;
  let actions;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModuleMockup, HttpClientTestingModule, StoreModuleForRootTest],
      declarations: declarationsRouterTest,
      providers: [
        GlobalEffect,
        {
          provide: InicioSesionApiService,
          useValue: jasmine.createSpyObj('inicioSesionApi', ['login'])
        },
        provideMockActions(() => actions),
        ...providersHttpInterceptors
      ]
    });

    effects = TestBed.get(GlobalEffect);
    actions = new ReplaySubject(1);

    inicioSesionApi = TestBed.get(InicioSesionApiService) as jasmine.SpyObj<InicioSesionApiService>;
  });

  it('deberia retornar un error', () => {
    inicioSesionApi.login.and.returnValue(
      Observable.throw(new APIError(500, { mensaje: ERROR_MESSAGE }))
    );
    actions.next(new sesionActions.LoadAction(inicioSesionModel));

    effects.inicioSesion$.subscribe(result => {
      expect(result).toEqual(
        new sesionActions.LoadFailAction(new APIError(500, { mensaje: ERROR_MESSAGE }))
      );
    });
  });

  it('deberia retornar exitoso', () => {
    inicioSesionApi.login.and.returnValue(Observable.of(SESION_RESPONSE));

    actions.next(new sesionActions.LoadAction(inicioSesionModel));

    effects.inicioSesion$.subscribe(result => {
      expect(JSON.stringify(result)).toEqual(
        JSON.stringify(new sesionActions.LoadSuccessAction(new Sesion(SESION_RESPONSE)))
      );
    });
  });
});
