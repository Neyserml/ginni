import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { reducers } from '.';
import { EvaluacionCrediticiaEffect } from './evaluacion.effect';
import { StoreModuleForRootTest } from 'test/utils';
import { EvaluacionApiService } from '../evaluacion-api.service';

describe('EvaluacionCrediticiaEffect', () => {
  const actions: Observable<any> = Observable.of({});
  let effects: EvaluacionCrediticiaEffect;
  let evaluacionApiService: EvaluacionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModuleForRootTest,
        StoreModule.forFeature('evaluacionCrediticia', reducers)
      ],
      providers: [
        EvaluacionCrediticiaEffect,
        provideMockActions(() => actions),
        {
          provide: EvaluacionApiService,
          useValue: {
            restore: jasmine.anything()
          }
        }
      ]
    });

    effects = TestBed.get(EvaluacionCrediticiaEffect);
    evaluacionApiService = TestBed.get(EvaluacionApiService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
