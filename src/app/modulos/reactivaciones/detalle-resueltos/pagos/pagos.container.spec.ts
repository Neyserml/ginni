import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, getTestBed, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BandejaStub } from '../../bandeja/bandeja.stub';
import { DetalleResueltosService } from '../detalle-resueltos.service';
import { PagosComponent } from './pagos.container';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { BandejaService } from 'app/modulos/reactivaciones/bandeja/bandeja.service';
import { RouterTestingModuleMockup, StoreModuleForRootTest } from 'test/utils';

describe('PagosComponent', () => {
  let component: PagosComponent;
  let fixture: ComponentFixture<PagosComponent>;
  let bandejaService;

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
      declarations: [PagosComponent],
      providers: [...providersHttpInterceptors, BandejaService, DetalleResueltosService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagosComponent);
    component = fixture.componentInstance;
    const injector = getTestBed();
    bandejaService = injector.get(BandejaService);
    bandejaService.contratoActual = BandejaStub.contratoResuelto;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
