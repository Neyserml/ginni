import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { BandejaStub } from '../bandeja/bandeja.stub';
import { BandejaService } from '../bandeja/bandeja.service';
import { DetalleResueltosService } from './detalle-resueltos.service';
import { DetalleComponent } from './detalle-resueltos.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { RouterTestingModuleMockup, StoreModuleForRootTest } from 'test/utils';

const activatedRoute = {
  snapshot: {
    params: {
      personaIds: [123, 456]
    }
  }
};

const bandejaStub = {
  contratoActual: BandejaStub.reactivaciones.input[0]
};

describe('AsociadoReactivacionesComponent', () => {
  let component: DetalleComponent;
  let fixture: ComponentFixture<DetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CompartidosModule.forRoot(),
        RouterTestingModuleMockup,
        StoreModuleForRootTest,
        HttpClientTestingModule
      ],
      declarations: [DetalleComponent],
      providers: [
        PortalSandbox,
        { provide: ActivatedRoute, useValue: activatedRoute },
        DetalleResueltosService,
        { provide: BandejaService, useValue: bandejaStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', inject(
    [DetalleResueltosService],
    (detalleService: DetalleResueltosService) => {
      spyOn(detalleService, 'getAsociadoCabecera').and.returnValue(
        BandejaStub.reactivaciones.cabecera
      );
      expect(component).toBeTruthy();
    }
  ));
});
