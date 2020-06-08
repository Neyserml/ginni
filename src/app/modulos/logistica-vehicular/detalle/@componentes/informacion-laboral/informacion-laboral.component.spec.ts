import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { reducers } from 'app/modulos/logistica-vehicular/detalle/@store';
import { DetalleEffect } from 'app/modulos/logistica-vehicular/detalle/@store/detalle.effect';
import { DetalleApiService } from 'app/modulos/logistica-vehicular/detalle/detalle-api.service';
import { InformacionLaboralComponent } from 'app/modulos/logistica-vehicular/detalle/@componentes/informacion-laboral/informacion-laboral.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { ValidationService } from 'app/@compartidos/utils/validation.service';
import * as configuracionAction from 'app/modulos/portal/@store/configuracion.action';
import { PortalApiService } from 'app/modulos/portal/portal.api.service';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import {
  CONFIGURACION_RESPONSE,
  RouterTestingModuleMockup,
  StoreModuleForRootTest
} from 'test/utils';

describe('InformacionLaboralComponent', () => {
  let component: InformacionLaboralComponent;
  let fixture: ComponentFixture<InformacionLaboralComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CompartidosModule.forRoot(),
        StoreModuleForRootTest,
        RouterTestingModuleMockup,
        StoreModule.forFeature('asociados', reducers),
        EffectsModule.forRoot([DetalleEffect])
      ],
      declarations: [InformacionLaboralComponent],
      providers: [
        PortalSandbox,
        {
          provide: DetalleApiService,
          useValue: jasmine.createSpyObj('asociadoApiService', ['informacionLaboral'])
        },
        {
          provide: PortalApiService,
          useValue: jasmine.createSpyObj('portalApiService', [
            'paises',
            'departamentos',
            'provincias',
            'distritos',
            'getComboProvincias',
            'getComboDistritos'
          ])
        },
        ValidationService
      ]
    }).compileComponents();

    const store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    store.dispatch(new configuracionAction.LoadSuccessAction(CONFIGURACION_RESPONSE));

    const editarApiService = TestBed.get(DetalleApiService) as jasmine.SpyObj<DetalleApiService>;
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

    const portalApiService = TestBed.get(PortalApiService) as jasmine.SpyObj<PortalApiService>;
    const emptyObservable = Observable.of([]);
    portalApiService.paises.and.returnValue(emptyObservable);
    portalApiService.departamentos.and.returnValue(emptyObservable);
    portalApiService.provincias.and.returnValue(emptyObservable);
    portalApiService.distritos.and.returnValue(emptyObservable);
    portalApiService.getComboProvincias.and.returnValue(emptyObservable);
    portalApiService.getComboDistritos.and.returnValue(emptyObservable);

    fixture = TestBed.createComponent(InformacionLaboralComponent);
    component = fixture.componentInstance;
    component.configuracion = CONFIGURACION_RESPONSE;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
