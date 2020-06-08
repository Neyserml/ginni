import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Options } from 'ng5-slider';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IColumna, IHTMLBooleanElement } from 'app/modulos/portal/@interface/bandejas.interface';
import { getUsuarioLoaded } from 'app/modulos/portal/@store';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import {
  CarteraGeneralRequest,
  CarteraGeneralResponse,
  IReactivacionRequest,
  ICarteraGeneralItemResponsive,
  IReactivacionItemResponsive,
  CarteraGeneralContrato,
  ReactivacionSummary,
  IStringSearch
} from './@models/bandeja.interface';
import { BandejaModel } from './@models/bandeja.model';
import {
  getDescargaExcelLoading,
  getReactivacion,
  getReactivacionFailed,
  getReactivacionLoading
} from './@store';
import * as descargaExcelAction from './@store/descarga-excel.action';
import * as enReactivacionAction from './@store/bandeja.action';
import {
  COLUMNAS_REACTIVACIONES,
  BandejaEnum,
  IdsEnum,
  TIPOS_CATEGORIA,
  COLUMNAS_CARTERA_GENERAL
} from './bandeja.enum';
import { BandejaService } from './bandeja.service';
import { collapseInDownAnimation } from 'app/@compartidos/animations/collapseInDown.animation';
import { ICheckbox } from 'app/@compartidos/components/checkbox/model/checkbox.model';
import { DoubleSliderComponent } from 'app/@compartidos/components/double-slider/double-slider.component';
import { IDoubleSlider } from 'app/@compartidos/components/double-slider/models/double-slider.model';
import { IProp } from 'app/@compartidos/models/prop.interface';
import * as store from 'app/@compartidos/store';
import {
  cloneArray,
  esDesktopTarget,
  esMobile,
  insertCharacterInString,
  insertarEnStringPorIndice,
  isBetween,
  isNormalInteger,
  normalizarTildes,
  offResizeWindow,
  onResizeWindow,
  removeLeadingZeros
} from 'app/@compartidos/utils/helpers';
import { APIError } from '../../../@compartidos/models';

@Component({
  selector: 'ginni-bandeja-de-reactivaciones',
  templateUrl: './bandeja.container.html',
  styleUrls: ['./bandeja.container.scss'],
  animations: [collapseInDownAnimation]
})
export class BandejaContainer implements OnInit, OnDestroy {
  @ViewChild('buscador') buscador;
  @ViewChild('buscadorGeneral') buscadorGeneral;
  @ViewChild(DoubleSliderComponent) doubleSlider: DoubleSliderComponent;

  public carteraGeneralResponse: CarteraGeneralResponse;
  public reactivacionSummary: ReactivacionSummary;
  public tooltip = 'Cartera de resueltos';
  public columnasReactivacion: IColumna[] = cloneArray(COLUMNAS_REACTIVACIONES);
  public columnasCarteraGeneral: IColumna[] = cloneArray(COLUMNAS_CARTERA_GENERAL);
  public disabledExcelButton = true;
  public errorIngresoAlCasoMensaje = '';
  public carteraGeneralMessage = 'Ingrese los criterios de búsqueda';
  public mostrarBloqueoDeIngresoAlCaso = false;
  public paginaEnReactivacion = 1;
  public paginaEnCarteraGeneral = 1;
  public tamanioPaginador;
  public tiposCategoria: IProp[] = TIPOS_CATEGORIA;
  public totalEnCarteraGeneral = 0;
  public totalEnReactivacion = 0;
  public reactivaciones: IReactivacionItemResponsive[] = [];
  public carteraGeneral: ICarteraGeneralItemResponsive[] = [];
  // Layout responsive
  public columnasResponsive: IColumna[] = [
    this.columnasReactivacion[0],
    this.columnasReactivacion[2]
  ];
  public dialogFiltro = false;
  public esDesktopTarget = esDesktopTarget();
  public checkboxColumnas: IHTMLBooleanElement[] = [];
  public checkboxChecked: number[] = [];
  public checkboxes: ICheckbox[] = [];
  public tabEnReactivacion = true;
  // Observadores
  public descargaExcelLoading$ = this.appState$.select(getDescargaExcelLoading);
  public reactivacion$: Observable<BandejaModel> = this.appState$.select(getReactivacion);
  public reactivacionFailed$ = null;
  public reactivacionLoading$ = null;
  public textoABuscar = '';
  public textoGeneralABuscar = '';
  public usuarioLoaded$ = this.appState$.select(getUsuarioLoaded);
  public totalCuotasPagadas = 120;
  public totalPorcentajeDeCia = 100;
  // double slider range
  public cia: IDoubleSlider = {
    highValue: 100,
    value: 0
  };
  public cuotasPagadas: IDoubleSlider = {
    highValue: 120,
    value: 0
  };
  public options: Options = {
    ceil: 100,
    floor: 0
  };
  public manualRefresh: EventEmitter<void> = new EventEmitter<void>();
  public state = {
    tabs: {
      reactivaciones: true,
      carteraGeneral: false
    },
    filterDisabled: {
      filter: false,
      all: false,
      programas: false,
      cia: false,
      cuotas: false,
      proximos: false
    },
    filterDefault: {
      all: true,
      programas: [],
      cia: {
        highValue: this.totalPorcentajeDeCia,
        value: 0
      },
      cuotas: {
        highValue: this.totalCuotasPagadas,
        value: 0
      },
      proximos: false
    },
    filter: {
      all: true,
      programas: <ICheckbox[]>[],
      proximos: false
    }
  };

  private subscriptions: Subscription[] = [];
  public loading = false;
  public failed = '';
  public defaultState = true;
  public noneSelected = false;
  public atLeastOneCheckbox = true;
  public validCiaRange = true;
  public validCuotasRange = true;

  constructor(
    public portalSandbox: PortalSandbox,
    private activeRouter: ActivatedRoute,
    private bandejaService: BandejaService,
    private appState$: Store<store.State>,
    private router: Router
  ) {
    this.actualizarResponsive();
  }

  public get tituloCarteraGeneral() {
    if (this.totalEnCarteraGeneral) {
      return `${BandejaEnum.TituloCarteraGeneral} (${this.totalEnCarteraGeneral})`;
    }

    return `${BandejaEnum.TituloCarteraGeneral}`;
  }

  public get tituloEnReactivacion() {
    if (this.totalEnReactivacion) {
      return `${BandejaEnum.EnReactivacion} (${this.totalEnReactivacion})`;
    }

    return `${BandejaEnum.EnReactivacion}`;
  }

  public actualizarResponsive = (): void => {
    this.tamanioPaginador = esMobile() ? 5 : 6;
  };

  public ngOnInit() {
    this.traerDataDeTablas();
    this.failed = '';
    this.reactivacionFailed$ = this.appState$.select(getReactivacionFailed);
    this.reactivacionLoading$ = this.appState$.select(getReactivacionLoading);
    this.listarCheckbox();
    this.registrarEventos();
    onResizeWindow(this.actualizarResponsive);
    this.bindBuscador();
    this.bindBuscadorGeneral();
  }

  public ngOnDestroy() {
    this.desregistrarEventos();
    this.loading = false;
    offResizeWindow(this.actualizarResponsive);
  }

  public abrirFiltro(): void {
    this.pullFromDefault();
    this.dialogFiltro = true;
    this.manualRefresh.emit();
    this.router.navigate([`${BandejaEnum.Url}`]);
  }

  public alCambiarTab(tabEnReactivacion: boolean): void {
    if (tabEnReactivacion !== this.tabEnReactivacion) {
      this.tabEnReactivacion = tabEnReactivacion;
      this.reiniciarTabla();
      this.traerDataDeTablas(this.columnasResponsive);
    }
  }

  private hasAtLeastOneCheckbox(): boolean {
    const atLeastOneCheckbox = this.checkboxes.some(checkbox => checkbox.value);
    this.atLeastOneCheckbox = atLeastOneCheckbox;

    return atLeastOneCheckbox;
  }

  public bindBuscador() {
    const buscadorElement = this.buscador.nativeElement;
    const mapValue = (event: any) => {
      if (event.currentTarget || event.currentTarget === '') {
        return event.currentTarget.value || event.target.value;
      }
    };

    const registerBuscador = value => {
      if (value !== undefined) {
        const textoABuscar = value ? value.trim() : buscadorElement.value;
        if (textoABuscar ? textoABuscar.length > 2 || textoABuscar.length === 0 : true) {
          this.textoABuscar = textoABuscar;
          this.reiniciarTabla();
          this.traerDataDeTablas();
        } else {
          this.textoABuscar = '';
        }
      }
    };

    const $inputKeyUp = Observable.fromEvent(buscadorElement, 'keyup')
      .map(mapValue)
      .debounceTime(500);

    buscadorElement.addEventListener('paste', event => {
      setTimeout(() => {
        registerBuscador(mapValue(event));
      }, 100);
    });

    $inputKeyUp.subscribe(registerBuscador);

    const $inputPaste = Observable.fromEvent(buscadorElement, 'paste')
      .map(mapValue)
      .debounceTime(500);

    buscadorElement.addEventListener('paste', event => {
      setTimeout(() => {
        registerBuscador(mapValue(event));
      }, 100);
    });

    $inputPaste.subscribe(registerBuscador);
  }

  public bindBuscadorGeneral() {
    const buscadorGeneralElement = this.buscadorGeneral.nativeElement;
    const mapValue = (event: any) => {
      if (event.currentTarget || event.currentTarget === '') {
        return event.currentTarget.value || event.target.value;
      }
    };

    const registerBuscadorGeneral = value => {
      if (value !== undefined) {
        const textoABuscar = value ? value.trim() : buscadorGeneralElement.value;
        if (textoABuscar ? textoABuscar.length > 2 || textoABuscar.length === 0 : true) {
          this.textoGeneralABuscar = textoABuscar;
          this.reiniciarCarteraGeneral();
          this.paginarCarteraGeneral();
        } else {
          this.textoGeneralABuscar = '';
        }
      }
    };

    const $inputKeyUp = Observable.fromEvent(buscadorGeneralElement, 'keyup')
      .map(mapValue)
      .debounceTime(500);

    buscadorGeneralElement.addEventListener('paste', event => {
      setTimeout(() => {
        registerBuscadorGeneral(mapValue(event));
      }, 100);
    });

    $inputKeyUp.subscribe(registerBuscadorGeneral);

    const $inputPaste = Observable.fromEvent(buscadorGeneralElement, 'paste')
      .map(mapValue)
      .debounceTime(500);

    buscadorGeneralElement.addEventListener('paste', event => {
      setTimeout(() => {
        registerBuscadorGeneral(mapValue(event));
      }, 100);
    });

    $inputPaste.subscribe(buscadorGeneralElement);
  }

  public cerrarFiltro(): void {
    const checkboxesState = !this.state.filterDefault.programas.some(checkbox => !checkbox.value);
    const ciaState =
      Number(this.state.filterDefault.cia.highValue) === this.totalPorcentajeDeCia &&
      Number(this.state.filterDefault.cia.value) === 0;

    const cuotasPagadasState =
      Number(this.state.filterDefault.cuotas.highValue) === this.totalCuotasPagadas &&
      Number(this.state.filterDefault.cuotas.value) === 0;

    this.defaultState =
      checkboxesState && ciaState && cuotasPagadasState && !this.state.filterDefault.proximos;

    this.validCiaRange =
      isNormalInteger(this.state.filterDefault.cia.highValue) &&
      isNormalInteger(this.state.filterDefault.cia.value) &&
      Number(this.state.filterDefault.cia.value) <=
        Number(this.state.filterDefault.cia.highValue) &&
      isBetween(this.state.filterDefault.cia.value, 0, this.totalPorcentajeDeCia) &&
      isBetween(this.state.filterDefault.cia.highValue, 0, this.totalPorcentajeDeCia);

    this.validCuotasRange =
      isNormalInteger(this.state.filterDefault.cuotas.highValue) &&
      isNormalInteger(this.state.filterDefault.cuotas.value) &&
      Number(this.state.filterDefault.cuotas.value) <=
        Number(this.state.filterDefault.cuotas.highValue) &&
      isBetween(this.state.filterDefault.cuotas.value, 0, this.totalCuotasPagadas) &&
      isBetween(this.state.filterDefault.cuotas.highValue, 0, this.totalCuotasPagadas);

    this.router.navigate([`${BandejaEnum.Url}`], {
      replaceUrl: true
    });
    this.dialogFiltro = false;
  }

  public clickCheckboxFiltro(checkbox: IHTMLBooleanElement, index: number): void {
    const value = !checkbox.value;
    if (value) {
      if (this.checkboxChecked.length === 2) {
        const firstSelected = this.checkboxChecked[0];
        this.checkboxColumnas[firstSelected].value = false;
        this.checkboxChecked.shift();
      }
      this.checkboxChecked.push(index);
      checkbox.value = !checkbox.value;
    }
  }

  public clickEnColumna(columna: IColumna, columnas: IColumna[]): void {
    this.paginaEnReactivacion = 1;
    columnas.forEach(col => {
      if (col.name !== columna.name) {
        col.focus = false;
        col.asc = null;
      }
    });
    columna.focus = true;
    columna.asc = columna.asc === null ? false : !columna.asc;
    this.traerDataDeTablas(columnas);
  }

  public clickEnFilaResponsive(
    indexSelected: number,
    contratos: IReactivacionItemResponsive[]
  ): void {
    contratos.forEach((contrato, index) => {
      contrato.active = index === indexSelected;
    });
  }

  public checkboxClickFilter() {
    if (!this.state.filterDisabled.programas) {
      this.clickFilter();
    }
  }

  public ciaRangeFilter(): void {
    if (!this.state.filterDisabled.cia) {
      this.validCiaRange = this.validateCiaRange();
      this.clickFilter();
    }
  }

  public cuotasRangeFilter(): void {
    if (!this.state.filterDisabled.cuotas) {
      this.validCuotasRange = this.validateCuotasRange();
      this.clickFilter();
    }
  }

  private persistDefault() {
    this.state.filterDefault.all = this.state.filter.all;
    this.state.filterDefault.programas = cloneArray(this.checkboxes);
    this.state.filterDefault.cia.highValue = this.cia.highValue;
    this.state.filterDefault.cia.value = this.cia.value;
    this.state.filterDefault.cuotas.highValue = this.cuotasPagadas.highValue;
    this.state.filterDefault.cuotas.value = this.cuotasPagadas.value;
    this.state.filterDefault.proximos = this.state.filter.proximos;
  }

  private pullFromDefault() {
    this.state.filter.all = this.state.filterDefault.all;
    this.checkboxes = cloneArray(this.state.filterDefault.programas);
    this.cia.highValue = this.state.filterDefault.cia.highValue;
    this.cia.value = this.state.filterDefault.cia.value;
    this.cuotasPagadas.highValue = this.state.filterDefault.cuotas.highValue;
    this.cuotasPagadas.value = this.state.filterDefault.cuotas.value;
    this.state.filter.proximos = this.state.filterDefault.proximos;
    this.showProximos();
  }

  private validateCiaRange(): boolean {
    return (
      isNormalInteger(this.cia.highValue) &&
      isNormalInteger(this.cia.value) &&
      Number(this.cia.value) <= Number(this.cia.highValue) &&
      isBetween(this.cia.value, 0, this.totalPorcentajeDeCia) &&
      isBetween(this.cia.highValue, 0, this.totalPorcentajeDeCia)
    );
  }

  private validateCuotasRange(): boolean {
    return (
      isNormalInteger(this.cuotasPagadas.highValue) &&
      isNormalInteger(this.cuotasPagadas.value) &&
      Number(this.cuotasPagadas.value) <= Number(this.cuotasPagadas.highValue) &&
      isBetween(this.cuotasPagadas.value, 0, this.totalCuotasPagadas) &&
      isBetween(this.cuotasPagadas.highValue, 0, this.totalCuotasPagadas)
    );
  }

  public clickFilter(): void {
    this.defaultState = this.isDefaultState();
    const noneSelected = this.isNoneSelected();
    this.hasAtLeastOneCheckbox();
    this.noneSelected =
      noneSelected || !this.atLeastOneCheckbox || !this.validCiaRange || !this.validCuotasRange;
    this.state.filter.all = this.defaultState;
  }

  public descargarExcel(): void {
    this.appState$.dispatch(new descargaExcelAction.LoadAction());
  }

  public getSummary(): void {
    this.bandejaService.reactivacionSummary().subscribe(
      result => {
        if (this.defaultState) {
          this.checkboxes = [];
          this.state.filterDefault.programas = [];
          this.reactivacionSummary = result;
          if (this.reactivacionSummary.total === 0) {
            this.state.filterDisabled.filter = true;
          }
          this.tooltip = `Total: ${this.reactivacionSummary.total}<br>`;
          Object.entries(this.reactivacionSummary.productos).forEach(producto =>
            Object.entries(producto[1]).forEach(
              ([key, value]) => (this.tooltip += `${key}: ${value}<br>`)
            )
          );
          Object.entries(this.reactivacionSummary.programas).forEach(programa =>
            Object.entries(programa[1]).forEach(([label, value]) => {
              this.tooltip += `${label}: ${value}<br>`;
              this.checkboxes.push({ label, value: true });
              this.state.filterDefault.programas.push({ label, value: true });
            })
          );
        }
      },
      (error: APIError) => {
        this.failed = error.mensaje;
      }
    );
  }

  public enCarteraGeneral(request: CarteraGeneralRequest): void {
    this.bandejaService.enCarteraGeneral(request).subscribe(
      result => {
        this.loading = false;
        this.carteraGeneralResponse = result;
        this.totalEnCarteraGeneral = result.numeroRegistros;
        if (result.contratosCartera) {
          if (result.contratosCartera.length === 0) {
            this.carteraGeneralMessage = 'No se han encontrado resultados en la búsqueda';
          } else if (result.contratosCartera.length > 0) {
            this.carteraGeneral = result.contratosCartera.map(contrato => ({
              ...contrato,
              active: false
            }));
            if (this.textoGeneralABuscar !== '') {
              const textoGeneralABuscar = this.textoGeneralABuscar;
              this.carteraGeneral = result.contratosCartera.map(
                (contrato: CarteraGeneralContrato) => {
                  const nombres = contrato.nombres.map(nombre => {
                    const palabra = this.tieneLaPalabra(textoGeneralABuscar, nombre, false);
                    if (palabra.has) {
                      return this.resaltarBusqueda(nombre, palabra.found);
                    }

                    return nombre;
                  });
                  const contratos = contrato.contratos.map(item => {
                    const palabra = this.tieneLaPalabra(textoGeneralABuscar, item, true, true);
                    if (palabra.has) {
                      return this.resaltarBusqueda(item, palabra.found);
                    }

                    return item;
                  });
                  const numeroDocumentos = contrato.numeroDocumentos.map(documento => {
                    const palabra = this.tieneLaPalabra(textoGeneralABuscar, documento, true);
                    if (palabra.has) {
                      return this.resaltarBusqueda(documento, palabra.found);
                    }

                    return documento;
                  });

                  return {
                    ...contrato,
                    nombres,
                    contratos,
                    numeroDocumentos,
                    active: false
                  };
                }
              );
            }
          }
        } else {
          this.carteraGeneralMessage = 'No se han encontrado resultados en la búsqueda';
        }
      },
      (error: APIError) => {
        this.failed = error.mensaje;
        this.loading = false;
      }
    );
  }

  public filterDesktop(): void {
    this.persistDefault();
    const payload = this.generatePayload();
    this.appState$.dispatch(new enReactivacionAction.LoadAction(payload));
    this.defaultState = this.isDefaultState();
    this.cerrarFiltro();
  }

  private generatePayload() {
    const pagina = this.paginaEnReactivacion;
    const programa = this.checkboxes
      .filter(checkbox => checkbox.value)
      .map(checkbox => {
        if (checkbox.value) {
          return `${checkbox.label}`;
        }
      })
      .join(',');
    const cia = `${this.cia.value},${this.cia.highValue}`;
    const cuotasPagadas = `${this.cuotasPagadas.value},${this.cuotasPagadas.highValue}`;
    const filtroRojo = Number(this.state.filter.proximos);

    return {
      pagina,
      programa,
      cia,
      cuotasPagadas,
      filtroRojo
    };
  }

  private isDefaultState(): boolean {
    const checkboxesState = !this.checkboxes.some(checkbox => !checkbox.value);
    const ciaState =
      Number(this.cia.highValue) === this.totalPorcentajeDeCia && Number(this.cia.value) === 0;
    const cuotasPagadasState =
      Number(this.cuotasPagadas.highValue) === this.totalCuotasPagadas &&
      Number(this.cuotasPagadas.value) === 0;

    return checkboxesState && ciaState && cuotasPagadasState && !this.state.filter.proximos;
  }

  public isNoneSelected(): boolean {
    const checkboxesState = !this.checkboxes.some(checkbox => checkbox.value);
    const ciaState = Number(this.cia.highValue) === 0 && Number(this.cia.value) === 0;
    const cuotasPagadasState =
      Number(this.cuotasPagadas.highValue) === 0 && Number(this.cuotasPagadas.value) === 0;

    return checkboxesState && ciaState && cuotasPagadasState;
  }

  public listarCheckbox(): void {
    let columnas;
    columnas = this.tabEnReactivacion ? this.columnasReactivacion : '';

    this.checkboxChecked = [];
    this.checkboxColumnas = columnas.map(
      (column, index): IHTMLBooleanElement => {
        const defaultSelected = this.isDefaultSelected(column);
        if (defaultSelected) {
          this.checkboxChecked.push(index);
        }

        return {
          column,
          label: column.name,
          value: !!defaultSelected
        };
      }
    );
  }

  public nombreCategoria(segmento: string): string {
    const categoria = this.tiposCategoria.filter(item => item.clave === segmento)[0];

    return categoria ? `${segmento} (${categoria.valor})` : segmento;
  }

  public onClickChangeTab(tab: string): void {
    const tabs = this.state.tabs;
    Object.keys(this.state.tabs).forEach(function(key) {
      tabs[key] = key === tab;
    });
  }

  public reactivacionContratoDetalle(contrato: IReactivacionItemResponsive): void {
    this.errorIngresoAlCasoMensaje = '';
    if (contrato) {
      this.bandejaService
        .ingresaAlCaso(contrato.reactivacionContratoID)
        .subscribe(bloqueosEnBandeja => {
          if (bloqueosEnBandeja.habilitarIngreso) {
            this.bandejaService.contratoActual = contrato;
            this.bandejaService.personaIds = contrato.personaIds;
            this.router.navigate([`${BandejaEnum.Url}/detalle/info`]);
          } else {
            this.mostrarBloqueoDeIngresoAlCaso = true;
            this.errorIngresoAlCasoMensaje = bloqueosEnBandeja.mensaje;
          }
        });
    }
  }

  public cerrarBloqueoDeIngresoAlCaso() {
    this.mostrarBloqueoDeIngresoAlCaso = false;
    setTimeout(() => {
      this.errorIngresoAlCasoMensaje = '';
    }, 300);
  }

  public refrescar(): void {
    this.traerDataDeTablas();
  }

  public renderItem(html: string | string[]): string {
    return Array.isArray(html) ? html.map(item => `<p>${item}</p>`).join('') : html;
  }

  private selectAll(): void {
    this.checkboxes.map(checkbox => (checkbox.value = !this.defaultState));
    this.cia.highValue = this.totalPorcentajeDeCia;
    this.cia.value = 0;
    this.cuotasPagadas.highValue = this.totalCuotasPagadas;
    this.cuotasPagadas.value = 0;
  }

  public showAll(): void {
    if (!this.state.filterDisabled.all) {
      this.selectAll();
      this.state.filter.all = !this.state.filter.all;
      this.clickFilter();
      this.ciaRangeFilter();
      this.cuotasRangeFilter();
    }
  }

  public showProximos(): void {
    const proximos = this.state.filter.proximos;
    this.state.filterDisabled.all = proximos;
    this.state.filterDisabled.programas = proximos;
    this.state.filterDisabled.cia = proximos;
    this.state.filterDisabled.cuotas = proximos;
    if (proximos) {
      this.noneSelected = !proximos;
    } else {
      this.clickFilter();
    }
  }

  public traerDataDeTablas(columnas: IColumna[] = this.columnasReactivacion): void {
    this.getSummary();
    const columnFocus = columnas.filter(col => col.focus)[0];
    if (columnFocus) {
      const payload: IReactivacionRequest = {
        pagina: this.paginaEnReactivacion,
        orden: columnFocus.id,
        modoOrden: columnFocus.asc ? 'asc' : 'desc',
        programa: this.checkboxes
          .filter(checkbox => checkbox.value)
          .map(checkbox => {
            if (checkbox.value) {
              return `${checkbox.label}`;
            }
          })
          .join(','),
        cia: `${this.cia.value},${this.cia.highValue}`,
        cuotasPagadas: `${this.cuotasPagadas.value},${this.cuotasPagadas.highValue}`,
        filtroRojo: Number(this.state.filter.proximos)
      };
      if (this.textoABuscar !== '') {
        payload.buscar = this.textoABuscar;
      }
      this.appState$.dispatch(new enReactivacionAction.LoadAction(payload));
    }
  }

  public paginarCarteraGeneral(): void {
    this.carteraGeneral = [];
    if (this.textoGeneralABuscar !== '') {
      this.loading = true;
      const payload: CarteraGeneralRequest = {
        pagina: this.paginaEnCarteraGeneral,
        buscar: this.textoGeneralABuscar
      };
      this.enCarteraGeneral(payload);
    }
  }

  private desregistrarEventos(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private isDefaultSelected(column: IColumna): boolean {
    return column.id === IdsEnum.ID_REACTIVACION || column.id === IdsEnum.ID_NOMBRE;
  }

  private registrarEventos() {
    this.subscriptions.push(
      this.reactivacion$.subscribe(reactivaciones => {
        if (reactivaciones && reactivaciones.contratosResueltos) {
          this.totalEnReactivacion = reactivaciones.numeroRegistros;

          this.reactivaciones = reactivaciones.contratosResueltos.map(reactivacion => ({
            ...reactivacion,
            active: false
          }));
        }

        if (this.textoABuscar !== '') {
          const textoABuscar = this.textoABuscar;
          this.reactivaciones = this.reactivaciones.map((contrato: IReactivacionItemResponsive) => {
            const nombres = contrato.nombres.map(nombre => {
              const palabra = this.tieneLaPalabra(textoABuscar, nombre, false);
              if (palabra.has) {
                return this.resaltarBusqueda(nombre, palabra.found);
              }

              return nombre;
            });
            const contratos = contrato.contratos.map(item => {
              const palabra = this.tieneLaPalabra(textoABuscar, item, true, true);
              if (palabra.has) {
                return this.resaltarBusqueda(item, palabra.found);
              }

              return item;
            });
            const numeroDocumentos = contrato.numeroDocumentos.map(documento => {
              const palabra = this.tieneLaPalabra(textoABuscar, documento, true);
              if (palabra.has) {
                return this.resaltarBusqueda(documento, palabra.found);
              }

              return documento;
            });

            return {
              ...contrato,
              nombres,
              contratos,
              numeroDocumentos
            };
          });
        }

        this.disabledExcelButton = this.reactivaciones.length === 0;
      }),
      this.activeRouter.params.subscribe(query => {
        this.dialogFiltro = !!query.filtrando;
      })
    );
  }

  private reiniciarTabla(): void {
    this.listarCheckbox();
    this.columnasReactivacion = cloneArray(COLUMNAS_REACTIVACIONES);
    this.columnasResponsive = [this.columnasReactivacion[0], this.columnasReactivacion[2]];
    this.paginaEnReactivacion = 1;
  }

  private reiniciarCarteraGeneral(): void {
    this.carteraGeneralMessage = 'Ingrese los criterios de búsqueda';
    this.columnasCarteraGeneral = cloneArray(COLUMNAS_CARTERA_GENERAL);
    this.paginaEnCarteraGeneral = 1;
    this.totalEnCarteraGeneral = 0;
  }

  public setColumns(): void {
    this.columnasResponsive = this.checkboxChecked.sort().map(indexChecked => {
      const column = this.checkboxColumnas[indexChecked].column;

      return { ...column, asc: null };
    });
    this.clickEnColumna(this.columnasResponsive[0], this.columnasResponsive);
    this.cerrarFiltro();
  }

  private resaltarBusqueda(datoStr: string, foundText: string): string {
    const regex = new RegExp(foundText.replace('.', '[.]'), 'i');
    const found = normalizarTildes(datoStr).match(regex);
    if (found) {
      const indiceInicial = found.index;
      const indiceFinal = foundText.length + indiceInicial + 8;

      return insertarEnStringPorIndice(
        indiceFinal,
        '</strong>',
        insertarEnStringPorIndice(indiceInicial, '<strong>', datoStr)
      );
    }

    return datoStr;
  }

  private searchWithDashes(texto: string, datoStr: string): IStringSearch | undefined {
    for (let position = 0; position < texto.length; position++) {
      const output = insertCharacterInString(texto, position, '-');
      if (datoStr.startsWith(output)) {
        return { has: datoStr.startsWith(output), found: output };
      } else {
        for (let position2 = 0; position2 < output.length; position2++) {
          const output2 = insertCharacterInString(output, position2, '-');
          if (datoStr.startsWith(output2)) {
            return { has: datoStr.startsWith(output2), found: output2 };
          }
        }
      }
    }
  }

  private textFound(texto: string, datoStr: string, numbers = false): IStringSearch {
    if (numbers) {
      if (datoStr.includes(texto)) {
        return { has: datoStr.includes(texto), found: texto };
      }
      // with leading zero
      const foundWithZeros = this.searchWithDashes(texto, datoStr);
      if (foundWithZeros) {
        return foundWithZeros;
      }
      // without leading zeros
      const textoNoZero = removeLeadingZeros(texto);
      const foundWithoutZeros = this.searchWithDashes(textoNoZero, datoStr);
      if (foundWithoutZeros) {
        return foundWithoutZeros;
      }

      return { has: false, found: '' };
    } else {
      return { has: datoStr.includes(texto), found: texto };
    }
  }

  private tieneLaPalabra(
    textoABuscar: string,
    valor: string,
    startsWith: boolean,
    numbers = false
  ): IStringSearch {
    textoABuscar = normalizarTildes(textoABuscar).toLowerCase();
    valor = normalizarTildes(valor).toLowerCase();

    if (startsWith) {
      if (valor.startsWith(textoABuscar)) {
        return { has: valor.startsWith(textoABuscar), found: textoABuscar };
      } else {
        return { has: false, found: '' };
      }
    } else {
      const palabra = this.textFound(textoABuscar, valor, numbers);

      return { has: palabra.has, found: palabra.found };
    }
  }
}
