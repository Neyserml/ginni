import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs/Observable';

import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import 'app/@nucleo/operadores-rxjs';
import { TooltipModule } from 'ng2-tooltip-directive';
import { RouterTestingModuleMockup, StoreModuleForRootTest } from 'test/utils';
import { reducers as portalReducers } from 'app/modulos/portal/@store';
import * as usuarioActions from 'app/modulos/portal/@store/usuario.action';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { Usuario } from 'app/modulos/portal/usuario';
import { reducers as bandejaReducers } from './@store';
import { BandejaFuncionarioEffect } from './@store/bandeja-funcionario.effect';
import { BandejaFuncionarioApiService } from './bandeja-funcionario-api.service';
import { BandejaFuncionarioContainer } from './bandeja-funcionario.container';
import { BandejaFuncionarioEnum, TiposEnum } from './bandeja-funcionario.enum';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { Router } from '@angular/router';

import * as descargaExcelAction from '../@store/descarga-excel.action';

xdescribe('BandejaFuncionarioComponent', () => {
  let component: BandejaFuncionarioContainer;
  let fixture: ComponentFixture<BandejaFuncionarioContainer>;
  let bandejaApi;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModuleForRootTest,
        BrowserAnimationsModule,
        RouterTestingModuleMockup,
        StoreModule.forFeature('portal', portalReducers),
        StoreModule.forFeature('bandejaFuncionario', bandejaReducers),
        EffectsModule.forRoot([BandejaFuncionarioEffect]),
        ReactiveFormsModule,
        TooltipModule,
        CompartidosModule.forRoot()
      ],
      declarations: [BandejaFuncionarioContainer],
      providers: [
        PortalSandbox,
        providersHttpInterceptors,
        {
          provide: BandejaFuncionarioApiService,
          useValue: jasmine.createSpyObj('bandejaFuncionarioApi', ['enTramite'])
        }
      ]
    }).compileComponents();

    const store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    store.dispatch(new usuarioActions.LoadSuccessAction(new Usuario()));
    bandejaApi = TestBed.get(BandejaFuncionarioApiService) as jasmine.SpyObj<
      BandejaFuncionarioApiService
    >;
    const contratoResponse = {
      contratos: [
        {
          fechaSituacionActual: '2018-08-29T21:03:11.78-05:00',
          nombreCliente: 'Roberto Hernandez Soto',
          personaId: '123456',
          numeroContrato: '639-595-5',
          segmento: 'A',
          modalidad: 'Sorteo',
          dias: '15'
        }
      ],
      numeroPaginas: 2028,
      totalRegistros: 20277
    };
    bandejaApi.enTramite.and.returnValue(Observable.of(contratoResponse));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaFuncionarioContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deberia traer la lista de contratos en tramite', () => {
    component.traerDataDeTablas();
  });

  it('cuando le das click a una columna por defecto el asc deberia ser false', () => {
    const columnasTramite = component.columnasTramite;
    expect(columnasTramite[0].focus).toBeTruthy();
    expect(columnasTramite[0].asc).toBeFalsy();
    component.clickEnColumnaMobile(columnasTramite[1], columnasTramite);

    expect(columnasTramite[0].focus).toBeFalsy();
    expect(columnasTramite[0].asc).toBeNull();
    expect(columnasTramite[1].focus).toBeTruthy();
    expect(columnasTramite[1].asc).toBeFalsy();
  });

  it('cuando le das click a una columna nuevamente deberia asc ser true', () => {
    const columnasTramite = component.columnasTramite;

    component.clickEnColumnaMobile(columnasTramite[1], columnasTramite);
    component.clickEnColumnaMobile(columnasTramite[1], columnasTramite);
    expect(columnasTramite[1].focus).toBeTruthy();
    expect(columnasTramite[1].asc).toBeTruthy();
  });

  it('deberia resaltar busqueda', () => {
    spyOn(component, 'listarRadioButtons');
    const busqueda = (component as any).resaltarBusqueda('Gomez');
    expect(busqueda).toEqual('<strong></strong>Gomez');
  });

  it('no deberia resaltar busqueda', () => {
    spyOn(component, 'listarRadioButtons');
    const busqueda = (component as any).resaltarBusqueda('');
    expect(busqueda).toEqual('<strong></strong>');
  });

  it('deberia recortar a quien tiene la palabra', () => {
    const recortado = (component as any).tieneLaPalabra('Gomez', 'g', true);
    expect(recortado).toBeFalsy();
  });

  it('no deberia recortar a quien tiene la palabra', () => {
    const recortado = (component as any).tieneLaPalabra('Gomez', 'g', false);
    expect(recortado).toBeFalsy();
  });

  it('deberia devolver un array de ceros a quien no tiene la palabra', () => {
    const recortado = (component as any).tieneLaPalabra('G0mez-Jimenez', 'g0mez-jimenez', false);
    expect(recortado).toBeTruthy();
  });

  it('deberia devolver párrafos cuando se renderiza un array de items', () => {
    const items = component.renderItem(['vehiculo', 'inmueble']);
    expect(items).toEqual('<p>vehiculo</p><p>inmueble</p>');
  });

  it('deberia devolver un texto cuando se renderiza un item', () => {
    const items = component.renderItem('vehiculo');
    expect(items).toEqual('vehiculo');
  });

  it('deberia traer data de tablas al refrescar', () => {
    spyOn(component, 'traerDataDeTablas');
    component.refrescar();
    expect(component.traerDataDeTablas).toHaveBeenCalled();
  });

  it('deberia redirigir al abrir filtro', inject([Router], router => {
    spyOn(router, 'navigate');
    component.abrirFiltro();
    expect(router.navigate).toHaveBeenCalledWith([BandejaFuncionarioEnum.Url, { filtrando: true }]);
  }));

  it('deberia despachar state al descargar excel', inject([Store], appState$ => {
    appState$.dispatch = jasmine.createSpy('dispatch');
    const textoABuscar = 'buscar';
    component.textoABuscar = textoABuscar;
    component.descargarExcel();
    expect(appState$.dispatch).toHaveBeenCalledWith(
      new descargaExcelAction.LoadAction(textoABuscar)
    );
  }));

  it('deberia filtrar tipos de categoria al ingresar nombre de categoría', () => {
    component.tiposCategoria = [
      { clave: 'vehiculo', valor: 'Vehículo' },
      { clave: 'inmueble', valor: 'Inmueble' }
    ];
    const categoria = component.nombreCategoria('vehiculo');
    expect(categoria).toEqual(
      `${component.tiposCategoria[0].clave} (${component.tiposCategoria[0].valor})`
    );
  });

  it('deberia redirigir cuando se edita un asociado', inject([Router], router => {
    spyOn(router, 'navigate');
    const bloqueContratoId = 22;
    component.redirectEditarAsociado(1);
    expect(router.navigate).toHaveBeenCalledWith([
      `${BandejaFuncionarioEnum.Url}/asociado/${bloqueContratoId}/evaluacion/crediticia`
    ]);
  }));

  describe('filtro responsive', () => {
    it('cuando le das click creas un nuevo filtro deberia actualizarlo', () => {
      const columnasResponsive = component.columnasResponsive;
      const radioColumnas = component.radioColumnas;
      const radioSelected = component.radioSelected;

      component.clickEnColumnaMobile(columnasResponsive[1], columnasResponsive);

      expect(columnasResponsive[0].focus).toBeFalsy();
      expect(columnasResponsive[0].asc).toBeNull();
      expect(columnasResponsive[1].focus).toBeTruthy();
      expect(columnasResponsive[1].asc).toBeFalsy();

      component.clickRadioFiltro(radioColumnas[2], 2);
      component.clickRadioFiltro(radioColumnas[1], 1);
      component.clickRadioFiltro(radioColumnas[3], 3);
      component.clickRadioFiltro(radioColumnas[4], 4);
      component.clickRadioFiltro(radioColumnas[3], 3);

      expect(radioSelected).toEqual([3, 4]);
      expect(radioColumnas[0].value).toBeFalsy();
      expect(radioColumnas[1].value).toBeFalsy();
      expect(radioColumnas[3].value).toBeTruthy();
      expect(radioColumnas[4].value).toBeTruthy();
    });

    it('deberia resetear los radio click realizados', () => {
      let radioColumnas = component.radioColumnas;
      let radioSelected = component.radioSelected;

      component.clickRadioFiltro(radioColumnas[3], 3);
      component.clickRadioFiltro(radioColumnas[4], 4);
      expect(radioSelected).toEqual([3, 4]);
      // Deberia resetear los click realizados
      component.listarRadioButtons();
      radioColumnas = component.radioColumnas;
      radioSelected = component.radioSelected;

      expect(radioSelected).toEqual([0, 1]);
      expect(radioColumnas[0].value).toBeTruthy();
      expect(radioColumnas[1].value).toBeTruthy();
      expect(radioColumnas[3].value).toBeFalsy();
      expect(radioColumnas[4].value).toBeFalsy();
    });

    it('deberia aplicar los filtros cuando terminas de filtrar', () => {
      let columnasResponsive = component.columnasResponsive;
      let radioColumnas = component.radioColumnas;
      const radioSelected = component.radioSelected;
      const firstSelected = radioColumnas[3];
      const secondSelected = radioColumnas[4];

      component.clickRadioFiltro(firstSelected, 3);
      component.clickRadioFiltro(secondSelected, 4);
      expect(radioSelected).toEqual([3, 4]);

      component.clickAplicarFiltro();
      columnasResponsive = component.columnasResponsive;

      expect(columnasResponsive[0].name).toEqual(firstSelected.column.name);
      expect(columnasResponsive[1].name).toEqual(secondSelected.column.name);

      component.clickEnColumnaMobile(
        columnasResponsive[1],
        columnasResponsive,
        TiposEnum.TIPO_TRAMITE
      );
      expect(columnasResponsive[1].focus).toBeTruthy();
      expect(columnasResponsive[1].asc).toBeFalsy();

      component.listarRadioButtons();

      radioColumnas = component.radioColumnas;
      component.clickRadioFiltro(radioColumnas[0], 0);
      component.clickRadioFiltro(radioColumnas[1], 1);
      component.clickAplicarFiltro();

      columnasResponsive = component.columnasResponsive;

      expect(columnasResponsive[0].focus).toBeTruthy();
      expect(columnasResponsive[0].asc).toBeFalsy();
      expect(columnasResponsive[1].focus).toBeFalsy();
    });

    it('al cambiar de tabs deberia restaurase todo', () => {
      const radioColumnas = component.radioColumnas;
      const firstNewColumn = radioColumnas[2].column;
      const secondNewColumn = radioColumnas[3].column;

      expect(component.tabEnTramite).toBeTruthy();

      component.columnasResponsive = [firstNewColumn, secondNewColumn];
      component.paginaEnTramite = 3;

      // Si le da click al mismo tab, no hacer nada
      component.alCambiarTab(true);
      expect(component.columnasResponsive[0].id).toEqual(firstNewColumn.id);

      component.alCambiarTab(false);
      component.alCambiarTab(true);

      expect(component.paginaEnTramite).toEqual(1);
      expect(component.columnasResponsive[0].id).toEqual(radioColumnas[0].column.id);
      expect(component.columnasResponsive[1].id).toEqual(radioColumnas[1].column.id);
    });
  });
});
