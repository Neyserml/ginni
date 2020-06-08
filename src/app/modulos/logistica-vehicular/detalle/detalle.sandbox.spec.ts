import { getTestBed, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { DetalleSandbox } from './detalle.sandbox';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { RouterTestingModuleMockup } from 'test/utils';

const activeRouteSnapshotStub = {
  snapshot: {
    params: {
      id: '123456'
    }
  }
};

describe('DetalleSandbox', () => {
  let service: DetalleSandbox;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CompartidosModule.forRoot(), RouterTestingModuleMockup],
      providers: [DetalleSandbox, { provide: ActivatedRoute, useValue: activeRouteSnapshotStub }]
    });
    const injector = getTestBed();
    service = injector.get(DetalleSandbox);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should obtener id', () => {
    spyOn(service as any, 'getChildrenOfActiveRoute');
    const nivel = 1;
    const id = service.obtenerId(nivel);
    expect((service as any).getChildrenOfActiveRoute).toHaveBeenCalledWith(
      { params: { id: '123456' } },
      1
    );
    expect(id).toBeNull();
  });

  it('should get children of active route', () => {
    const activeRouteSnapshotStub1 = {
      params: {
        id: '123456'
      },
      children: ['123456']
    };
    const nivel1 = 1;
    const children1 = (service as any).getChildrenOfActiveRoute(activeRouteSnapshotStub1, nivel1);
    expect(children1).toEqual('123456');

    const activeRouteSnapshotStub2 = {
      params: {
        id: '123456'
      },
      children: [
        {
          params: {
            id: '123456'
          },
          children: ['123456']
        }
      ]
    };
    const nivel2 = 2;
    const children2 = (service as any).getChildrenOfActiveRoute(activeRouteSnapshotStub2, nivel2);
    expect(children2).toEqual('123456');
  });
});
