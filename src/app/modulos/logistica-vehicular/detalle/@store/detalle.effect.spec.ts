import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs/Observable';

import { DetalleApiService } from '../detalle-api.service';
import { DetalleEffect } from './detalle.effect';
import { StoreModuleForRootTest } from 'test/utils';
import { StoreModule } from '@ngrx/store';
import { reducers } from 'app/modulos/portal/@store';

describe('DetalleEffect', () => {
  const actions: Observable<any> = Observable.of({});
  let effects: DetalleEffect;
  let asociadoApiService: DetalleApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModuleForRootTest, StoreModule.forFeature('asociado', reducers)],
      providers: [
        DetalleEffect,
        provideMockActions(() => actions),
        {
          provide: DetalleApiService,
          useValue: {
            asociado: jasmine.anything(),
            asociadoCabecera: jasmine.anything()
          }
        }
      ]
    });

    effects = TestBed.get(DetalleEffect);
    asociadoApiService = TestBed.get(DetalleApiService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
