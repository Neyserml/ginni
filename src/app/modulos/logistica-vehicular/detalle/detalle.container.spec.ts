import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { HeaderComponent } from 'app/modulos/portal/@components/header/header.component';
import * as configuracionAction from 'app/modulos/portal/@store/configuracion.action';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { DetalleEffect } from './@store/detalle.effect';
import { DetalleContainer } from './detalle.container';
import { DetalleSandbox } from './detalle.sandbox';
import { DetalleApiService } from './detalle-api.service';
import { EvaluacionApiService } from 'app/modulos/logistica-vehicular/detalle/evaluacion/evaluacion-api.service';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { State } from 'app/@compartidos/store';
import { ValidationService } from 'app/@compartidos/utils/validation.service';
import {
  CONFIGURACION_RESPONSE,
  RouterTestingModuleMockup,
  StoreModuleForRootTest
} from 'test/utils';
import * as sesionActions from 'app/@compartidos/store/sesion.action';
import { Sesion } from 'app/@compartidos/models';
import { SESION_RESPONSE } from 'test/utils.stub';

const activeRouteSnapshotStub = {
  snapshot: {
    params: {
      id: '123456'
    }
  }
};

xdescribe('DetalleContainer', () => {
  let component: DetalleContainer;
  let fixture: ComponentFixture<DetalleContainer>;
  let asociadoSandbox: jasmine.SpyObj<DetalleSandbox>;
  let asociadoApiService: jasmine.SpyObj<DetalleApiService>;

  beforeEach(fakeAsync(() => {
    let store: Store<State>;
    TestBed.configureTestingModule({
      imports: [
        CompartidosModule.forRoot(),
        StoreModuleForRootTest,
        RouterTestingModuleMockup,
        EffectsModule.forRoot([DetalleEffect])
      ],
      declarations: [DetalleContainer, HeaderComponent],
      providers: [
        EvaluacionApiService,
        {
          provide: PortalSandbox,
          useValue: jasmine.createSpyObj('portalSandbox', ['getUrlWithoutParams'])
        },
        {
          provide: DetalleSandbox,
          useValue: jasmine.createSpyObj('asociadoSandbox', ['obtenerId'])
        },
        {
          provide: DetalleApiService,
          useValue: jasmine.createSpyObj('asociadoApiService', ['asociadoCabecera', 'asociado'])
        },
        { provide: ActivatedRoute, useValue: activeRouteSnapshotStub },
        ValidationService
      ]
    }).compileComponents();

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    store.dispatch(new configuracionAction.LoadSuccessAction(CONFIGURACION_RESPONSE));
    store.dispatch(new sesionActions.LoadSuccessAction(new Sesion(SESION_RESPONSE)));

    const portalSandbox = TestBed.get(PortalSandbox) as jasmine.SpyObj<PortalSandbox>;
    portalSandbox.getUrlWithoutParams.and.returnValue('');

    asociadoApiService = TestBed.get(DetalleApiService) as jasmine.SpyObj<DetalleApiService>;
    asociadoApiService.asociadoCabecera.and.returnValue(
      Observable.of({
        fechaActualizacion: '2018-12-28T16:00:07.00-05:00',
        personas: [
          {
            idPersona: '214647',
            nombrePersona: 'Yupanqui Godo Luis Atahualpa',
            tipoDocumento: 'DNI',
            numeroDocumento: '10555309',
            departamento: 'LIMA',
            direccion: 'Av. Javier Prado Este 650 Of. 503 San Isidro',
            telefonos: ['3545263', '4472985', '3819769'],
            tipoPersona: 'NATURAL',
            telefonosMovil: ['941315859'],
            correo: null,
            correos: ['desarrollo@pandero.com.pe', 'test@pandero.com.pe'],
            genero: 'M',
            urlFoto:
              'https://s3-us-west-2.amazonaws.com/qa.ginni.frontfiles/avatars/male_avatar.png'
          },
          {
            idPersona: '446616',
            nombrePersona: 'CENTRO DE EST LAT AMERICANO ADM PUBLICA EIRL',
            tipoDocumento: 'RUC',
            numeroDocumento: '20185846971',
            departamento: 'LIMA',
            direccion: 'Av. Javier Prado Este 650 Of. 503 San Isidro',
            telefonos: ['6242603', '6243603', '6244603'],
            tipoPersona: 'JURÍDICA',
            telefonosMovil: ['912651887'],
            correo: null,
            correos: ['desarrollo@pandero.com.pe', 'test@pandero.com.pe'],
            genero: null,
            urlFoto:
              'https://s3-us-west-2.amazonaws.com/qa.ginni.frontfiles/avatars/persona_juridica_avatar.png'
          }
        ]
      })
    );
    asociadoApiService.asociado.and.returnValue(
      Observable.of({
        segmento: 'A',
        numeroDias: '0',
        personasId: ['214905', '214647']
      })
    );

    asociadoSandbox = TestBed.get(DetalleSandbox) as jasmine.SpyObj<DetalleSandbox>;
    asociadoSandbox.obtenerId.and.returnValue('123456');

    fixture = TestBed.createComponent(DetalleContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
