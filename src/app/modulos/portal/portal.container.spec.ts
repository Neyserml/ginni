import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { HeaderComponent } from './@components/header/header.component';
import { ModalExpiracionComponent } from './@components/modal-expiracion/modal-expiracion.component';
import { SidebarComponent } from './@components/sidebar/sidebar.component';
import { SidebarItemComponent } from './@components/sidebar/sidebar-item.component';
import { reducers } from './@store';
import { PortalEffect } from './@store/portal.effect';
import { PortalApiService } from './portal.api.service';
import { PortalContainer } from './portal.container';

import { PortalSandbox } from './portal.sandbox';
import { IUsuario } from './usuario';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { Sesion } from 'app/@compartidos/models';
import * as sesionActions from 'app/@compartidos/store/sesion.action';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { RouterTestingModuleMockup, StoreModuleForRootTest } from 'test/utils';
import { SESION_RESPONSE } from 'test/utils.stub';

describe('PortalContainer', () => {
  let component: PortalContainer;
  let fixture: ComponentFixture<PortalContainer>;
  let portalApi;
  let store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        CompartidosModule.forRoot(),
        RouterTestingModuleMockup,
        StoreModuleForRootTest,
        HttpClientTestingModule,
        StoreModule.forFeature('portal', reducers),
        EffectsModule.forRoot([PortalEffect])
      ],
      declarations: [
        SidebarComponent,
        ModalExpiracionComponent,
        HeaderComponent,
        PortalContainer,
        SidebarItemComponent
      ],
      providers: [
        ...providersHttpInterceptors,
        PortalSandbox,
        {
          provide: PortalApiService,
          useValue: jasmine.createSpyObj('PortalApiService', ['perfiles', 'usuario'])
        }
      ]
    }).compileComponents();

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    store.dispatch(new sesionActions.LoadSuccessAction(new Sesion(SESION_RESPONSE)));

    portalApi = TestBed.get(PortalApiService) as jasmine.SpyObj<PortalApiService>;

    const usuarioResponse: IUsuario = {
      nombresPersona: 'LUCIA',
      apellidoPaterno: 'GUTIERREZ',
      apellidoMaterno: 'VERA',
      perfil: 'Funcionario(a) de Servicios y Ventas',
      foto: ''
    };
    portalApi.usuario.and.returnValue(Observable.of(usuarioResponse));

    const perfilesResponse = {
      menu: [
        {
          nombre: 'Bandeja de Trabajo',
          icono: 'inbox',
          clave: 'bandejacelula'
        },
        {
          nombre: 'Mi espacio',
          clave: 'miespacio',
          icono: 'home'
        },
        {
          nombre: 'Ficha del asociado',
          clave: 'fichacliente',
          icono: 'user'
        },
        {
          nombre: 'Mi bandeja de trabajo',
          clave: 'bandejaseguimientoevaluacion',
          icono: 'inbox'
        }
      ],
      paginas: [
        {
          nombre: 'Pagina Mi Espacio',
          clave: 'miespacio'
        },
        {
          nombre: 'Pagina Bandeja Funcionaria Celula',
          clave: 'bandejacelula'
        },
        {
          nombre: 'Pagina Bandeja Recuperos',
          clave: 'bandejaseguimientoevaluacion'
        },
        {
          nombre: 'Pagina Bandeja Auditoria',
          clave: 'bandejaauditoria'
        },
        {
          nombre: 'Pagina Mov. Admin.',
          clave: 'movadmin'
        },
        {
          nombre: 'Pagina Ficha Cliente',
          clave: 'fichacliente'
        },
        {
          nombre: 'Pagina Configuracion',
          clave: 'configuracion'
        },
        {
          nombre: 'Pagina Item En Tramite',
          clave: 'itementramite'
        },
        {
          nombre: 'Pagina Item Programacion Entrega',
          clave: 'itemprogramacionentrega'
        }
      ]
    };
    portalApi.perfiles.and.returnValue(Observable.of(perfilesResponse));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortalContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
