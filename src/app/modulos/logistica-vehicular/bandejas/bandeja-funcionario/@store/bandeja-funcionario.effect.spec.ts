import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { APIError } from 'app/@compartidos/models';
import { ERROR_MESSAGE } from 'app/@compartidos/models/api-error.model';
import { StoreModuleForRootTest } from 'test/utils';
import { reducers as portalReducers } from 'app/modulos/portal/@store';
import { ContratoModel } from '../@models/contrato.model';
import { ITramiteRequest } from '../@models/tramite-request.interface';
import { BandejaFuncionarioApiService } from '../bandeja-funcionario-api.service';
import { BandejaFuncionarioEffect } from './bandeja-funcionario.effect';
import * as tramiteActions from './contrato-tramite.action';
import { reducers as bandejaReducers } from './index';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { PortalApiService } from 'app/modulos/portal/portal.api.service';

describe('BandejaFuncionarioEffect', () => {
  const tramiteRequest: ITramiteRequest = {
    pagina: 1,
    orden: 'nombreCliente',
    modoOrden: 'asc'
  };

  let effects: BandejaFuncionarioEffect;
  let bandejaApi;
  let portalApiService;
  let actions;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModuleForRootTest,
        StoreModule.forFeature('portal', portalReducers),
        StoreModule.forFeature('bandejaFuncionario', bandejaReducers),
        HttpClientTestingModule
      ],
      providers: [
        Actions,
        BandejaFuncionarioEffect,
        {
          provide: BandejaFuncionarioApiService,
          useValue: jasmine.createSpyObj('bandejaFuncionarioApi', ['enTramite'])
        },
        {
          provide: PortalApiService,
          useValue: jasmine.createSpyObj('portalApiService', ['guardarMensajeDocumentos'])
        },
        providersHttpInterceptors
      ]
    });

    effects = TestBed.get(BandejaFuncionarioEffect);
    actions = new ReplaySubject(1);

    bandejaApi = TestBed.get(BandejaFuncionarioApiService) as jasmine.SpyObj<
      BandejaFuncionarioApiService
    >;
    portalApiService = TestBed.get(PortalApiService) as jasmine.SpyObj<PortalApiService>;
    portalApiService.guardarMensajeDocumentos.and.returnValue(
      Observable.of({ menesaje: '', tipo: '' })
    );
  });

  it('deberia retornar un error', () => {
    bandejaApi.enTramite.and.returnValue(
      Observable.throw(new APIError(500, { mensaje: ERROR_MESSAGE }))
    );
    actions.next(new tramiteActions.LoadAction(tramiteRequest));

    effects.tramite$.subscribe(result => {
      expect(result).toEqual(new tramiteActions.LoadFailAction(ERROR_MESSAGE));
    });
  });

  it('deberia retornar exitoso', () => {
    const contratoResponse = {
      contratos: [
        {
          fechaSituacionActual: '2018-08-29T21:03:11.78-05:00',
          nombreCliente: 'Roberto Hernandez Soto',
          personaId: '123456',
          numeroContrato: '639-595-5',
          segmento: 'A',
          modalidad: 'Sorteo',
          dias: '15'
        }
      ],
      numeroPaginas: 2028,
      totalRegistros: 20277
    };

    bandejaApi.enTramite.and.returnValue(Observable.of(contratoResponse));

    actions.next(new tramiteActions.LoadAction(tramiteRequest));

    effects.tramite$.subscribe(result => {
      expect(result).toEqual(
        new tramiteActions.LoadSuccessAction(new ContratoModel(contratoResponse))
      );
    });
  });
});
