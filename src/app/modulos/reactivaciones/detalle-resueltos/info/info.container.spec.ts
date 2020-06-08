import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { BandejaStub } from 'app/modulos/reactivaciones/bandeja/bandeja.stub';
import { BandejaService } from 'app/modulos/reactivaciones/bandeja/bandeja.service';
import { DetalleResueltosService } from '../detalle-resueltos.service';
import { InfoComponent } from './info.container';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { RouterTestingModuleMockup, StoreModuleForRootTest } from 'test/utils';

describe('InfoComponent', () => {
  let component: InfoComponent;
  let fixture: ComponentFixture<InfoComponent>;
  let detalleService: jasmine.SpyObj<DetalleResueltosService>;
  let location: Location;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModuleMockup,
        CompartidosModule.forRoot(),
        StoreModuleForRootTest,
        HttpClientTestingModule
      ],
      declarations: [InfoComponent],
      providers: [BandejaService, DetalleResueltosService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoComponent);
    component = fixture.componentInstance;
    detalleService = TestBed.get(DetalleResueltosService) as jasmine.SpyObj<
      DetalleResueltosService
    >;
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle mostrarFondoDeRemate', () => {
    expect(component.mostrarFondoDeRemate).toBeFalsy();
    component.abrirFondoDeRemate();
    expect(component.mostrarFondoDeRemate).toBeTruthy();
    component.cerrarFondoDeRemate();
    expect(component.mostrarFondoDeRemate).toBeFalsy();
  });

  it('should call services on init', () => {
    (component as any).bandejaService.contratoActual = BandejaStub.reactivaciones.input[0];
    component.ngOnInit();
  });

  it('should tipo inmueble', () => {
    component.contratoActual = BandejaStub.contratoResuelto;
    const tipoInmueble = component.tipoInmueble();
    expect(tipoInmueble).toBeTruthy();
  });

  it('should tipo vehiculo', () => {
    component.contratoActual = BandejaStub.contratoResuelto;
    const tipoVehiculo = component.tipoVehiculo();
    expect(tipoVehiculo).toBeFalsy();
  });

  it('should toggle collapse', () => {
    component.state.accordeon[0] = false;
    component.state.accordeon[1] = false;
    component.state.accordeon[2] = false;
    component.toggleCollapse(1);
    expect(component.state.accordeon[0]).toBeFalsy();
    expect(component.state.accordeon[1]).toBeTruthy();
    expect(component.state.accordeon[2]).toBeFalsy();
  });
});
