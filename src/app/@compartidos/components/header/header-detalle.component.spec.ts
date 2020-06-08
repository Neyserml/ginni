import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TextMaskModule } from 'angular2-text-mask';

import { HeaderDetalleComponent } from './header-detalle.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { RouterTestingModuleMockup, StoreModuleForRootTest } from 'test/utils';

const activeRouteSnapshotStub = {
  snapshot: {
    queryParams: {
      personaIds: [123, 456]
    }
  }
};

xdescribe('HeaderDetalleComponent', () => {
  let component: HeaderDetalleComponent;
  let fixture: ComponentFixture<HeaderDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TextMaskModule,
        RouterTestingModule,
        StoreModuleForRootTest,
        CompartidosModule.forRoot(),
        RouterTestingModuleMockup
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activeRouteSnapshotStub },
        providersHttpInterceptors
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderDetalleComponent);
    component = fixture.componentInstance;
    component.fechaActualizacion = '2024-02-23T09:00:00.00-05:00';
    component.idBloqueContrato = '123456';
    component.categoria = '456789';
    component.datosAsociados = [];
    component.datosAsociadoHeight = 80;
    component.numeroDias = 10;
    component.personaActualIndex = 0;
    component.mensajesSistema = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should unsubscribe each one on desregistrar eventos', () => {
    (component as any).subscriptions.forEach(sub => {
      spyOn(sub, 'unsubscribe');
    });
    (component as any).desregistrarEventos();
    (component as any).subscriptions.forEach(sub => {
      expect(sub.unsubscribe).toHaveBeenCalled();
    });
  });

  it('should desregistrar evento on destroy', () => {
    spyOn(component as any, 'desregistrarEventos');
    component.ngOnDestroy();
    expect((component as any).desregistrarEventos).toHaveBeenCalled();
  });

  it('should toggle active mas datos on toggle mas datos', () => {
    expect(component.activeMasDatos).toBeFalsy();
    component.toggleMasDatos();
    expect(component.activeMasDatos).toBeTruthy();
  });

  it('should navigate on abrir data', () => {
    component.datosAsociados = [
      {
        idPersona: '123456',
        nombrePersona: 'nombre',
        tipoDocumento: 'dni',
        tipoPersona: 'natural',
        numeroDocumento: '12345678',
        departamento: 'lima',
        telefonos: ['987654321', '965478321'],
        telefonosMovil: ['4516845', '4876516'],
        correo: 'a@b.co',
        genero: 'masculino',
        urlFoto: 'https://s3.aws.com/a.jpg'
      }
    ];
    spyOn((component as any).router, 'navigate');
    component.abrirEditar();
    expect((component as any).router.navigate).toHaveBeenCalledWith([
      '/portal/bandeja-de-trabajo/asociado/' +
        component.idBloqueContrato +
        '/editar/' +
        component.datosAsociadoActual.idPersona
    ]);
  });
});
