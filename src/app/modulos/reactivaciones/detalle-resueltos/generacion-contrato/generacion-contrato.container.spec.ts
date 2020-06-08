import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

import { BandejaStub } from '../../bandeja/bandeja.stub';
import { DetalleResueltosService } from '../detalle-resueltos.service';
import { GeneracionContratoContainer } from './generacion-contrato.container';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { BandejaService } from 'app/modulos/reactivaciones/bandeja/bandeja.service';
import { RouterTestingModuleMockup, StoreModuleForRootTest } from 'test/utils';

describe('GeneracionContrato', () => {
  let component: GeneracionContratoContainer;
  let fixture: ComponentFixture<GeneracionContratoContainer>;
  let bandejaService;
  let location: Location;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CompartidosModule.forRoot(),
        RouterTestingModuleMockup,
        StoreModuleForRootTest,
        HttpClientTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [GeneracionContratoContainer],
      providers: [...providersHttpInterceptors, BandejaService, DetalleResueltosService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneracionContratoContainer);
    component = fixture.componentInstance;
    const injector = getTestBed();
    bandejaService = injector.get(BandejaService);
    bandejaService.contratoActual = BandejaStub.reactivaciones.input[0];
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
