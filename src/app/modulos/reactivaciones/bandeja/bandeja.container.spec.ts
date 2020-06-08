import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { TooltipModule } from 'ng2-tooltip-directive';
import { Ng5SliderModule } from 'ng5-slider';
import { Observable } from 'rxjs/Observable';

import { IColumna } from 'app/modulos/portal/@interface/bandejas.interface';
import { reducers as portalReducers } from 'app/modulos/portal/@store';
import * as usuarioActions from 'app/modulos/portal/@store/usuario.action';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { Usuario } from 'app/modulos/portal/usuario';
import { reducers as bandejaReducers } from './@store';
import { BandejaEffect } from './@store/bandeja.effect';
import * as descargaExcelAction from './@store/descarga-excel.action';
import { BandejaService } from './bandeja.service';
import { BandejaContainer } from './bandeja.container';
import { COLUMNAS_CARTERA_GENERAL, BandejaEnum } from './bandeja.enum';
import { BandejaStub } from './bandeja.stub';
import 'app/@nucleo/operadores-rxjs';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { RouterTestingModuleMockup, StoreModuleForRootTest } from 'test/utils';

xdescribe('BandejaDeReactivacionesComponent', () => {
  let component: BandejaContainer;
  let fixture: ComponentFixture<BandejaContainer>;
  let bandejaApi;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModuleForRootTest,
        BrowserAnimationsModule,
        RouterTestingModuleMockup,
        StoreModule.forFeature('portal', portalReducers),
        StoreModule.forFeature('bandejaReactivaciones', bandejaReducers),
        EffectsModule.forRoot([BandejaEffect]),
        FormsModule,
        ReactiveFormsModule,
        TooltipModule,
        CompartidosModule.forRoot(),
        Ng5SliderModule
      ],
      declarations: [BandejaContainer],
      providers: [
        PortalSandbox,
        providersHttpInterceptors,
        {
          provide: BandejaService,
          useValue: jasmine.createSpyObj('bandejaApi', [
            'enCarteraGeneral',
            'enReactivacion',
            'descargarExcel',
            'reactivacionSummary',
            'ingresaAlCaso'
          ])
        }
      ]
    }).compileComponents();

    const store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    store.dispatch(new usuarioActions.LoadSuccessAction(new Usuario()));
    bandejaApi = TestBed.get(BandejaService) as jasmine.SpyObj<BandejaService>;
    bandejaApi.enReactivacion.and.returnValue(Observable.of(BandejaStub.contratoResponse));
    bandejaApi.reactivacionSummary.and.returnValue(
      Observable.of(BandejaStub.reactivaciones.summary)
    );
    bandejaApi.enCarteraGeneral.and.returnValue(Observable.of(BandejaStub.carteraGeneral));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaContainer);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deberia traer la lista de contratos en reactivacion', () => {
    component.traerDataDeTablas();
  });

  it('cuando le das click a una columna por defecto el asc deberia ser false', () => {
    const columnasReactivacion = component.columnasReactivacion;
    expect(columnasReactivacion[0].focus).toBeTruthy();
    expect(columnasReactivacion[0].asc).toBeFalsy();
    expect(columnasReactivacion[9].focus).toBeFalsy();
    expect(columnasReactivacion[9].asc).toBeNull();
    component.clickEnColumna(columnasReactivacion[0], columnasReactivacion);

    expect(columnasReactivacion[0].focus).toBeTruthy();
    expect(columnasReactivacion[0].asc).toBeTruthy();
    expect(columnasReactivacion[9].focus).toBeFalsy();
    expect(columnasReactivacion[9].asc).toBeNull();
  });

  it('cuando le das click a una columna nuevamente deberia asc ser true', () => {
    const columnasReactivacion = component.columnasReactivacion;

    component.clickEnColumna(columnasReactivacion[1], columnasReactivacion);
    component.clickEnColumna(columnasReactivacion[1], columnasReactivacion);
    expect(columnasReactivacion[1].focus).toBeTruthy();
    expect(columnasReactivacion[1].asc).toBeTruthy();
  });

  it('deberia devolver el titulo en reactivacion', () => {
    expect(component.tituloEnReactivacion).toEqual(`${BandejaEnum.EnReactivacion}`);
  });

  it('deberia devolver el titulo con cantidad en reactivacion', () => {
    const enReactivacion = 10;
    component.totalEnReactivacion = enReactivacion;
    expect(component.tituloEnReactivacion).toEqual(
      `${BandejaEnum.EnReactivacion} (${enReactivacion})`
    );
  });

  it('deberia modificar las reactivaciones al hacer click en fila responsive', () => {
    const reactivaciones = BandejaStub.reactivaciones.input;
    component.reactivaciones = reactivaciones;
    component.clickEnFilaResponsive(1, reactivaciones);
    expect(component.reactivaciones).toEqual(BandejaStub.reactivaciones.output);
  });

  it('deberia reiniciar tabla al cambiar tab', () => {
    spyOn(component as any, 'reiniciarTabla');
    component.tabEnReactivacion = true;
    component.alCambiarTab(false);
    expect((component as any).reiniciarTabla).toHaveBeenCalled();
  });

  it('no deberia reiniciar tabla cuando no se cambia de tab', () => {
    spyOn(component as any, 'reiniciarTabla');
    component.tabEnReactivacion = true;
    component.alCambiarTab(true);
    expect((component as any).reiniciarTabla).not.toHaveBeenCalled();
  });

  it('deberia listar checkboxes on init', () => {
    spyOn(component, 'listarCheckbox');
    spyOn(component as any, 'registrarEventos');
    spyOn(component, 'bindBuscador');
    component.ngOnInit();
    expect(component.listarCheckbox).toHaveBeenCalled();
    expect((component as any).registrarEventos).toHaveBeenCalled();
    expect(component.bindBuscador).toHaveBeenCalled();
  });

  it('deberia redirigir al abrir filtro', inject([Router], router => {
    spyOn(router, 'navigate');
    component.abrirFiltro();
    expect(router.navigate).toHaveBeenCalledWith([BandejaEnum.Url]);
  }));

  it('deberia redirigir al cerrar filtro', () => {
    component.cerrarFiltro();
    expect(component.dialogFiltro).toBeFalsy();
  });

  it('deberia despachar state al descargar excel', inject([Store], appState$ => {
    appState$.dispatch = jasmine.createSpy('dispatch');
    component.descargarExcel();
    expect(appState$.dispatch).toHaveBeenCalledWith(new descargaExcelAction.LoadAction());
  }));

  it('deberia traer data de tablas al refrescar', () => {
    spyOn(component, 'traerDataDeTablas');
    component.refrescar();
    expect(component.traerDataDeTablas).toHaveBeenCalled();
  });

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

  it('deberia devolver párrafos cuando se renderiza un array de items', () => {
    const items = component.renderItem(['vehiculo', 'inmueble']);
    expect(items).toEqual('<p>vehiculo</p><p>inmueble</p>');
  });

  it('deberia devolver un texto cuando se renderiza un item', () => {
    const items = component.renderItem('vehiculo');
    expect(items).toEqual('vehiculo');
  });

  it('deberia redirigir cuando se edita un asociado', inject([Router], router => {
    spyOn(router, 'navigate');
    const bloqueContratoId = BandejaStub.reactivaciones.output[0];
    bandejaApi.ingresaAlCaso.and.returnValue(Observable.of(BandejaStub.bloqueosEnBandeja));
    component.reactivacionContratoDetalle(bloqueContratoId);
    expect(router.navigate).toHaveBeenCalledWith([`${BandejaEnum.Url}/detalle/info`]);
  }));

  it('deberia mostrar modal cuando se edita un asociado', inject([Router], router => {
    spyOn(router, 'navigate');
    const bloqueContratoId = BandejaStub.reactivaciones.output[0];
    bandejaApi.ingresaAlCaso.and.returnValue(Observable.of(BandejaStub.bandejaBloqueada));
    component.reactivacionContratoDetalle(bloqueContratoId);
    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('deberia cerrar modal de bloqueo de ingreso al caso', () => {
    component.cerrarBloqueoDeIngresoAlCaso();
    expect(component.mostrarBloqueoDeIngresoAlCaso).toBeFalsy();
  });

  it('deberia listar checkbox al reiniciar tabla', () => {
    spyOn(component, 'listarCheckbox');
    (component as any).reiniciarTabla();
    expect(component.listarCheckbox).toHaveBeenCalled();
  });

  it('deberia resaltar busqueda', () => {
    const busqueda = (component as any).resaltarBusqueda('Gomez', 'ome');
    expect(busqueda).toEqual('G<strong>ome</strong>z');
  });

  it('no deberia resaltar busqueda', () => {
    const busqueda = (component as any).resaltarBusqueda('', 'ome');
    expect(busqueda).toEqual('');
  });

  it('deberia recortar a quien tiene la palabra', () => {
    const recortado = (component as any).tieneLaPalabra('Gomez', 'g', true);
    expect(recortado).toEqual({ has: false, found: '' });
  });

  it('no deberia recortar a quien tiene la palabra', () => {
    const recortado = (component as any).tieneLaPalabra('Gomez', 'g', false);
    expect(recortado).toEqual({ has: false, found: 'gomez' });
  });

  it('deberia devolver un array de ceros a quien no tiene la palabra', () => {
    const recortado = (component as any).tieneLaPalabra('G0mez-Jimenez', 'g0mez-jimenez', false);
    expect(recortado).toBeTruthy();
  });

  it('should reiniciar tabla on bind buscador', () => {
    spyOn(component as any, 'reiniciarTabla');
    spyOn(component as any, 'traerDataDeTablas');
    component.bindBuscador();
    expect((component as any).reiniciarTabla).not.toHaveBeenCalled();
    expect((component as any).traerDataDeTablas).not.toHaveBeenCalled();
  });

  it('should reiniciar tabla on click aplicar filtro', () => {
    spyOn(component as any, 'clickEnColumna');
    component.setColumns();
    expect((component as any).clickEnColumna).toHaveBeenCalledWith(
      component.columnasResponsive[0],
      component.columnasResponsive
    );
  });

  it('should listar checkbox', () => {
    spyOn(component as any, 'isDefaultSelected');
    component.textoABuscar = '';
    component.reactivaciones = BandejaStub.reactivaciones.input;
    component.reactivacion$ = Observable.of(BandejaStub.reactivacionModel);
    (component as any).registrarEventos();
    component.listarCheckbox();
    expect((component as any).isDefaultSelected).toHaveBeenCalled();
  });

  it('should determine if a column is default selected', () => {
    spyOn(component as any, 'isDefaultSelected');
    const column = {
      name: 'contratos',
      id: 'contratos',
      focus: true,
      asc: true,
      className: 'th-name'
    };
    component.textoABuscar = 'Pari';
    component.reactivaciones = BandejaStub.reactivaciones.input;
    component.reactivacion$ = Observable.of(BandejaStub.reactivacionModel);
    (component as any).registrarEventos();
    const isSelected = (component as any).isDefaultSelected(column);
    expect(isSelected).toBeFalsy();
  });

  describe('filtro responsive', () => {
    it('cuando le das click creas un nuevo filtro deberia actualizarlo', () => {
      fixture.detectChanges();
      const columnasResponsive = component.columnasResponsive;
      const checkboxColumnas = component.checkboxColumnas;
      const checkboxChecked = component.checkboxChecked;

      component.clickEnColumna(columnasResponsive[1], columnasResponsive);
      expect(columnasResponsive[0].focus).toBeFalsy();
      expect(columnasResponsive[0].asc).toBeFalsy();
      expect(columnasResponsive[1].focus).toBeTruthy();
      expect(columnasResponsive[1].asc).toBeFalsy();

      component.clickCheckboxFiltro(checkboxColumnas[2], 2);
      component.clickCheckboxFiltro(checkboxColumnas[1], 1);
      component.clickCheckboxFiltro(checkboxColumnas[3], 3);
      component.clickCheckboxFiltro(checkboxColumnas[4], 4);
      component.clickCheckboxFiltro(checkboxColumnas[3], 3);

      expect(checkboxChecked).toEqual([3, 4]);
      expect(checkboxColumnas[0].value).toBeFalsy();
      expect(checkboxColumnas[1].value).toBeFalsy();
      expect(checkboxColumnas[3].value).toBeTruthy();
      expect(checkboxColumnas[4].value).toBeTruthy();
    });

    it('deberia aplicar los filtros cuando terminas de filtrar', () => {
      fixture.detectChanges();
      let columnasResponsive: IColumna[];
      let checkboxColumnas = component.checkboxColumnas;
      const checkboxChecked = component.checkboxChecked;
      const firstSelected = checkboxColumnas[3];
      const secondSelected = checkboxColumnas[4];

      component.clickCheckboxFiltro(firstSelected, 3);
      component.clickCheckboxFiltro(secondSelected, 4);
      expect(checkboxChecked).toEqual([3, 4]);

      component.setColumns();
      columnasResponsive = component.columnasResponsive;

      expect(columnasResponsive[0].name).toEqual(firstSelected.column.name);
      expect(columnasResponsive[1].name).toEqual(secondSelected.column.name);

      component.clickEnColumna(columnasResponsive[1], columnasResponsive);
      expect(columnasResponsive[1].focus).toBeTruthy();
      expect(columnasResponsive[1].asc).toBeFalsy();

      component.listarCheckbox();

      checkboxColumnas = component.checkboxColumnas;
      component.clickCheckboxFiltro(checkboxColumnas[0], 0);
      component.clickCheckboxFiltro(checkboxColumnas[1], 1);
      component.setColumns();

      columnasResponsive = component.columnasResponsive;

      expect(columnasResponsive[0].focus).toBeTruthy();
      expect(columnasResponsive[0].asc).toBeFalsy();
      expect(columnasResponsive[1].focus).toBeFalsy();
    });
  });

  it('debería tener al menos un checkbox checkeado', () => {
    component.checkboxes = [
      { label: 'A4', value: true },
      { label: 'B1', value: false },
      { label: 'C1', value: false }
    ];
    const itHasAtLeastOneCheckbox = (component as any).hasAtLeastOneCheckbox();
    expect(itHasAtLeastOneCheckbox).toBeTruthy();
  });

  it('no debería tener al menos un checkbox checkeado', () => {
    component.checkboxes = [
      { label: 'A4', value: false },
      { label: 'B1', value: false },
      { label: 'C1', value: false }
    ];
    const itHasAtLeastOneCheckbox = (component as any).hasAtLeastOneCheckbox();
    expect(itHasAtLeastOneCheckbox).toBeFalsy();
  });

  it('deberia hacer click en el filtro al hacer click en el filtro del checkbox', () => {
    spyOn(component, 'clickFilter');
    component.checkboxClickFilter();
    expect(component.clickFilter).toHaveBeenCalled();
  });

  it('no deberia hacer click en el filtro al hacer click en el filtro del checkbox', () => {
    component.state.filterDisabled.programas = true;
    spyOn(component, 'clickFilter');
    component.checkboxClickFilter();
    expect(component.clickFilter).not.toHaveBeenCalled();
  });

  it('deberia validar el rango de cia en el filtro del rango de cia', () => {
    spyOn(component as any, 'validateCiaRange');
    spyOn(component, 'clickFilter');
    component.ciaRangeFilter();
    expect((component as any).validateCiaRange).toHaveBeenCalled();
    expect(component.clickFilter).toHaveBeenCalled();
  });

  it('deberia validar el rango de cuotas pagadas en el filtro del rango de cuotas pagadas', () => {
    spyOn(component as any, 'validateCuotasRange');
    spyOn(component, 'clickFilter');
    component.cuotasRangeFilter();
    expect((component as any).validateCuotasRange).toHaveBeenCalled();
    expect(component.clickFilter).toHaveBeenCalled();
  });

  it('deberia validar rango cia', () => {
    const validated = (component as any).validateCiaRange();
    expect(validated).toBeTruthy();
  });

  it('deberia validar rango cia con high value no entero', () => {
    (component as any).cia.highValue = 'abc';
    const validated = (component as any).validateCiaRange();
    expect(validated).toBeFalsy();
  });

  it('deberia validar rango cia con value no entero', () => {
    (component as any).cia.value = 'abc';
    const validated = (component as any).validateCiaRange();
    expect(validated).toBeFalsy();
  });

  it('deberia validar rango cia con high value mayor a 120', () => {
    component.cia.highValue = 121;
    const validated = (component as any).validateCiaRange();
    expect(validated).toBeFalsy();
  });

  it('deberia validar rango cia con value menor a 0', () => {
    component.cia.value = -1;
    const validated = (component as any).validateCiaRange();
    expect(validated).toBeFalsy();
  });

  it('deberia validar rango cia con high value menor a value', () => {
    component.cia.highValue = 12;
    component.cia.value = 90;
    const validated = (component as any).validateCiaRange();
    expect(validated).toBeFalsy();
  });

  it('deberia validar rango cuotas', () => {
    const validated = (component as any).validateCuotasRange();
    expect(validated).toBeTruthy();
  });

  it('deberia validar rango cuotas con high value no entero', () => {
    (component as any).cuotasPagadas.highValue = 'abc';
    const validated = (component as any).validateCuotasRange();
    expect(validated).toBeFalsy();
  });

  it('deberia validar rango cuotas con value no entero', () => {
    (component as any).cuotasPagadas.value = 'abc';
    const validated = (component as any).validateCuotasRange();
    expect(validated).toBeFalsy();
  });

  it('deberia validar rango cuotas con high value mayor a 120', () => {
    component.cuotasPagadas.highValue = 121;
    const validated = (component as any).validateCuotasRange();
    expect(validated).toBeFalsy();
  });

  it('deberia validar rango cuotas con value menor a 0', () => {
    component.cuotasPagadas.value = -1;
    const validated = (component as any).validateCuotasRange();
    expect(validated).toBeFalsy();
  });

  it('deberia validar rango cuotas con high value menor a value', () => {
    component.cuotasPagadas.highValue = 12;
    component.cuotasPagadas.value = 90;
    const validated = (component as any).validateCuotasRange();
    expect(validated).toBeFalsy();
  });

  it('deberia validar con rango cia valido en click al filtro', () => {
    component.validCiaRange = true;
    (component as any).clickFilter();
    expect(component.noneSelected).toBeTruthy();
  });

  it('deberia validar con rango cuota valido en click al filtro', () => {
    component.validCuotasRange = true;
    (component as any).clickFilter();
    expect(component.noneSelected).toBeTruthy();
  });

  it('deberia popular el total de registros en la cartera general', () => {
    component.textoGeneralABuscar = 'buscar';
    const request = {
      buscar: 'a buscar',
      pagina: 1
    };
    component.enCarteraGeneral(request);
    expect((component as any).bandejaService.enCarteraGeneral).toHaveBeenCalledWith(request);
  });

  it('deberia cargar acción al filtrar el escritorio', () => {
    component.filterDesktop();
    expect((component as any).appState$.dispatch).toHaveBeenCalledWith(
      new usuarioActions.LoadSuccessAction(new Usuario())
    );
  });

  it('deberia validar si es el estado por defecto', () => {
    const validate = (component as any).isDefaultState();
    expect(validate).toBeTruthy();
  });

  it('deberia cambiar de tab', () => {
    expect(component.state.tabs.reactivaciones).toBeTruthy();
    expect(component.state.tabs.carteraGeneral).toBeFalsy();
    (component as any).onClickChangeTab('carteraGeneral');
    expect(component.state.tabs.reactivaciones).toBeFalsy();
    expect(component.state.tabs.carteraGeneral).toBeTruthy();
    (component as any).onClickChangeTab('reactivaciones');
    expect(component.state.tabs.reactivaciones).toBeTruthy();
    expect(component.state.tabs.carteraGeneral).toBeFalsy();
  });

  it('deberia resetear todos los valores a los iniciales', () => {
    component.checkboxes = [
      { label: 'A4', value: true },
      { label: 'B1', value: true },
      { label: 'C1', value: true }
    ];

    component.state.filter.all = false;
    component.cia.highValue = 10;
    component.cia.value = 10;
    component.cuotasPagadas.highValue = 10;
    component.cuotasPagadas.value = 10;

    expect(component.cia.highValue).toEqual(10);
    expect(component.cia.value).toEqual(10);
    expect(component.cuotasPagadas.highValue).toEqual(10);
    expect(component.cuotasPagadas.value).toEqual(10);
    expect(component.state.filter.all).toBeFalsy();

    (component as any).selectAll();

    expect(component.cia.highValue).toEqual(100);
    expect(component.cia.value).toEqual(0);
    expect(component.cuotasPagadas.highValue).toEqual(120);
    expect(component.cuotasPagadas.value).toEqual(0);
    expect(component.state.filter.all).toBeFalsy();
  });

  it('deberia generar el payload', () => {
    component.checkboxes = [
      { label: 'A4', value: true },
      { label: 'B1', value: true },
      { label: 'C1', value: true }
    ];
    const payload = (component as any).generatePayload();
    expect(payload).toEqual({
      pagina: 1,
      programa: 'A4,B1,C1',
      cia: '0,100',
      cuotasPagadas: '0,120',
      filtroRojo: 0
    });
  });

  it('deberia mostrar todos los filtros seleccionados', () => {
    spyOn(component as any, 'selectAll');
    spyOn(component as any, 'clickFilter');
    spyOn(component as any, 'ciaRangeFilter');
    spyOn(component as any, 'cuotasRangeFilter');
    expect(component.state.filter.all).toBeTruthy();
    component.showAll();
    expect((component as any).selectAll).toHaveBeenCalled();
    expect(component.state.filter.all).toBeFalsy();
    expect((component as any).clickFilter).toHaveBeenCalled();
    expect((component as any).ciaRangeFilter).toHaveBeenCalled();
    expect((component as any).cuotasRangeFilter).toHaveBeenCalled();
  });

  it('no deberia mostrar los filtros cuando está deshabilitado', () => {
    spyOn(component as any, 'selectAll');
    spyOn(component as any, 'clickFilter');
    spyOn(component as any, 'ciaRangeFilter');
    spyOn(component as any, 'cuotasRangeFilter');
    expect(component.state.filter.all).toBeTruthy();
    component.state.filterDisabled.all = true;
    component.showAll();
    expect((component as any).selectAll).not.toHaveBeenCalled();
    expect(component.state.filter.all).toBeTruthy();
    expect((component as any).clickFilter).not.toHaveBeenCalled();
    expect((component as any).ciaRangeFilter).not.toHaveBeenCalled();
    expect((component as any).cuotasRangeFilter).not.toHaveBeenCalled();
  });

  it('deberia mostrar los próximos', () => {
    spyOn(component as any, 'clickFilter');
    component.showProximos();
    expect(component.state.filterDisabled.all).toBeFalsy();
    expect(component.state.filterDisabled.programas).toBeFalsy();
    expect(component.state.filterDisabled.cia).toBeFalsy();
    expect(component.state.filterDisabled.cuotas).toBeFalsy();
    expect(component.state.filterDisabled.cuotas).toBeFalsy();
    expect(component.noneSelected).toBeFalsy();
    expect((component as any).clickFilter).toHaveBeenCalled();
  });

  it('no deberia mostrar los próximos', () => {
    spyOn(component as any, 'clickFilter');
    component.state.filter.proximos = true;
    component.showProximos();
    expect(component.state.filterDisabled.all).toBeTruthy();
    expect(component.state.filterDisabled.programas).toBeTruthy();
    expect(component.state.filterDisabled.cia).toBeTruthy();
    expect(component.state.filterDisabled.cuotas).toBeTruthy();
    expect(component.state.filterDisabled.cuotas).toBeTruthy();
    expect(component.noneSelected).toBeFalsy();
    expect((component as any).clickFilter).not.toHaveBeenCalled();
  });

  it('deberia paginar cartera general', () => {
    component.carteraGeneral = BandejaStub.carteraGeneralResponsive;
    component.paginarCarteraGeneral();
    expect(component.carteraGeneral).toEqual([]);
  });

  it('deberia paginar cartera general con texto a buscar', () => {
    spyOn(component, 'enCarteraGeneral');
    component.carteraGeneral = BandejaStub.carteraGeneralResponsive;
    component.textoGeneralABuscar = 'abc';
    const payload = {
      pagina: component.paginaEnCarteraGeneral,
      buscar: component.textoGeneralABuscar
    };
    component.paginarCarteraGeneral();
    expect(component.carteraGeneral).toEqual([]);
    expect(component.enCarteraGeneral).toHaveBeenCalledWith(payload);
  });

  it('deberia reiniciar cartera general', () => {
    component.carteraGeneralMessage = '';
    component.columnasCarteraGeneral = [];
    component.paginaEnCarteraGeneral = 0;
    component.totalEnCarteraGeneral = 1;
    (component as any).reiniciarCarteraGeneral();
    expect(component.carteraGeneralMessage).toEqual('Ingrese los criterios de búsqueda');
    expect(component.columnasCarteraGeneral).toEqual(COLUMNAS_CARTERA_GENERAL);
    expect(component.paginaEnCarteraGeneral).toEqual(1);
    expect(component.totalEnCarteraGeneral).toEqual(0);
  });

  it('deberia buscar con guiones', () => {
    const texto = '716';
    const datoStr = '3117-163-17';
    const found = (component as any).searchWithDashes(texto, datoStr);
    expect(found).toBeUndefined();
  });

  it('deberia encontrar texto', () => {
    const texto = '716';
    const datoStr = '3117-163-17';
    const found = (component as any).textFound(texto, datoStr);
    expect(found).toEqual({ has: false, found: '716' });
  });

  it('deberia encontrar texto con números', () => {
    const texto = '716';
    const datoStr = '3117-163-17';
    const found = (component as any).textFound(texto, datoStr, true);
    expect(found).toEqual({ has: false, found: '' });
  });

  it('deberia encontrar texto con números en el principio', () => {
    const texto = '3117';
    const datoStr = '3117-163-17';
    const found = (component as any).textFound(texto, datoStr, true);
    expect(found).toEqual({ has: true, found: '3117' });
  });
});
