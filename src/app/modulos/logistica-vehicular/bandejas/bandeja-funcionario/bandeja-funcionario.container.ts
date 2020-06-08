import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { collapseInDownAnimation } from 'app/@compartidos/animations/collapseInDown.animation';
import { IProp } from 'app/@compartidos/models/prop.interface';
import * as store from 'app/@compartidos/store';
import {
  cloneArray,
  esDesktopTarget,
  esMobile,
  insertarEnStringPorIndice,
  normalizarTildes,
  offResizeWindow,
  onResizeWindow
} from 'app/@compartidos/utils/helpers';
import { IColumna, IHTMLBooleanElement } from 'app/modulos/portal/@interface/bandejas.interface';
import { getUsuarioLoaded } from 'app/modulos/portal/@store';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { IContratoItemResponsive } from './@models/contrato-item-responsive.interface';
import { ITramiteRequest } from './@models/tramite-request.interface';
import { getDescargaExcelLoading, getTramite, getTramiteFailed, getTramiteLoading } from './@store';
import * as enTramiteAction from './@store/contrato-tramite.action';
import * as descargaExcelAction from '../@store/descarga-excel.action';
import {
  COLUMNAS_PROGRAMACION,
  COLUMNAS_TRAMITE,
  BandejaFuncionarioEnum,
  TiposEnum
} from './bandeja-funcionario.enum';
import { TIPOS_CATEGORIA, IdsEnum } from '../bandejas.enum';
import { IMensajeSeguimiento } from '../bandejas.interface';
import { PortalApiService } from 'app/modulos/portal/portal.api.service';
import { BuscadorComponent } from 'app/@compartidos/components/buscador/buscador.component';
import { BandejaFuncionarioApiService } from './bandeja-funcionario-api.service';
import { APIError } from 'app/@compartidos/models';

@Component({
  selector: 'ginni-bandeja-funcionario',
  templateUrl: './bandeja-funcionario.container.html',
  styleUrls: ['./bandeja-funcionario.container.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [collapseInDownAnimation]
})
export class BandejaFuncionarioContainer implements OnInit, OnDestroy {
  @ViewChild('buscadorComponent')
  public buscadorComponent: BuscadorComponent;

  public columnasProgramacion: IColumna[] = cloneArray(COLUMNAS_PROGRAMACION);
  public columnasTramite: IColumna[] = cloneArray(COLUMNAS_TRAMITE);
  public disabledExcelButton = true;
  public mensajeDocumento: IMensajeSeguimiento;
  public numeroPaginas: number;
  public paginaEnProgramacion = 1;
  public paginaEnTramite = 1;
  public tamanioPaginador;
  public tiposCategoria: IProp[] = TIPOS_CATEGORIA;
  public totalEnProgramacion = 0;
  public totalEnTramite = 0;
  public tramiteContratos: IContratoItemResponsive[] = [];
  public showSuccessOrError = false;
  public listaBandeja = [];
  public loading = false;

  // Layout responsive
  public columnasResponsive: IColumna[] = [this.columnasTramite[0], this.columnasTramite[1]];
  public dialogFiltro = false;
  public esDesktopTarget = esDesktopTarget();
  public radioColumnas: IHTMLBooleanElement[] = [];
  public radioSelected: number[] = [];
  public tabEnTramite = true;

  // Observadores
  public descargaExcelLoading$ = this.appState$.select(getDescargaExcelLoading);
  public tramite$ = this.appState$.select(getTramite);
  public tramiteFailed$ = this.appState$.select(getTramiteFailed);
  public tramiteLoading$ = this.appState$.select(getTramiteLoading);
  public usuarioLoaded$ = this.appState$.select(getUsuarioLoaded);

  public textoABuscar = '';

  public get tituloEnProgramacion() {
    if (this.totalEnProgramacion) {
      return `${BandejaFuncionarioEnum.EnProgramacionDeEntrega} (${this.totalEnProgramacion})`;
    }

    return `${BandejaFuncionarioEnum.EnProgramacionDeEntrega}`;
  }

  public get tituloEnProgramacionResponsive() {
    if (this.totalEnProgramacion) {
      return `${BandejaFuncionarioEnum.EnProgramacion} (${this.totalEnProgramacion})`;
    }

    return `${BandejaFuncionarioEnum.EnProgramacion}`;
  }

  public get tituloEnTramite() {
    if (this.totalEnTramite) {
      return `${BandejaFuncionarioEnum.EnTramite} (${this.totalEnTramite})`;
    }

    return `${BandejaFuncionarioEnum.EnTramite}`;
  }

  private subscriptions: Subscription[] = [];

  constructor(
    private appState$: Store<store.State>,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private bandejaApiService: BandejaFuncionarioApiService,
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
    this.traerDataDeTablas();
    this.mensajeDocumento = {
      mensaje: '',
      tipo: ''
    };
    this.listarRadioButtons();
    this.registrarEventos();
    onResizeWindow(this.actualizarResponsive);
  }

  public ngOnDestroy() {
    this.desregistrarEventos();
    offResizeWindow(this.actualizarResponsive);
    this.aceptarSeguimiento();
    this.loading = false;
  }

  private registrarEventos() {
    this.subscriptions.push(
      this.tramite$.subscribe(tramite => {
        if (tramite && tramite.contratos) {
          this.listaBandeja = tramite.contratos;
          this.numeroPaginas = tramite.numeroPaginas;
          this.totalEnTramite = tramite.totalRegistros;

          this.tramiteContratos = tramite.contratos.map(contrato => ({
            ...contrato,
            active: false
          }));
        }

        if (this.textoABuscar !== '') {
          const textoABuscar = this.textoABuscar;

          this.tramiteContratos = this.tramiteContratos.map((contrato: IContratoItemResponsive) => {
            const nombres = contrato.nombres.map(nombre => {
              if (this.tieneLaPalabra(textoABuscar, nombre, false)) {
                return this.resaltarBusqueda(nombre);
              }

              return nombre;
            });
            const contratos = contrato.contratos.map(item => {
              if (this.tieneLaPalabra(textoABuscar, item, true)) {
                return this.resaltarBusqueda(item);
              }

              return item;
            });

            return {
              ...contrato,
              nombres,
              contratos
            };
          });
        }

        this.disabledExcelButton = this.tramiteContratos.length === 0;
      }),
      this.activeRouter.params.subscribe(query => {
        this.dialogFiltro = !!query.filtrando;
      })
    );
  }
  public abrirFiltro() {
    this.router.navigate([
      `${BandejaFuncionarioEnum.Url}`,
      {
        filtrando: true
      }
    ]);
  }

  public actualizarResponsive = () => {
    this.tamanioPaginador = esMobile() ? 5 : 6;
  };

  public alCambiarTab(tabEnTramite: boolean) {
    if (tabEnTramite !== this.tabEnTramite) {
      this.tabEnTramite = tabEnTramite;
      const tipo = tabEnTramite ? TiposEnum.TIPO_TRAMITE : TiposEnum.TIPO_PROGRAMACION;
      this.reiniciarTabla(tipo);
      this.traerDataDeTablas(this.columnasResponsive, tipo);
    }
  }

  public buscador(texto: string) {
    if (texto) {
      this.textoABuscar = texto;
      this.reiniciarTabla(TiposEnum.TIPO_TRAMITE);
      this.reiniciarTabla(TiposEnum.TIPO_PROGRAMACION);
    } else {
      this.textoABuscar = '';
    }
    this.traerDataDeTablas();
  }

  public cerrarFiltro() {
    this.router.navigate([`${BandejaFuncionarioEnum.Url}`], {
      replaceUrl: true
    });
  }

  public clickAplicarFiltro() {
    this.columnasResponsive = this.radioSelected.sort().map(indexSelected => {
      const column = this.radioColumnas[indexSelected].column;

      return { ...column, asc: null };
    });
    this.clickEnColumnaMobile(this.columnasResponsive[0], this.columnasResponsive);
    this.cerrarFiltro();
  }

  public clickEnColumnaTramite = (columna: IColumna) => {
    if (columna) {
      this.paginaEnTramite = 1;
      this.traerDataDeTablas(this.columnasTramite, TiposEnum.TIPO_TRAMITE);
    }
  };

  public clickEnColumnaMobile = (
    columna: IColumna,
    columnas: IColumna[],
    tipo: TiposEnum.TIPO_PROGRAMACION | TiposEnum.TIPO_TRAMITE = TiposEnum.TIPO_TRAMITE
  ) => {
    if (tipo === TiposEnum.TIPO_TRAMITE) {
      this.paginaEnTramite = 1;
    } else {
      this.paginaEnProgramacion = 1;
    }
    columnas.forEach(col => {
      if (col.name !== columna.name) {
        col.focus = false;
        col.asc = null;
      }
    });
    columna.focus = true;
    columna.asc = columna.asc === null ? false : !columna.asc;
    this.traerDataDeTablas(columnas, tipo);
  };

  public clickEnFilaResponsive(indexSelected: number, contratos: IContratoItemResponsive[]) {
    contratos.forEach((contrato, index) => {
      contrato.active = index === indexSelected;
    });
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

  public descargarExcel() {
    this.appState$.dispatch(new descargaExcelAction.LoadAction(this.textoABuscar));
  }

  public listarRadioButtons() {
    let columnas;
    columnas = this.tabEnTramite ? this.columnasTramite : this.columnasProgramacion;

    this.radioSelected = [];
    this.radioColumnas = columnas.map(
      (column, index): IHTMLBooleanElement => {
        const defaultSelected = this.isDefaultSelected(column);
        if (defaultSelected) {
          this.radioSelected.push(index);
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

  public redirectEditarAsociado(index: number) {
    this.loading = true;
    const contratoActual = this.listaBandeja[index].contratos;
    const bloqueContratoID = this.listaBandeja[index].bloqueContratoID;

    this.bandejaApiService.validarEntrarAlCaso(contratoActual).subscribe(
      res => {
        if (res && res.mensaje) {
          this.showSuccessOrError = true;
          this.mensajeDocumento['mensaje'] = res.mensaje;
          this.loading = false;
        } else {
          if (bloqueContratoID) {
            this.router.navigate([
              `${BandejaFuncionarioEnum.Url}/detalle/${bloqueContratoID}/evaluacion/crediticia`
            ]);
          } else {
            this.showSuccessOrError = true;
            this.mensajeDocumento['mensaje'] = 'Ocurrió un error inesperado*';
            this.loading = false;
          }
        }
      },
      (error: APIError) => {
        this.loading = false;
        this.showSuccessOrError = true;
        this.mensajeDocumento['mensaje'] = error.mensaje;
      }
    );
  }

  public refrescar() {
    this.buscadorComponent.buscador.nativeElement.value = '';
    this.textoABuscar = '';
    this.traerDataDeTablas();
  }

  public renderItem(html) {
    if (Array.isArray(html)) {
      return html.map(item => `<p>${item}</p>`).join('');
    } else {
      return html;
    }
  }

  public traerDataDeTablas(
    columnas: IColumna[] = this.columnasTramite,
    tipo: TiposEnum.TIPO_TRAMITE | TiposEnum.TIPO_PROGRAMACION = TiposEnum.TIPO_TRAMITE
  ) {
    const columnFocus = columnas.filter(col => col.focus)[0];
    if (tipo === TiposEnum.TIPO_TRAMITE) {
      const payload: ITramiteRequest = {
        pagina: this.paginaEnTramite,
        orden: columnFocus.id, // orden: "fechaSituacionActual"
        modoOrden: columnFocus.asc ? 'asc' : 'desc'
      };
      if (this.textoABuscar !== '') {
        payload.filtro = this.textoABuscar;
      }
      this.appState$.dispatch(new enTramiteAction.LoadAction(payload));
    } else {
      // TODO: Deberia llamar al servicio de en programacion
    }
  }

  private desregistrarEventos() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private isDefaultSelected(column: IColumna): boolean {
    return column.id === IdsEnum.ID_ADJUDICACION || column.id === IdsEnum.ID_NOMBRE;
  }

  private reiniciarTabla(tipo: TiposEnum.TIPO_TRAMITE | TiposEnum.TIPO_PROGRAMACION) {
    this.listarRadioButtons();
    if (tipo === TiposEnum.TIPO_TRAMITE) {
      this.columnasTramite = cloneArray(COLUMNAS_TRAMITE);
      this.columnasResponsive = [this.columnasTramite[0], this.columnasTramite[1]];
      this.paginaEnTramite = 1;
    } else {
      this.columnasProgramacion = cloneArray(COLUMNAS_PROGRAMACION);
      this.columnasResponsive = [this.columnasProgramacion[0], this.columnasProgramacion[1]];
      this.paginaEnProgramacion = 1;
    }
  }

  private resaltarBusqueda(datoStr) {
    const texto = normalizarTildes(this.textoABuscar);
    const regex = new RegExp(texto, 'i');
    const finded = normalizarTildes(datoStr).match(regex);
    if (finded) {
      const indiceInicial = finded.index;
      const indiceFinal = texto.length + indiceInicial + 8;

      return insertarEnStringPorIndice(
        indiceFinal,
        '</strong>',
        insertarEnStringPorIndice(indiceInicial, '<strong>', datoStr)
      );
    }

    return datoStr;
  }

  private tieneLaPalabra(referencia, valor, restrictivo) {
    referencia = normalizarTildes(referencia).toLowerCase();
    valor = normalizarTildes(valor).toLowerCase();

    // Eliminando los primeros ceros en los contratos
    const eliminandoCeros = function(valorACambiar) {
      const arrStr = valorACambiar.split('');
      const arrayDeCeros = [];
      arrStr.forEach(caracter => {
        if (caracter !== '0' && caracter !== '-') {
          arrayDeCeros.push(valorACambiar.indexOf(caracter));
        }
      });

      return valorACambiar.slice(arrayDeCeros[0], valorACambiar.length);
    };

    if (restrictivo) {
      referencia = eliminandoCeros(referencia);
      valor = eliminandoCeros(valor);

      return referencia === valor.substring(0, referencia.length);
    } else {
      return valor.includes(referencia);
    }
  }

  public aceptarSeguimiento() {
    this.showSuccessOrError = false;
    this.portalApiService.guardarMensajeDocumentos(null);
  }
}
