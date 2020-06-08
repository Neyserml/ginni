import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { reducers as portalReducers } from 'app/modulos/portal/@store';
import { BandejaModel } from '../@models/bandeja.model';
import { IReactivacionRequest } from '../@models/bandeja.interface';
import { BandejaService } from '../bandeja.service';
import { APIError } from 'app/@compartidos/models';
import { ERROR_MESSAGE } from 'app/@compartidos/models/api-error.model';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { StoreModuleForRootTest } from 'test/utils';
import { BandejaEffect } from './bandeja.effect';
import * as reactivacionActions from './bandeja.action';
import { reducers as bandejaReducers } from './index';

describe('BandejaEffect', () => {
  const reactivacionRequest: IReactivacionRequest = {
    pagina: 1,
    orden: 'nombreCliente',
    modoOrden: 'asc'
  };

  let effects: BandejaEffect;
  let bandejaApi;
  let actions;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModuleForRootTest,
        StoreModule.forFeature('portal', portalReducers),
        StoreModule.forFeature('bandejaReactivaciones', bandejaReducers),
        HttpClientTestingModule
      ],
      providers: [
        Actions,
        BandejaEffect,
        {
          provide: BandejaService,
          useValue: jasmine.createSpyObj('miBandejaDeReactivacionesApi', ['enReactivacion'])
        },
        providersHttpInterceptors
      ]
    });

    effects = TestBed.get(BandejaEffect);
    actions = new ReplaySubject(1);

    bandejaApi = TestBed.get(BandejaService) as jasmine.SpyObj<BandejaService>;
  });

  it('deberia retornar un error', () => {
    bandejaApi.enReactivacion.and.returnValue(
      Observable.throw(new APIError(500, { mensaje: ERROR_MESSAGE }))
    );
    actions.next(new reactivacionActions.LoadAction(reactivacionRequest));

    effects.reactivacion$.subscribe(result => {
      expect(result).toEqual(new reactivacionActions.LoadFailAction(ERROR_MESSAGE));
    });
  });

  it('deberia retornar exitoso', () => {
    const reactivacionResponse = {
      contratos: [
        {
          fechaSituacionActual: '2018-08-29T21:03:11.78-05:00',
          nombreCliente: 'Roberto Hernandez Soto',
          personaId: '123456',
          contrato: ['639-595-5'],
          segmento: 'A',
          modalidad: 'Sorteo',
          dias: '15'
        }
      ],
      numeroPaginas: 2028,
      totalRegistros: 20277
    };

    bandejaApi.enReactivacion.and.returnValue(Observable.of(reactivacionResponse));

    actions.next(new reactivacionActions.LoadAction(reactivacionRequest));

    effects.reactivacion$.subscribe(result => {
      expect(result).toEqual(
        new reactivacionActions.LoadSuccessAction(new BandejaModel(reactivacionResponse))
      );
    });
  });
});
