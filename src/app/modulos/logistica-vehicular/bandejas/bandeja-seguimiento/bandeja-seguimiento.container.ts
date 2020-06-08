import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { IColumna, IHTMLBooleanElement } from 'app/modulos/portal/@interface/bandejas.interface';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { collapseInDownAnimation } from 'app/@compartidos/animations/collapseInDown.animation';
import { offResizeWindow, onResizeWindow, cloneArray } from 'app/@compartidos/utils/helpers';
import * as store from 'app/@compartidos/store';
import { Store } from '@ngrx/store';
import * as listarActions from './@store/listar-bandeja.action';
import { getListar, getListarLoading, getListarFailed } from './@store';
import { TipoEstado, COLUMNAS } from './bandeja-seguimiento.enum';
import { IListarBandejaRequest } from './@interfaces/bandeja-seguimiento.interface';
import { ITabsPage } from 'app/@compartidos/interfaces/tabPage.interface';
import { IProp } from 'app/@compartidos/models/prop.interface';
import { TIPOS_CATEGORIA } from '../bandejas.enum';
import { IMensajeSeguimiento, IListarBandeja } from '../bandejas.interface';
import { PortalApiService } from 'app/modulos/portal/portal.api.service';
import { BuscadorComponent } from 'app/@compartidos/components/buscador/buscador.component';

const INGRESO = 'ingreso';
const ID_NOMBRE = 'nombres';
@Component({
  selector: 'ginni-bandeja-seguimiento',
  templateUrl: './bandeja-seguimiento.container.html',
  styleUrls: ['./bandeja-seguimiento.container.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [collapseInDownAnimation]
})
export class BandejaSeguimientoContainer implements OnInit, OnDestroy {
  @ViewChild('buscador')
  public buscador: BuscadorComponent;

  public columnas: IColumna[] = cloneArray(COLUMNAS);
  public listarBandeja;
  public listarLeyenda: IProp[] = TIPOS_CATEGORIA;
  public nombreTabSeleccionada: string;
  public numeroPaginas: number;
  public mensajeDocumento: IMensajeSeguimiento;
  public paginaActual = 1;
  public primerNombre: string;
  public placeholder = 'Buscar por contrato';
  public tamanioPaginador: number;
  public totalRegistros = 0;
  public totalEnObservacion = 0;
  public tabsPage: ITabsPage[];
  public showSuccessOrError = false;

  // Layout responsive
  public dialogFiltro = false;
  public tabPendiente = true;
  public columnasResponsive: IColumna[] = [this.columnas[0], this.columnas[1]];
  public radioColumnas: IHTMLBooleanElement[] = [];
  public radioSelected: number[] = [];

  private subscriptions: Subscription[] = [];

  public listarBandejas$ = this.appState$.select(getListar);
  public listarBandejasLoading$ = this.appState$.select(getListarLoading);
  public listarBandejasFailed$ = this.appState$.select(getListarFailed);

  private desregistrarEventos() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public textoABuscar(contrato: string) {
    if (contrato) {
      this.paginaActual = 1;
    }
    this.obtenerDatosTabla(contrato);
  }

  constructor(
    private appState$: Store<store.State>,
    private router: Router,
    private activeRouter: ActivatedRoute,
    public portalSandbox: PortalSandbox,
    private portalApiService: PortalApiService
  ) {
    this.actualizarResponsive();
    this.showSuccessOrError = false;
    this.portalApiService.obtenerMensajeDocumentos$.subscribe(mensaje => {
      if (mensaje) {
        setTimeout(() => {
          this.showSuccessOrError = true;
          this.mensajeDocumento = mensaje;
        }, 250);
      }
    });
  }

  public ngOnInit() {
    this.tabsPage = [
      {
        active: true,
        nombre: 'pendiente'
      },
      {
        active: false,
        nombre: 'aprobado'
      }
    ];
    this.tabSeleccionada(TipoEstado.Pendientes);
    this.listarRadioButtons();
    this.registrarEventos();
    onResizeWindow(this.actualizarResponsive);
  }

  public ngOnDestroy() {
    this.desregistrarEventos();
    offResizeWindow(this.actualizarResponsive);
    this.aceptarSeguimiento();
  }

  public tabSeleccionada(tab: string) {
    this.buscador.buscador.nativeElement.value = '';
    this.nombreTabSeleccionada = tab;
    this.paginaActual = 1;
    this.obtenerDatosTabla();
  }

  private obtenerDatosTabla(contrato: string = '') {
    const payload: IListarBandejaRequest = {
      estadoBandeja: this.nombreTabSeleccionada,
      paginaActual: this.paginaActual,
      contrato
    };

    this.appState$.dispatch(new listarActions.LoadAction(payload));
  }

  private registrarEventos() {
    this.subscriptions.push(
      this.activeRouter.params.subscribe(query => {
        this.dialogFiltro = !!query.filtrando;
      }),
      this.listarBandejas$.subscribe((listarBandejas: IListarBandeja) => {
        if (listarBandejas) {
          if (listarBandejas.mensajeDocumentos) {
            this.showSuccessOrError = true;
            this.mensajeDocumento = listarBandejas.mensajeDocumentos;
          }
          this.totalRegistros = listarBandejas.totalRegistros;
          this.numeroPaginas = listarBandejas.numeroPaginas;
          this.listarBandeja = listarBandejas.lista;
        }
      })
    );
  }

  public actualizarResponsive = () => {
    if (this.portalSandbox.esMobile) {
      this.tamanioPaginador = 5;
    } else {
      this.tamanioPaginador = 6;
    }
  };

  public redirectEditarAsociado(bloqueContratoID: string) {
    if (bloqueContratoID) {
      this.router.navigate([
        `/portal/bandeja-de-trabajo-evaluacion/detalle/${bloqueContratoID}/evaluacion/crediticia`
      ]);
    }
  }

  public cerrarFiltro() {
    this.router.navigate(['/portal/bandeja-de-trabajo-evaluacion']);
  }

  public refrescar() {
    this.buscador.buscador.nativeElement.value = '';
    this.paginaActual = 1;
    this.obtenerDatosTabla();
  }

  public cambiarPagina() {
    this.buscador.buscador.nativeElement.value = '';
    this.obtenerDatosTabla();
  }

  public listarRadioButtons() {
    let columnas;
    if (this.tabPendiente) {
      columnas = this.columnas;
    } else {
      columnas = this.columnas;
    }

    function isDefaultSelected(column: IColumna): boolean {
      return column.id === INGRESO || column.id === ID_NOMBRE;
    }

    this.radioSelected = [];
    this.radioColumnas = columnas.map(
      (column, index): IHTMLBooleanElement => {
        const defaultSelected = isDefaultSelected(column);
        if (defaultSelected) {
          this.radioSelected.push(index);
        }
        return {
          column,
          label: column.name,
          value: defaultSelected
        };
      }
    );
  }

  public clickRadioFiltro(radio: IHTMLBooleanElement, index: number) {
    const value = !radio.value;
    if (value) {
      if (this.radioSelected.length === 2) {
        const firstSelected = this.radioSelected[0];
        this.radioColumnas[firstSelected].value = false;
        this.radioSelected.shift();
      }
      this.radioSelected.push(index);
      radio.value = !radio.value;
    }
  }

  public clickAplicarFiltro() {
    this.columnasResponsive = this.radioSelected.sort().map(indexSelected => {
      const column = this.radioColumnas[indexSelected].column;
      return { ...column, asc: null };
    });
    this.cerrarFiltro();
  }

  public clickEnFilaResponsive(indexSelected: number, contratos: any[]) {
    contratos.forEach((contrato, index) => {
      contrato.active = index === indexSelected;
    });
  }

  public renderItem(html) {
    if (Array.isArray(html)) {
      return html.map(item => `<p>${item}</p>`).join('');
    } else {
      return html;
    }
  }

  public aceptarSeguimiento() {
    this.showSuccessOrError = false;
    this.portalApiService.guardarMensajeDocumentos(null);
  }
}
