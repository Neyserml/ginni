import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import * as store from 'app/@compartidos/store';
import { getConfiguracion } from 'app/modulos/portal/@store';
import { Store } from '@ngrx/store';
import {
  Configuracion,
  ConfiguracionEvaluacionCrediticia
} from 'app/modulos/portal/@models/configuracion.model';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { Conceptos, TipoDocumento, ServicioListarPor, ServiciosListar } from './simulador.enum';
import { ArrayProp, IProp } from 'app/@compartidos/models/prop.interface';
import { SimuladorApiService } from './simulador-api.service';
import {
  IListaContratosSimulador,
  ISimuladorIniciarDatos,
  ISimuladorCalcularRequest
} from './@interfaces/simulador.interface';
import { IGinniOption } from 'app/@compartidos/components/select/select.component';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import * as listarContratosActions from './@store/listar-contratos.action';
import { PortalApiService } from 'app/modulos/portal/portal.api.service';
import { APIError } from 'app/@compartidos/models';
import { ValidationService } from 'app/@compartidos/utils/validation.service';
import { IDocumento } from 'app/modulos/portal/@interface/generales.interface';
import {
  ISimuladorConceptosRequest,
  ISimuladorCalcularResponse,
  IConsultarRequest,
  ISimuladorCategoria
} from 'app/@compartidos/interfaces/simulador-financiamiento.interface';
import { SimuladorFinanciamientoComponent } from 'app/@compartidos/components/simulador-financiamiento/simulador-financiamiento.component';
import {
  getListarContratos,
  getListarContratosLoading,
  getListarContratosFailed
} from './@store/index';
import { CARNET_EXTRANJERIA, DNI, RUC } from 'app/@compartidos/compartidos.enum';
import { SimuladorIniciarDatosModel, SimuladorCalcularResponse } from './@models/simulador.model';
import { NotificationTypeEnum } from 'app/@compartidos/services/notification-type.enum';

@Component({
  selector: 'ginni-simulador',
  templateUrl: './simulador.container.html',
  styleUrls: ['./simulador.container.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SimuladorContainer implements OnInit, OnDestroy {
  @ViewChild(SimuladorFinanciamientoComponent)
  simuladorComponent: SimuladorFinanciamientoComponent;

  public busquedaError: string;
  public errorType: string;
  public conceptos = Conceptos;
  public conceptoSeleccionado: string;
  private contratosSeleccionados: string[];
  public configuracion: Configuracion;
  public configuracionAdicionales: ConfiguracionEvaluacionCrediticia;
  public configuracionesAdicionalesError: string;
  public esSoloNumeros: boolean;
  public errorSimulador: string;
  public form: FormGroup;
  public formError: boolean;
  private idContratos: number[];
  public maxlengthDocumento: string;
  public mostrarListaContratos: boolean;
  public mostrarSimulador = false;
  public listaConceptos = [
    { clave: 1, valor: Conceptos.NUMERO_CONTRATO },
    { clave: 2, valor: Conceptos.DATOS },
    { clave: 3, valor: Conceptos.DOCUMENTO_IDENTIDAD }
  ];
  public listaTipoDocumentos: ArrayProp;
  public listaContratos: IListaContratosSimulador[];
  public loading: boolean;
  public loadingSimulador: boolean;
  public tipoListarServicio: string;
  public _serviciosListar = ServiciosListar;
  public simuladorIniciarDatos: SimuladorIniciarDatosModel;
  public subtituloConcepto: string;
  private subscriptions: Subscription[] = [];

  public configuracion$ = this.appState$.select(getConfiguracion);
  public listarContratosSuccess$ = this.appState$.select(getListarContratos);
  public listarContratosLoading$ = this.appState$.select(getListarContratosLoading);
  public listarContratosFailed$ = this.appState$.select(getListarContratosFailed);

  constructor(
    private appState$: Store<store.State>,
    public portalSandbox: PortalSandbox,
    private portalApiService: PortalApiService,
    private simuladorApiService: SimuladorApiService,
    private fb: FormBuilder,
    private validations: ValidationService
  ) {}

  ngOnInit(): void {
    this.errorType = NotificationTypeEnum.Danger;
    this.mostrarListaContratos = false;
    this.registarEventos();
    this.filtrarTipoDocumento();
    this.formulario();
  }

  ngOnDestroy(): void {
    this.simuladorApiService.listarServiciosPayload = null;
    this.desregistrarEventos();
    this.listaContratos = null;
    this.appState$.dispatch(new listarContratosActions.ResetAction());
  }

  public informacionConcepto(): string {
    switch (true) {
      case this.conceptoSeleccionado === this.conceptos.NUMERO_CONTRATO:
        return 'Ingresa el número de contrato para encontrar a la persona que buscas';
      case this.conceptoSeleccionado === this.conceptos.DOCUMENTO_IDENTIDAD:
        return 'Ingresa el tipo de documento de identidad y número para encontrar a la persona que buscas';
      default: {
        return '';
      }
    }
  }

  private registarEventos(): void {
    this.subscriptions.push(
      this.simuladorApiService.configuracionGeneralAdicional().subscribe(
        (configuracionEvaluacionCrediticia: ConfiguracionEvaluacionCrediticia) => {
          if (configuracionEvaluacionCrediticia) {
            this.configuracionAdicionales = configuracionEvaluacionCrediticia;
          }
        },
        (error: APIError) => {
          if (error) {
            this.configuracionesAdicionalesError = error.mensaje;
          }
        }
      ),
      this.configuracion$.subscribe(configuracion => {
        if (configuracion) {
          this.configuracion = configuracion;
        }
      }),
      this.listarContratosSuccess$.subscribe((listaContratos: IListaContratosSimulador[]) => {
        if (listaContratos) {
          this.busquedaError = null;
          this.listaContratos = listaContratos;
          this.loading = false;
          this.mostrarListaContratos = true;
        } else {
          this.listaContratos = listaContratos;
        }
      }),
      this.listarContratosFailed$.subscribe((error: string) => {
        if (error) {
          this.busquedaError = error;
          this.listaContratos = null;
          this.loading = false;
          this.mostrarListaContratos = false;
        }
      })
    );
  }

  private desregistrarEventos(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private formulario(): void {
    this.form = this.fb.group({
      tipoBusqueda: ['', [Validators.required]],
      numeroContrato: [''],
      datosPersona: [''],
      tipoDocumento: [''],
      numeroDocumento: ['']
    });
  }

  public tipoBusquedaChange(event): void {
    if (event) {
      const concepto = event.target.value;
      this.eliminarValidaciones();
      this.limpiarInputs();
      this.setearValidaciones(concepto);
      this.busquedaError = null;
      this.conceptoSeleccionado = concepto;
      this.subtituloConcepto = this.informacionConcepto();
    }
  }

  private eliminarValidaciones() {
    const { value } = this.form;
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        this.form.get(key).clearValidators();
        this.form.get(key).updateValueAndValidity();
      }
    }
  }

  private limpiarInputs() {
    if (this.conceptoSeleccionado === this.conceptos.NUMERO_CONTRATO) {
      this.form.get('numeroContrato').setValue('');
    } else if (this.conceptoSeleccionado === this.conceptos.DATOS) {
      this.form.get('datosPersona').setValue('');
    } else if (this.conceptoSeleccionado === this.conceptos.DOCUMENTO_IDENTIDAD) {
      this.form.get('tipoDocumento').setValue('');
      this.form.get('numeroDocumento').setValue('');
    }
  }

  public setearValidaciones(concepto) {
    let validadores = [];
    let controls = [];
    if (concepto === this.conceptos.NUMERO_CONTRATO) {
      this.tipoListarServicio = ServicioListarPor.CONTRATO;
      validadores = [Validators.required];
      controls = ['numeroContrato'];
    } else if (concepto === this.conceptos.DATOS) {
      this.tipoListarServicio = ServicioListarPor.PERSONA;
      validadores = [Validators.required, Validators.minLength(8), Validators.maxLength(8)];
      controls = ['datosPersona'];
    } else if (concepto === this.conceptos.DOCUMENTO_IDENTIDAD) {
      this.tipoListarServicio = ServicioListarPor.DOCUMENTO;
      validadores = [Validators.required];
      controls = ['tipoDocumento', 'numeroDocumento'];
    }

    controls.forEach(control => {
      this.form.controls[control].setValidators(validadores);
      this.form.controls[control].updateValueAndValidity();
    });
  }

  public seleccionandoTipoDocumento() {
    let validadores: ValidatorFn[] = [];
    const idTipoDocumento = this.form.get('tipoDocumento').value.toString();
    const valorTipoDocumento = this.configuracion.tipoDocumento.getValor(idTipoDocumento);

    if (valorTipoDocumento === TipoDocumento.DNI) {
      this.esSoloNumeros = true;
      this.maxlengthDocumento = '8';
      validadores = [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
        this.validations.validateNumber
      ];
    } else if (valorTipoDocumento === TipoDocumento.CE) {
      this.esSoloNumeros = false;
      this.maxlengthDocumento = '13';
      validadores = [Validators.required, Validators.maxLength(13)];
    } else if (valorTipoDocumento === TipoDocumento.RUC) {
      this.esSoloNumeros = true;
      this.maxlengthDocumento = '11';
      validadores = [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
        this.validations.validateNumber
      ];
    }
    this.form.get('numeroDocumento').setValidators(validadores);
    this.form.get('numeroDocumento').updateValueAndValidity();
  }

  public tipoDocumentoSeleccionado() {
    this.form.get('numeroDocumento').setValue('');
    const idTipoDocumento = this.form.get('tipoDocumento').value;
    const valorTipoDocumento = this.configuracion.tipoDocumento.getValor(
      idTipoDocumento.toString()
    );

    if (valorTipoDocumento === TipoDocumento.DNI) {
      this.esSoloNumeros = true;
      this.maxlengthDocumento = '8';
    } else if (valorTipoDocumento === TipoDocumento.CE) {
      this.esSoloNumeros = false;
      this.maxlengthDocumento = '13';
    } else if (valorTipoDocumento === TipoDocumento.RUC) {
      this.esSoloNumeros = true;
      this.maxlengthDocumento = '11';
    }
    this.seleccionandoTipoDocumento();
  }

  private filtrarTipoDocumento(): void {
    this.listaTipoDocumentos = this.configuracion.tipoDocumento.filter(
      (documento: IProp) =>
        documento.valor === DNI || documento.valor === CARNET_EXTRANJERIA || documento.valor === RUC
    );
  }

  public buscar(): void {
    this.formError = true;
    this.errorSimulador = null;
    if (this.conceptoSeleccionado === this.conceptos.DOCUMENTO_IDENTIDAD) {
      this.seleccionandoTipoDocumento();
    } else {
      const conceptoSeleccionado = this.form.get('tipoBusqueda').value;
      this.setearValidaciones(conceptoSeleccionado);
    }
    this.busquedaSegunTipoConcepto();
  }

  private busquedaSegunTipoConcepto() {
    const { valid, value } = this.form;
    const { datosPersona, tipoDocumento, numeroDocumento, numeroContrato } = value;
    if (valid) {
      this.loading = true;
      if (this.tipoListarServicio === ServicioListarPor.DOCUMENTO) {
        const datosDocumento: IDocumento = {
          tipoDocumento,
          numeroDocumento
        };

        this.servicioBuscarPorTipoDocumento(datosDocumento);
      } else if (this.tipoListarServicio === ServicioListarPor.CONTRATO) {
        this.appState$.dispatch(
          new listarContratosActions.LoadAction(numeroContrato, this._serviciosListar.POR_CONTRATO)
        );
      } else if (this.tipoListarServicio === ServicioListarPor.PERSONA) {
        this.appState$.dispatch(
          new listarContratosActions.LoadAction(
            datosPersona.idPersona,
            this._serviciosListar.POR_PERSONA
          )
        );
      }
    }
  }

  public asociadoInputChange({ value, finish }) {
    this.portalApiService.buscarAsociado(value).subscribe(res => {
      finish(
        res.map(
          (prop): IGinniOption => ({
            value: prop.idPersona,
            text: prop.nombre,
            idPersona: prop.idPersona
          })
        )
      );
    }, this.servicioError);
  }

  public servicioBuscarPorTipoDocumento(payload) {
    this.simuladorApiService.buscarPorDocumento(payload).subscribe((res: any) => {
      if (res.length) {
        const idPersona = res[0].idPersona;
        this.appState$.dispatch(
          new listarContratosActions.LoadAction(idPersona, this._serviciosListar.POR_PERSONA)
        );
      } else {
        this.loading = false;
        this.listaContratos = [];
        this.mostrarListaContratos = true;
      }
    }, this.servicioError);
  }

  private servicioError = (error: APIError) => {
    if (error) {
      this.busquedaError = error.mensaje;
      this.listaContratos = [];
      this.loading = false;
      this.mostrarListaContratos = false;
    }
  };

  public simular(contratosModificados: IListaContratosSimulador[]) {
    this.errorSimulador = null;
    this.idContratos = this.obtenerIdContratos(contratosModificados);
    this.simuladorIniciarDatos = null;
    this.mostrarSimulador = true;
    this.loadingSimulador = true;
    this.listaContratos = contratosModificados;
    this.servicioSimuladorIniciar();
  }

  private obtenerIdContratos(listaContratosSeleccionados: IListaContratosSimulador[]) {
    this.contratosSeleccionados = [];
    const contratosId = [];
    listaContratosSeleccionados.forEach((contrato: IListaContratosSimulador) => {
      if (contrato.seleccionado) {
        contratosId.push(contrato.contratoId);
        this.contratosSeleccionados.push(contrato.numeroContrato);
      }
    });
    return contratosId;
  }

  private servicioSimuladorIniciar() {
    this.simuladorApiService.simuladorIniciarDatos(this.idContratos).subscribe(
      (simuladorIniciarDatos: ISimuladorIniciarDatos) => {
        if (simuladorIniciarDatos) {
          this.mostrarListaContratos = false;
          this.loadingSimulador = false;
          this.simuladorIniciarDatos = new SimuladorIniciarDatosModel(simuladorIniciarDatos);
          this.simuladorIniciarDatos.contratos = this.contratosSeleccionados;
          this.errorSimulador = null;
        }
      },
      (error: APIError) => {
        if (error) {
          this.loadingSimulador = false;
          this.loading = false;
          this.mostrarSimulador = false;
          this.errorSimulador = error.mensaje;
        }
      }
    );
  }

  public simuladorCalcular(datosCalcular: ISimuladorConceptosRequest) {
    const payload: ISimuladorCalcularRequest = {
      ...datosCalcular,
      listCodigoContrato: this.idContratos
    };

    this.simuladorApiService.simuladorCalcular(payload).subscribe(
      (res: ISimuladorCalcularResponse) => {
        if (res) {
          const simuladorCalcularDatos = new SimuladorCalcularResponse(res);
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
    const { listaConceptos } = consultarRequest;
    const payload = {
      fondoRemate: consultarRequest.fondoRemate,
      listaConceptos,
      listCodigoContrato: this.idContratos
    };
    this.simuladorApiService.categoriaSimularFinanciamiento(payload).subscribe(
      (categoriaInformacion: ISimuladorCategoria) => {
        if (categoriaInformacion) {
          this.simuladorComponent.servicioConsultarSuccess(categoriaInformacion);
        }
      },
      (error: APIError) => {
        if (error) {
          this.simuladorComponent.servicioConsultarError(error);
        }
      }
    );
  }

  public simuladorCalcularDiferencia(datos) {
    this.simuladorApiService.calcularDiferencia('0', datos.montos).subscribe(result => {
      if (result) {
        this.simuladorComponent.servicioCalcularDiferenciaSuccess(result, datos.clave);
      }
    });
  }

  public generarPDF(event: boolean) {
    if (event) {
      this.simuladorApiService.enviarPDF(this.idContratos).subscribe(
        (res: Blob) => {
          if (res) {
            this.simuladorComponent.seGeneraPDFSuccess(res);
          }
        },
        (error: APIError) => {
          if (error) {
            this.simuladorComponent.seGeneraPDFError(error);
          }
        }
      );
    }
  }

  public regresar() {
    this.mostrarSimulador = false;
    this.simuladorIniciarDatos = null;
    this.busquedaSegunTipoConcepto();
    this.mostrarListaContratos = true;
  }

  public seleccionandoContrato(seSelecciono: boolean) {
    if (seSelecciono) {
      this.errorSimulador = null;
    }
  }
}
