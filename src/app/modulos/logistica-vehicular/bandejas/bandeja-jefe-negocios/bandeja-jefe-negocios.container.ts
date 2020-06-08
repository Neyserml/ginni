import { Component, OnDestroy, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';

import { collapseInDownAnimation } from 'app/@compartidos/animations/collapseInDown.animation';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { Store } from '@ngrx/store';
import * as store from 'app/@compartidos/store';
import * as descargaExcelAction from '../@store/descarga-excel.action';
import { ITabsPage } from 'app/@compartidos/interfaces/tabPage.interface';
import { IColumna } from 'app/modulos/portal/@interface/bandejas.interface';
import {
  cloneArray,
  normalizarTildes,
  insertarEnStringPorIndice
} from 'app/@compartidos/utils/helpers';
import {
  COLUMNAS_TRAMITE,
  COLUMNAS_APROBADOS,
  LEYENDA,
  BandejaJefeNegociosEnum
} from './bandeja-jefe-negocios.enum';
import { BuscadorComponent } from 'app/@compartidos/components/buscador/buscador.component';
import { BandejaJefeNegociosApiService } from './bandeja-jefe-negocios-api.service';
import { IClaveValor } from 'app/modulos/portal/@interface/generales.interface';
import * as listarEnTramiteActions from './@store/listaEnTramites.action';
import * as listarAprobadosActions from './@store/listaAprobados.action';
import { IListarEnTramitesResponse } from './@interfaces/listar-en-tramite.interface';
import { Subscription } from 'rxjs/Subscription';
import {
  getListaEnTramites,
  getListaEnTramitesLoading,
  getListaEnTramitesFailed,
  getListaAprobados,
  getListaAprobadosLoading,
  getListaAprobadosFailed,
  getDescargarExcelLoading
} from './@store';
import { IProp, APIError } from 'app/@compartidos/models';
import {
  IListarBandejaRequest,
  IBandejaAprobadoRequest,
  IDescargaExcelRequest
} from './@interfaces/bandeja.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ListaEnTramiteItem } from './@model/listar-en-tramite.model';
import { PortalApiService } from 'app/modulos/portal/portal.api.service';
import { Router } from '@angular/router';
import { TipoBandeja } from '../bandejas.enum';

@Component({
  selector: 'ginni-bandeja-jefe-negocios',
  templateUrl: './bandeja-jefe-negocios.container.html',
  styleUrls: ['./bandeja-jefe-negocios.container.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [collapseInDownAnimation]
})
export class BandejaJefeNegociosContainer implements OnInit, OnDestroy {
  @ViewChild('buscadorComponent')
  public buscadorComponent: BuscadorComponent;

  public celulaActual = '';
  public chevron = true;
  public columnas: IColumna[] = cloneArray(COLUMNAS_TRAMITE);
  public disableSelect: boolean;
  public disabledExcelButton: boolean;
  public disabled: boolean;
  public failed: string;
  public enTramite = TipoBandeja.EnTramite;
  public iconText = '';
  public numeroPaginas: number;
  public maxLength = '';
  public mensajeModal = '';
  public listarLeyenda: IProp[] = LEYENDA;
  public listaCelulas: IClaveValor[];
  public listaBandejas = [];
  public listaInicialBandejas = [];
  public loading: boolean;
  public paginaActual = 1;
  public selectForm: FormGroup;
  public showModal: boolean;
  private subscriptions: Subscription[] = [];
  public tabsPage: ITabsPage[];
  public tableIcon = true;
  public tabSelected: TipoBandeja.EnTramite | string;
  public textoABuscar = '';
  public textoABuscarTramite = '';
  public textoABuscarAprobados = '';
  public totalRegistros: number;
  public onlyContract = false;
  public placeholder = '';

  // Observadores
  public listarEnTramite$ = this.appState$.select(getListaEnTramites);
  public listarEnTramiteLoading$ = this.appState$.select(getListaEnTramitesLoading);
  public listarEnTramiteFailed$ = this.appState$.select(getListaEnTramitesFailed);

  public listarAprobados$ = this.appState$.select(getListaAprobados);
  public listarAprobadosLoading$ = this.appState$.select(getListaAprobadosLoading);
  public listarAprobadosFailed$ = this.appState$.select(getListaAprobadosFailed);

  public descargaExcel$ = this.appState$.select(getDescargarExcelLoading);

  constructor(
    private appState$: Store<store.State>,
    private bandejaJefeNegociosApiService: BandejaJefeNegociosApiService,
    private fb: FormBuilder,
    public portalSandbox: PortalSandbox,
    public portalApiService: PortalApiService,
    public router: Router
  ) {
    this.portalApiService.obtenerMensajeDocumentos$.subscribe(mensaje => {
      if (mensaje) {
        setTimeout(() => {
          this.showModal = true;
          this.mensajeModal = mensaje.mensaje;
        }, 250);
      }
    });
  }

  ngOnInit() {
    this.tabSelected = TipoBandeja.EnTramite;
    this.tabsPage = [
      {
        active: true,
        nombre: TipoBandeja.EnTramite
      },
      {
        active: false,
        nombre: TipoBandeja.Aprobados
      }
    ];
    this.armarForm();
    this.obtenerBandeja();
    this.obtenerTabla();
    this.traetListaCelulas();
  }

  private guardarBandeja(bandeja: string = '') {
    if (bandeja) {
      localStorage.setItem('bandeja', bandeja);
    } else {
      this.bandejaJefeNegociosApiService.seleccionarCelula('');
      localStorage.setItem('bandeja', TipoBandeja.EnTramite);
    }
  }

  private obtenerBandeja() {
    const bandeja = localStorage.getItem('bandeja');

    if (bandeja) {
      this.tabSelected = bandeja;
      this.tabsPage.forEach(
        (item, index) => (this.tabsPage[index].active = item.nombre === bandeja)
      );
      switch (bandeja) {
        case TipoBandeja.Aprobados:
          this.tabSelectedAprobados();
          this.textoABuscar = this.textoABuscarAprobados;
          this.buscadorComponent.buscador.nativeElement.value = this.textoABuscarAprobados;
          break;
        case TipoBandeja.EnTramite:
          this.tabSelectedTramites();
          this.textoABuscar = this.textoABuscarTramite;
          this.buscadorComponent.buscador.nativeElement.value = this.textoABuscarTramite;
          break;
        default:
          this.columnas = cloneArray(COLUMNAS_TRAMITE);
          break;
      }
      this.registrarEventos();
    } else {
      this.guardarBandeja();
      this.registrarEventos();
    }
  }

  ngOnDestroy() {
    this.desregistrarEventos();
    this.textoABuscar = '';
    this.loading = false;
    this.failed = null;
  }

  private armarForm(celulaid = '') {
    this.selectForm = this.fb.group({
      select: [celulaid]
    });
    this.selectForm.get('select').markAsTouched();
  }

  public registrarEventos() {
    this.subscriptions.push(
      this.bandejaJefeNegociosApiService.celulaSeleccionada$.subscribe((celulaId: string) => {
        if (celulaId) {
          this.celulaActual = celulaId;
          this.selectForm.get('select').patchValue(celulaId);
        }
      }),
      this.listarEnTramite$.subscribe((response: IListarEnTramitesResponse) => {
        if (response) {
          this.disabled = false;
          this.listaInicialBandejas = response.lista;
          this.listaBandejas = response.lista;
          this.numeroPaginas = response.numeroPaginas;
          this.totalRegistros = response.totalRegistros;
          this.setearCargando();
          this.tabsPage.forEach(tab => {
            if (tab.nombre === TipoBandeja.EnTramite) {
              tab.quantity = response.totalRegistros;
            }
          });

          this.resaltadoPalabrasPorBusqueda();
          this.disabledExcelButton = this.listaBandejas.length === 0;
        }
      }),
      this.listarAprobados$.subscribe(response => {
        if (response) {
          this.disabled = false;
          this.listaInicialBandejas = response.lista;
          this.listaBandejas = response.lista;
          this.numeroPaginas = response.numeroPaginas;
          this.totalRegistros = response.totalRegistros;
          this.setearCargando();
          this.tabsPage.forEach(tab => {
            if (tab.nombre === TipoBandeja.Aprobados) {
              tab.quantity = response.totalRegistros;
            }
          });
        }
      })
    );
  }

  private desregistrarEventos() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public redirectEditarAsociado(index: number) {
    this.loading = true;
    const contratoActual = this.listaInicialBandejas[index].contratos;
    const bloqueContratoID = this.listaInicialBandejas[index].bloqueContratoID;

    this.bandejaJefeNegociosApiService.validarEntrarAlCaso(contratoActual).subscribe(
      res => {
        if (res && res.mensaje) {
          this.showModal = true;
          this.mensajeModal = res.mensaje;
          this.loading = false;
        } else {
          if (bloqueContratoID) {
            this.router.navigateByUrl(
              `${BandejaJefeNegociosEnum.Url}/detalle/${bloqueContratoID}/evaluacion/crediticia`
            );
          } else {
            this.showModal = true;
            this.mensajeModal = 'Ocurrió un error inesperado*';
            this.loading = false;
          }
        }
      },
      (error: APIError) => {
        this.loading = false;
        this.showModal = true;
        this.mensajeModal = error.mensaje;
      }
    );
  }

  public aceptarSeguimiento() {
    this.showModal = false;
    this.portalApiService.guardarMensajeDocumentos(null);
  }

  private resaltadoPalabrasPorBusqueda() {
    if (this.textoABuscar !== '') {
      const textoABuscar = this.textoABuscar;

      this.listaBandejas = this.listaBandejas.map((contrato: ListaEnTramiteItem) => {
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

  public descargarExcel() {
    const payload: IDescargaExcelRequest = {
      filtro: this.textoABuscar,
      celula: this.celulaActual
    };
    this.appState$.dispatch(new descargaExcelAction.LoadAction(payload));
  }

  private traetListaCelulas() {
    this.bandejaJefeNegociosApiService.todoCelulas().subscribe(
      (lista: IClaveValor[]) => {
        if (lista) {
          this.listaCelulas = lista;
          this.setearCargando();
        }
      },
      (error: APIError) => {
        if (error) {
          this.loading = false;
          this.failed = error.mensaje;
        }
      }
    );
  }

  public buscador(texto: string) {
    if (texto) {
      this.textoABuscar = texto;
    } else {
      this.textoABuscar = '';
    }
    this.paginaActual = 1;
    this.almacenarTextoABuscar(texto);
    this.obtenerTabla();
  }

  private almacenarTextoABuscar(texto: string) {
    switch (this.tabSelected) {
      case TipoBandeja.Aprobados:
        this.textoABuscarAprobados = texto;
        break;
      case TipoBandeja.EnTramite:
        this.textoABuscarTramite = texto;
        break;
      default:
        break;
    }
  }

  private limpiarTextoABuscar() {
    switch (this.tabSelected) {
      case TipoBandeja.Aprobados:
        this.textoABuscarAprobados = '';
        this.buscadorComponent.buscador.nativeElement.value = '';
        break;
      case TipoBandeja.EnTramite:
        this.textoABuscarTramite = '';
        this.buscadorComponent.buscador.nativeElement.value = '';
        break;
      default:
        break;
    }
  }

  public actualizarPagina() {
    this.paginaActual = 1;
    this.limpiarTextoABuscar();
    this.textoABuscar = '';
    this.obtenerTabla();
  }

  public obtenerTabla(columnas: IColumna[] = this.columnas) {
    this.disabled = true;
    const columnFocus = columnas.filter(col => col.focus)[0];

    if (this.tabSelected === TipoBandeja.EnTramite) {
      const payloadTramite: IListarBandejaRequest = {
        pagina: this.paginaActual,
        orden: columnFocus.id, // orden: "fechaSituacionActual"
        modoOrden: columnFocus.asc ? 'asc' : 'desc',
        filtro: this.textoABuscar,
        celula: this.celulaActual
      };
      this.appState$.dispatch(new listarEnTramiteActions.LoadAction(payloadTramite));
    } else if (this.tabSelected === TipoBandeja.Aprobados) {
      const payloadAprobados: IBandejaAprobadoRequest = {
        pagina: this.paginaActual,
        numeroContrato: this.textoABuscar
      };
      this.appState$.dispatch(new listarAprobadosActions.LoadAction(payloadAprobados));
    }
  }

  public tabSeleccionada(tabName: TipoBandeja) {
    this.paginaActual = 1;
    this.guardarBandeja(tabName);
    this.selectForm.get('select').patchValue(this.celulaActual);
    this.disabled = true;
    this.tabSelected = tabName;
    this.disableSelect = tabName === TipoBandeja.Aprobados;
    switch (tabName) {
      case TipoBandeja.Aprobados:
        this.tabSelectedAprobados();
        this.textoABuscar = this.textoABuscarAprobados;
        this.buscadorComponent.buscador.nativeElement.value = this.textoABuscarAprobados;
        break;
      case TipoBandeja.EnTramite:
        this.tabSelectedTramites();
        this.textoABuscar = this.textoABuscarTramite;
        this.buscadorComponent.buscador.nativeElement.value = this.textoABuscarTramite;
        break;
      default:
        this.columnas = cloneArray(COLUMNAS_TRAMITE);
        break;
    }
    this.obtenerTabla();
  }

  private tabSelectedTramites() {
    this.columnas = cloneArray(COLUMNAS_TRAMITE);
    this.tableIcon = true;
    this.chevron = true;
    this.onlyContract = false;
    this.maxLength = '';
    this.iconText = '';
    this.placeholder = '';
  }

  private tabSelectedAprobados() {
    this.columnas = cloneArray(COLUMNAS_APROBADOS);
    this.tableIcon = false;
    this.chevron = false;
    this.onlyContract = true;
    this.maxLength = '11';
    this.iconText = 'CC:';
    this.placeholder = 'Buscar por contrato';
  }

  public cambiarPagina() {
    this.obtenerTabla();
  }

  public columnaSelected = (columna: IColumna) => {
    if (columna && this.tabSelected === this.enTramite) {
      this.paginaActual = 1;
      this.obtenerTabla();
    }
  };

  public seleccionarCelula(event) {
    const celulaId = event.target.value;
    this.bandejaJefeNegociosApiService.seleccionarCelula(celulaId);
    this.celulaActual = celulaId;
    this.paginaActual = 1;
    this.obtenerTabla();
  }

  private setearCargando() {
    this.loading = false;
    this.failed = null;
  }
}
