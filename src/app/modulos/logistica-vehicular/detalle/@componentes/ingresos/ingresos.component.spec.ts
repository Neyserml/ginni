import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { reducers } from 'app/modulos/logistica-vehicular/detalle/@store';
import { DetalleEffect } from 'app/modulos/logistica-vehicular/detalle/@store/detalle.effect';
import { DetalleApiService } from 'app/modulos/logistica-vehicular/detalle/detalle-api.service';
import { IngresosComponent } from './ingresos.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { ValidationService } from 'app/@compartidos/utils/validation.service';
import * as configuracionAction from 'app/modulos/portal/@store/configuracion.action';
import {
  CONFIGURACION_RESPONSE,
  RouterTestingModuleMockup,
  StoreModuleForRootTest
} from 'test/utils';

xdescribe('IngresosComponent', () => {
  let component: IngresosComponent;
  let fixture: ComponentFixture<IngresosComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CompartidosModule.forRoot(),
        StoreModuleForRootTest,
        RouterTestingModuleMockup,
        StoreModule.forFeature('asociadoAsociado', reducers),
        EffectsModule.forRoot([DetalleEffect])
      ],
      declarations: [IngresosComponent],
      providers: [
        PortalSandbox,
        {
          provide: DetalleApiService,
          useValue: jasmine.createSpyObj('asociadoApiService', [
            'obtenerPersonasRelacionadaPorIdRelacion',
            'registrarIngreso',
            'actualizarIngreso',
            'eliminarIngreso',
            'obtenerIngresos',
            'informacionLaboral'
          ])
        },

        ValidationService
      ]
    }).compileComponents();

    const store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    store.dispatch(new configuracionAction.LoadSuccessAction(CONFIGURACION_RESPONSE));

    const editarApiService = TestBed.get(DetalleApiService) as jasmine.SpyObj<DetalleApiService>;
    editarApiService.obtenerPersonasRelacionadaPorIdRelacion.and.returnValue(Observable.of());
    editarApiService.registrarIngreso.and.returnValue(Observable.of());
    editarApiService.actualizarIngreso.and.returnValue(Observable.of());
    editarApiService.eliminarIngreso.and.returnValue(Observable.of());
    editarApiService.obtenerIngresos.and.returnValue(Observable.of());
    editarApiService.informacionLaboral.and.returnValue(
      Observable.of({
        centroTrabajo: 'ADECO ESPAÑA',
        cargoOcupacion: {
          identificador: '103',
          descripcion: 'profesional en redes y comunicaciones'
        },
        idTipoTrabajador: 3651,
        fechaIngresoTrabajo: '20/07/1979',
        direccion: {
          idDepartamento: '15',
          idProvincia: '01',
          idDistrito: '01',
          idTipoZona: '82',
          nombreZona: 'corpac',
          idTipoVia: '95',
          direccionTexto: 'EMILIO FERRARI NIVEL 2 -P 4A',
          referencia: 'a pasos de larcomar'
        },
        contacto: {
          id: '12321321',
          numeroTelefono: '7996961',
          anexo: '038',
          correoElectronico: 'desarrollo@pandero.com.pe'
        },
        estadoPEP: true
      })
    );

    fixture = TestBed.createComponent(IngresosComponent);
    component = fixture.componentInstance;
    component.configuracion = CONFIGURACION_RESPONSE;
    component.idPersona = '123456';
    component.ingresos = [
      {
        idIngreso: 123456,
        idOrigen: '123456',
        readOnly: false,
        idTipoIngreso: '456789',
        fuente: '789123',
        ingresoMensualNeto: {
          idMoneda: 'S/',
          monto: 123.0
        }
      }
    ];
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
