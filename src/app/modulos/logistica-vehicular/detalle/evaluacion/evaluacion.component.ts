import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { getConfiguracion } from 'app/modulos/portal/@store';
import { getAsociado, getAsociadoYConfiguracion, getAsociadoFailed } from '../@store';
import { BandejaFuncionarioEnum } from 'app/modulos/logistica-vehicular/bandejas/bandeja-funcionario/bandeja-funcionario.enum';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import {
  getValidarInicioEvaluacion,
  getSimuladorGuardar,
  getSimuladorGuardarLoading,
  getSimuladorGuardarFailed
} from 'app/modulos/logistica-vehicular/detalle/evaluacion/@store';
import * as contratosAction from 'app/modulos/logistica-vehicular/detalle/evaluacion/@store/contratos.action';
import { EvaluacionApiService } from './evaluacion-api.service';
import { APIError } from 'app/@compartidos/models';
import * as store from 'app/@compartidos/store';
import {
  Configuracion,
  ConfiguracionEvaluacionCrediticia
} from 'app/modulos/portal/@models/configuracion.model';
import * as ConfiguracionAction from 'app/modulos/portal/@store/configuracion.action';
import * as simuladorGuardarAction from './@store/simulador-guardar.action';
import { Subscription } from 'rxjs/Subscription';
import { DetalleApiService } from 'app/modulos/logistica-vehicular/detalle/detalle-api.service';
import { IGaranteDetalle } from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/garante.interface';
import { getIdBloqueContrato } from 'app/@compartidos/utils/helpers';
import { IDocumentosPersonas } from './@interface/documentos-personas.interface';
import { isNullOrUndefined } from 'util';
import { AGREGAR, EDITAR, RESPALDO } from './evaluacion.enum';
import { IListadoVerificaciones } from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/datosVerificacion.interface';
import { SimuladorFinanciamientoComponent } from 'app/@compartidos/components/simulador-financiamiento/simulador-financiamiento.component';
import {
  ISimuladorCategoria,
  ISimuladorCalcularResponse,
  ISimuladorConceptosRequest,
  IConsultarRequest,
  ISimuladorIniciarDatos
} from 'app/@compartidos/interfaces/simulador-financiamiento.interface';
import { TiposPersona, CLAVE_CONVIVIENTE, CLAVE_CASADO } from '../detalle.enum';
import {
  ISimuladorIniciar,
  ISimuladorDatosInformativos,
  IValoresIniciales
} from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/simulador.interface';
import { IinicioEvaluacion } from './@interface/evaluacion-asociado.interface';
import { TipoBandeja } from '../../bandejas/bandejas.enum';
import { IClaveValor } from 'app/modulos/portal/@interface/generales.interface';

@Component({
  selector: 'ginni-evaluacion-crediticia',
  templateUrl: './evaluacion.component.html',
  styleUrls: ['./evaluacion.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EvaluacionCrediticiaComponent implements OnInit, OnDestroy {
  @ViewChild(SimuladorFinanciamientoComponent)
  simuladorComponent: SimuladorFinanciamientoComponent;

  public accesoEditar: boolean;
  public accionGarante: string;
  public agregarGarante = false;
  public asociadoSeleccionadoIndex: number;
  public configuracion: Configuracion;
  public configuracionEvaluacionCrediticia: ConfiguracionEvaluacionCrediticia;
  public desabilitarTabs = true;
  public documentosPersonas: IDocumentosPersonas[];
  public editarGarante: IDocumentosPersonas;
  public errorConfiguracionesGenerales: string;
  public errorValidarInicio: string;
  public evaluacionIniciada: boolean;
  public evaluacionAprobada: boolean;
  public garanteORespaldo: IClaveValor;
  public idBloqueContrato: string;
  public idEstadoCivilGaranteORespaldo: string;
  public informacionAsociado;
  public idCreditoPersona: number;
  public informacionGarante: IGaranteDetalle;
  public idPersonaGarante: number | string;
  public mostrarModalContratos = false;
  public modalListarDocumentos = false;
  public modalListarVerificaciones = false;
  public mostrarTabs = false;
  public loading: boolean;
  public loadingMensaje: boolean;
  public notificacionExitoso: boolean;
  public notificacionError: string;
  public tipoPersona: string;
  public tipoPersonaGarante = TiposPersona.NATURAL;
  private subscriptions: Subscription[] = [];
  public restriccionTotal: boolean;
  // refactor
  public esJefe: boolean;

  // Personas Relacionadas
  public mostrarPersonasRelacionadas: boolean;
  public idEstadoCivil: boolean;

  // Lista de verificaciones
  public accionModalVerificaciones: string;
  public datosVerificacionSeleccionada: IListadoVerificaciones;

  // Simulador
  public failedSimulador: string;
  // refactor
  public simuladorIniciarDatos: ISimuladorIniciarDatos = {};
  public simuladorIniciarData = false;
  public simuladorDatosInformativos = false;

  // Observadores
  public validarInicioEvaluacion$ = this.appState$.select(getValidarInicioEvaluacion);
  public configuracion$ = this.appState$.select(getConfiguracion);
  public asociados$ = this.appState$.select(getAsociado);
  public asociadosFailed$ = this.appState$.select(getAsociadoFailed);
  public asociadoYConfiguracion$ = this.appState$.select(getAsociadoYConfiguracion);

  public simuladorGuardar$ = this.appState$.select(getSimuladorGuardar);
  public simuladorGuardarLoading$ = this.appState$.select(getSimuladorGuardarLoading);
  public simuladorGuardarFailed$ = this.appState$.select(getSimuladorGuardarFailed);

  constructor(
    private router: Router,
    private evaluacionApiService: EvaluacionApiService,
    private asociadoApiService: DetalleApiService,
    public portalSandbox: PortalSandbox,
    public appState$: Store<store.State>
  ) {}

  ngOnInit() {
    this.accesosEditar();
    this.loading = true;
    this.evaluacionIniciada = null;
    this.idBloqueContrato = getIdBloqueContrato();

    this.appState$.dispatch(new ConfiguracionAction.LoadAction());

    if (this.idBloqueContrato) {
      this.servicioValidarInicioEvaluacion();
    } else {
      this.router.navigate([`${BandejaFuncionarioEnum.Url}`]);
    }
  }

  ngOnDestroy() {
    this.desregistrarEventos();
    this.loading = true;
    this.asociadoSeleccionadoIndex = 0;
    this.asociadoApiService.personaActualIndex(0);
  }

  public get puedeEditar() {
    if (this.evaluacionAprobada) {
      return false;
    } else {
      return this.accesoEditar;
    }
  }

  private accesosEditar() {
    const bandeja = localStorage.getItem('bandeja');

    if (bandeja && bandeja === TipoBandeja.Aprobados) {
      this.esJefe = true;
      this.accesoEditar = false;
      this.restriccionTotal = true;
    } else {
      this.esJefe = false;
      this.restriccionTotal = false;
      const { accesoEditar } = this.portalSandbox.getRestriccion();
      this.accesoEditar = accesoEditar;
    }
  }

  public esRespaldo() {
    if (this.editarGarante) {
      return this.editarGarante.tipo === RESPALDO;
    } else if (this.garanteORespaldo) {
      const garanteORespaldoValue = this.garanteORespaldo.valor;
      return garanteORespaldoValue.toUpperCase() === RESPALDO;
    }
  }

  private servicioValidarInicioEvaluacion() {
    this.evaluacionApiService.validarInicioEvaluacion(this.idBloqueContrato).subscribe(
      (validarInicio: IinicioEvaluacion) => {
        if (validarInicio) {
          this.evaluacionAprobada = validarInicio.aprobada;
          this.evaluacionIniciada = validarInicio.iniciada;
          if (validarInicio.iniciada) {
            this.registrarEventos();
          } else {
            this.iniciarEvaluacion();
          }
        }
      },
      (error: APIError) => {
        this.errorValidarInicio = error.mensaje;
      },
      () => {
        this.loading = false;
      }
    );
  }

  private registrarEventos() {
    this.subscriptions.push(
      this.asociadoApiService.configuracionGeneralAdicional().subscribe(
        (configuracionEvaluacionCrediticia: ConfiguracionEvaluacionCrediticia) => {
          if (configuracionEvaluacionCrediticia) {
            this.configuracionEvaluacionCrediticia = configuracionEvaluacionCrediticia;
          }
        },
        (error: APIError) => {
          if (error) {
            this.errorConfiguracionesGenerales = error.mensaje;
          }
        }
      ),
      this.configuracion$.subscribe(
        configuracion => {
          if (configuracion) {
            this.configuracion = configuracion;
          }
        },
        (error: APIError) => {
          if (error) {
            this.errorConfiguracionesGenerales = error.mensaje;
          }
        }
      ),
      this.asociadoApiService.personaIndexSeleccionado.subscribe(
        (asociadoSeleccionadoIndex: number) => {
          this.asociadoSeleccionadoIndex = asociadoSeleccionadoIndex;
        }
      ),
      this.asociados$.subscribe(asociado => {
        if (asociado) {
          this.tipoPersona = asociado.personas[this.asociadoSeleccionadoIndex].tipoPersona;
          this.informacionAsociado = asociado.personas[this.asociadoSeleccionadoIndex];
        }
      }),
      this.evaluacionApiService.simuladorDatos(this.idBloqueContrato).subscribe(
        (simuladorDatosInformativos: ISimuladorDatosInformativos) => {
          if (simuladorDatosInformativos) {
            Object.assign(this.simuladorIniciarDatos, simuladorDatosInformativos);
            this.simuladorDatosInformativos = true;
          }
        },
        (error: APIError) => {
          if (error) {
            this.failedSimulador = error.mensaje;
          }
        },
        () => {
          this.evaluacionApiService.simuladorIniciar(this.idBloqueContrato).subscribe(
            (simuladorIniciarData: ISimuladorIniciar) => {
              if (simuladorIniciarData) {
                Object.assign(this.simuladorIniciarDatos, simuladorIniciarData);
                this.simuladorIniciarData = true;
              }
            },
            (error: APIError) => {
              if (error) {
                this.failedSimulador = error.mensaje;
              }
            }
          );
        }
      ),
      this.simuladorGuardar$.subscribe(guardarSimulador => {
        if (guardarSimulador && this.simuladorComponent) {
          this.evaluacionApiService.actualizarListaDocumentos(true);
          this.simuladorComponent.seGuardoSimulacionSuccess(guardarSimulador);
        }
      }),
      this.simuladorGuardarFailed$.subscribe((error: string) => {
        if (error && this.simuladorComponent) {
          this.simuladorComponent.seGuardoSimulacionError(error);
        }
      })
    );
  }

  private eliminarMensaje() {
    setTimeout(() => {
      this.notificacionExitoso = false;
    }, 4000);
  }

  public abrirModalListaDocumentos() {
    this.modalListarDocumentos = true;
  }

  public obtenerIdCredito(idCreditoPersona) {
    this.idCreditoPersona = idCreditoPersona;
  }

  public iniciarEvaluacion() {
    this.loading = true;
    this.evaluacionApiService.iniciar(this.idBloqueContrato).subscribe(
      validar => {
        this.loading = false;
        this.errorValidarInicio = null;
        if (validar.iniciada) {
          this.registrarEventos();
          this.evaluacionIniciada = validar.iniciada;
        }
      },
      (error: APIError) => {
        if (error) {
          this.loading = false;
          this.errorValidarInicio = error.mensaje;
        }
      }
    );
  }

  public enviarNotificaciones() {
    this.loadingMensaje = true;
    const payload = {
      idBloqueContrato: this.idBloqueContrato
    };

    this.evaluacionApiService.enviarNotificaciones(payload).subscribe(
      () => {
        this.loadingMensaje = false;
        this.notificacionExitoso = true;
        this.notificacionError = null;
        this.eliminarMensaje();
      },
      (error: APIError) => {
        this.loadingMensaje = false;
        this.notificacionExitoso = false;
        this.notificacionError = error.mensaje;
      }
    );
  }

  private desregistrarEventos() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public obtenerInformacionGarante(informacionGarante: IGaranteDetalle) {
    this.loading = true;
    this.idEstadoCivilGaranteORespaldo = informacionGarante.idEstadoCivil;
    this.informacionGarante = informacionGarante;
    const idEstadoCivil = informacionGarante.idEstadoCivil;
    this.convivienteOCasado(idEstadoCivil);

    const esLegal = this.informacionGarante.esLegal;
    if (informacionGarante.idPersona) {
      this.idPersonaGarante = this.informacionGarante.idPersona;
      this.desabilitarTabs = false;
      this.mostrarTabs = true;
    } else {
      this.desabilitarTabs = true;
      this.mostrarTabs = false;
    }
    esLegal ? (this.mostrarTabs = false) : (this.mostrarTabs = true);
    this.obtenerValorGarante();
    this.loading = false;
  }

  private obtenerValorGarante() {
    let garanteORespaldo: IClaveValor;
    const claveGarante = this.informacionGarante.idTipoRelacion.toString();
    if (this.tipoPersona === TiposPersona.NATURAL) {
      const tipoRespaldoNatural = this.configuracionEvaluacionCrediticia.tipoRespaldoNatural;
      garanteORespaldo = tipoRespaldoNatural.filter(respaldo => respaldo.clave === claveGarante)[0];
    } else {
      const tipoRespaldoJuridico = this.configuracionEvaluacionCrediticia.tipoRespaldoJuridico;
      garanteORespaldo = tipoRespaldoJuridico.filter(
        respaldo => respaldo.clave === claveGarante
      )[0];
    }

    this.garanteORespaldo = garanteORespaldo;
  }

  public mostrarAgregarGarante(documento?: IDocumentosPersonas) {
    if (!isNullOrUndefined(documento)) {
      this.documentosPersonas = [];
      this.editarGarante = documento;
      this.accionGarante = EDITAR;
    } else {
      this.accionGarante = AGREGAR;
    }
    this.agregarGarante = true;
    this.mostrarTabs = false;
  }

  public obtenerPersonaGarante(datos) {
    this.idEstadoCivilGaranteORespaldo = datos.idEstadoCivil;
    this.idPersonaGarante = datos.idPersonaGarante;
    this.desabilitarTabs = false;
    const estadoCivilClave = datos.idEstadoCivil;
    this.convivienteOCasado(estadoCivilClave);
  }

  private convivienteOCasado(idEstadoCivil) {
    if (
      idEstadoCivil.toString() === CLAVE_CONVIVIENTE ||
      idEstadoCivil.toString() === CLAVE_CASADO
    ) {
      this.mostrarPersonasRelacionadas = true;
    } else {
      this.mostrarPersonasRelacionadas = false;
    }
  }

  public obtenerDocumentosPersonas(documentosPersonas) {
    this.documentosPersonas = documentosPersonas;
  }

  public modalVerificaciones(accion) {
    this.accionModalVerificaciones = accion;
  }

  public obtenerDatosVerificacionSeleccionada(datosVerificacion) {
    this.datosVerificacionSeleccionada = datosVerificacion;
  }

  /**
   * Lista Contratos
   */
  public cerrarModal() {
    this.mostrarModalContratos = false;
    this.appState$.dispatch(new contratosAction.LoadAction(this.idBloqueContrato));
  }

  /**
   * Simulador
   */
  public simuladorCalcular(payload: ISimuladorConceptosRequest) {
    this.evaluacionApiService.conceptosSimulador(this.idBloqueContrato, payload).subscribe(
      (simuladorCalcularDatos: ISimuladorCalcularResponse) => {
        if (simuladorCalcularDatos) {
          this.simuladorComponent.servicioCalcularSuccess(simuladorCalcularDatos);
        }
      },
      (error: APIError) => {
        if (error) {
          this.simuladorComponent.servicioCalcularError(error);
        }
      }
    );
  }

  public simuladorConsultar(consultarRequest: IConsultarRequest) {
    const payload = {
      ...consultarRequest,
      idBloqueContrato: this.idBloqueContrato
    };
    this.evaluacionApiService.categoriaSimularFinanciamiento(payload).subscribe(
      (categoriaInformacion: ISimuladorCategoria) => {
        if (categoriaInformacion) {
          this.simuladorComponent.servicioConsultarSuccess(categoriaInformacion);
        }
      },
      (error: APIError) => {
        this.simuladorComponent.servicioConsultarError(error);
      }
    );
  }

  public simuladorCalcularDiferencia(datos) {
    this.evaluacionApiService
      .calcularDiferencia(this.idBloqueContrato, datos.montos)
      .subscribe(result => {
        if (result) {
          this.simuladorComponent.servicioCalcularDiferenciaSuccess(result, datos.clave);
        }
      });
  }

  public simuladorAceptarCambio(event) {
    if (event) {
      this.appState$.dispatch(new simuladorGuardarAction.LoadAction(this.idBloqueContrato));
    }
  }

  public valoresInicialesSimulador() {
    this.evaluacionApiService.valoresInicialesSimulador(this.idBloqueContrato).subscribe(
      (valoresIniciales: IValoresIniciales) => {
        if (valoresIniciales) {
          Object.assign(this.simuladorIniciarDatos, valoresIniciales);
          this.simuladorComponent.valoresInicialesSuccess(this.simuladorIniciarDatos);
        }
      },
      (error: APIError) => {
        if (error) {
          this.simuladorComponent.valoresInicialesError(error.mensaje);
        }
      }
    );
  }
}
