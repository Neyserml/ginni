import { getTestBed, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

import { PortalSandbox } from './portal.sandbox';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { RouterTestingModuleMockup } from 'test/utils';

const activeRouteSnapshotStub = {
  snapshot: {
    params: {
      id: '123456'
    }
  }
};

describe('PortalSandbox', () => {
  let service: PortalSandbox;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CompartidosModule.forRoot(), RouterTestingModuleMockup],
      providers: [
        PortalSandbox,
        { provide: ActivatedRoute, useValue: activeRouteSnapshotStub },
        Title
      ]
    });
    const injector = getTestBed();
    service = injector.get(PortalSandbox);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
