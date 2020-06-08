import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';

import { InicioSesionContainer } from './inicio-sesion.container';
import { InicioSesionApiService } from './inicio-sesion-api.service';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { APIError } from 'app/@compartidos/models';
import { State } from 'app/@compartidos/store';
import * as sesionActions from 'app/@compartidos/store/sesion.action';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { environment } from 'environments/environment';
import {
  StoreModuleForRootTest,
  RouterTestingModuleMockup,
  EffectsModuleForRootTest
} from 'test/utils';

describe('InicioSesionContainer', () => {
  let store: Store<State>;
  let component: InicioSesionContainer;
  let fixture: ComponentFixture<InicioSesionContainer>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InicioSesionContainer],
      imports: [
        HttpClientTestingModule,
        StoreModuleForRootTest,
        EffectsModuleForRootTest,
        RouterTestingModuleMockup,
        ReactiveFormsModule,
        CompartidosModule.forRoot()
      ],
      providers: [InicioSesionApiService, ...providersHttpInterceptors]
    }).compileComponents();

    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioSesionContainer);
    component = fixture.componentInstance;
    component.ngOnInit();
    component.animarIndicador = jasmine.createSpy('animarIndicador spy');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deberia eliminar el mensaje de error cuando este pasa por submitInicio', fakeAsync(() => {
    environment.activarRecaptcha = false;
    component.nombreUsuario.setValue('usuario');
    component.contrasenia.setValue('contrasenia');
    component.mensajeError = 'Hubo un error previo';
    component.onSubmitInicio();
    tick(500);
    fixture.detectChanges();
    expect(component.mensajeError).toBeFalsy();
  }));

  it('al cerrar el modal de recuperar clave, deberia restaurarse todos los campos del formulario recuperar', fakeAsync(() => {
    component.enviadoFormularioRecuperar = true;
    component.esCuentaBloqueada = true;
    component.esCuentaExpirada = true;
    component.recuperarUsuario.setValue('usuario');
    component.modalRecuperarClave = false;
    component.onCloseModalRecuperarClave();
    fixture.detectChanges();
    tick(1000);
    expect(component.enviadoFormularioRecuperar).toBeFalsy();
    expect(component.esCuentaBloqueada).toBeFalsy();
    expect(component.esCuentaExpirada).toBeFalsy();
    expect(component.recuperarUsuario.value).toBeNull();
  }));

  it('deberia aparecer el modal cuando es el error es ginni-001 y ginni-012', fakeAsync(() => {
    store.dispatch(new sesionActions.LoadFailAction(new APIError(403, { codigo: 'ginni-001' })));
    tick(500);
    expect(component.esCuentaBloqueada).toBeTruthy();
    store.dispatch(new sesionActions.LoadFailAction(new APIError(403, { codigo: 'ginni-012' })));
    tick(500);
    expect(component.esCuentaExpirada).toBeTruthy();
    store.dispatch(new sesionActions.LoadFailAction(new APIError(500, { mensaje: 'RANDOM' })));
    tick(500);
    expect(component.mensajeError).toEqual('RANDOM');
  }));
});
