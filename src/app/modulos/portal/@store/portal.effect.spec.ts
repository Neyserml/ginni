import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { reducers } from '.';
import { StoreModuleForRootTest } from 'test/utils';
import { PortalEffect } from './portal.effect';
import { PortalApiService } from '../portal.api.service';

describe('PortalEffect', () => {
  const actions: Observable<any> = Observable.of({});
  let effects: PortalEffect;
  let portalApiService: PortalApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        StoreModuleForRootTest,
        StoreModule.forFeature('portal', reducers)
      ],
      providers: [
        PortalEffect,
        provideMockActions(() => actions),
        {
          provide: PortalApiService,
          useValue: {
            restore: jasmine.anything()
          }
        }
      ]
    });

    effects = TestBed.get(PortalEffect);
    portalApiService = TestBed.get(PortalApiService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
