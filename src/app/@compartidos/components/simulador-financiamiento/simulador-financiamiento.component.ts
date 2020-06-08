import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  OnDestroy,
  EventEmitter
} from '@angular/core';
import { FormGroup, Validators, FormBuilder, ValidationErrors, FormControl } from '@angular/forms';
import { ValidationService } from 'app/@compartidos/utils/validation.service';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { ArrayProp, IProp } from 'app/@compartidos/models/prop.interface';
import { SimuladorConceptosModel } from 'app/@compartidos/models/simulador-financiamiento.model';
import {
  IListaConceptos,
  ISimuladorConceptos,
  ISimuladorIniciarDatos,
  ISimuladorCategoria,
  IConsultarRequest
} from 'app/@compartidos/interfaces/simulador-financiamiento.interface';
import Big from 'big.js';
import { ConfiguracionEvaluacionCrediticia } from 'app/modulos/portal/@models/configuracion.model';
import {
  actualizarUppercaseForm,
  formatoMoneda,
  dateFormat,
  desactivarControles,
  activarControles
} from 'app/@compartidos/utils/helpers';
import { APIError } from 'app/@compartidos/models/api-error.model';
import { SimuladorMensajeExcedenteEnum } from 'app/@compartidos/compartidos.enum';
import { NotificationTypeEnum } from 'app/@compartidos/services/notification-type.enum';

export const CLAVEGPS = 'VENTA_EQ_ACC_GPS';

export const CLAVEDIFERENCIAPRECIO = 'COB_DPRECIO';

export enum TipoConcepto {
  CONTADO = 'C',
  FINANCIADO = 'F'
}

@Component({
  selector: 'ginni-simulador-financiamiento',
  templateUrl: './simulador-financiamiento.component.html',
  styleUrls: ['./simulador-financiamiento.component.scss']
})
export class SimuladorFinanciamientoComponent implements OnInit, OnDestroy {
  @Input()
  public configuracionEvaluacionCrediticia: ConfiguracionEvaluacionCrediticia;

  @Input()
  public confirmarButton = false;

  @Input()
  public esInterno = false;

  @Input()
  public evaluacionAprobada = false;

  @Input()
  public failed: string;

  @Input()
  public puedeEditar = true;

  @Input()
  public mostrarTodoConceptos = false;

  @Input()
  public simuladorIniciarDatos: ISimuladorIniciarDatos;

  @Output()
  public aceptarCambioEvent = new EventEmitter();

  @Output()
  public calcularEvent = new EventEmitter();

  @Output()
  public calcularDiferenciaEvent = new EventEmitter();

  @Output()
  public consultarEvent: EventEmitter<IConsultarRequest> = new EventEmitter();

  @Output()
  public generarPDF: EventEmitter<boolean> = new EventEmitter();

  @Output()
  public regresarEmit: EventEmitter<boolean> = new EventEmitter();

  @Output()
  public valoresIniciales: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('select') selectConceptos;

  public calcularMensajeError: string;
  public consultarFailed: string;
  public conceptos: SimuladorConceptosModel[];
  private coleccionMontos = {};
  public _dateFormat = dateFormat;
  public disabledConfirmar: boolean;
  public categoriaInformacion: any;
  public excedenteMensaje: string;
  public excedeLineaMaxima = false;
  public errorType: string;
  public errorAgregarConcepto: boolean;
  public failedConfirmarOPDF: string;
  public fechaFinanciamiento: string;
  public form: FormGroup;
  public formIniciar: FormGroup;
  public _formatoMoneda = formatoMoneda;
  public guardadoExitoso = false;
  public informacionCategoria: boolean;
  public modalConfirmarCambio = false;
  public mostrarCalcular: boolean;
  public montoTotal = '0';
  public listaConfiguracion: ArrayProp;
  public lineaMaximaFinanciamiento: string;
  public loading: boolean;
  public seGuardo: boolean;
  public simuladorForm = true;
  public soloGPS: boolean;
  public successType: string;
  private _seLimpia = false;
  private _valorExcedente: string;
  public GPS_FINANCIADO = 'VENTA_EQ_ACC_GPS';

  constructor(
    public fb: FormBuilder,
    public portalSandbox: PortalSandbox,
    private validations: ValidationService
  ) {}

  ngOnInit() {
    if (!this.failed) {
      this.categoriaInformacion = this.simuladorIniciarDatos.categoriaActual;
      this.errorType = NotificationTypeEnum.Danger;
      this.successType = NotificationTypeEnum.Success;
      this.fechaFinanciamiento = this.simuladorIniciarDatos.fechaFinanciamiento;
      this._valorExcedente = this.simuladorIniciarDatos.valorExcedente;
      this.mostrarMensajeExcedente();
      this.actualizarFormIniciar(this.simuladorIniciarDatos);
      this.calcularMontoTotal();
      this.conSimulacion();

      this.montoTotal = this.simuladorIniciarDatos.totalFinanciamiento;
      this.lineaMaximaFinanciamiento = this.simuladorIniciarDatos.lineaMaxima;
      this.soloGPS = this.simuladorIniciarDatos.soloGps;
    } else {
      // Para no mostrar línea máxima financiamiento
      this.soloGPS = true;
    }
  }

  ngOnDestroy() {
    this.confirmarButton = false;
    this.confirmarButton = false;
    this.mostrarTodoConceptos = false;
    this.simuladorIniciarDatos = null;
  }

  public get descripcionCategoria() {
    const categoriaMensaje = this.categoriaInformacion.categoria;
    return `${categoriaMensaje.codigo}: ${categoriaMensaje.descripcion}`;
  }

  private conSimulacion() {
    if (this.simuladorIniciarDatos.tieneSimulacion) {
      if (this.esInterno) {
        this.informacionCategoria = true;
        this.disabledConfirmar = true;
      }

      this.conceptos = this.simuladorIniciarDatos.listaConceptos.map(
        simulador => new SimuladorConceptosModel(simulador)
      );
      this._seLimpia = false;
      this.mostrarCalcular = true;

      this.obtenerListaConfiguracion(this.simuladorIniciarDatos);
      this.actualizarFormulario(this.conceptos);
      this.desactivarFormDocumento(true);
    }
  }

  private actualizarFormIniciar(simulador: ISimuladorIniciarDatos) {
    this.formIniciar = this.fb.group({
      valorVehiculos: [
        {
          value: simulador.valorVehiculos,
          disabled:
            !this.puedeEditar || this.simuladorIniciarDatos.esPedido || this.evaluacionAprobada
        },
        [
          Validators.required,
          Validators.min(1),
          this.validations.ceroPrimerDigitoValidation,
          this.validations.validateNumber,
          this.validations.validateMonto
        ]
      ],
      cantidadVehiculos: [
        {
          value: simulador.cantidadVehiculos,
          disabled:
            !this.puedeEditar || this.simuladorIniciarDatos.esPedido || this.evaluacionAprobada
        },
        [
          Validators.required,
          Validators.min(1),
          this.validations.ceroPrimerDigitoValidation,
          this.validations.validateNumber,
          this.validations.validateMonto
        ]
      ]
    });
    if (!this.esInterno) {
      const remateControl = new FormControl(
        {
          value: simulador.fondoRemate,
          disabled:
            !this.puedeEditar || this.simuladorIniciarDatos.esPedido || this.evaluacionAprobada
        },
        [
          Validators.max(Number(this.simuladorIniciarDatos.valorCertificado)),
          this.validations.validateNumber,
          this.validations.validateMonto
        ]
      );
      this.formIniciar.addControl('remate', remateControl);
    }
  }

  private actualizarFormulario(conceptos) {
    const grupo = {};
    const controlsDefault: Array<any> = [];
    let diferenciaPrecioFinanciado: ISimuladorConceptos;
    const validaciones = [this.validations.validateNumber, this.validations.validateMonto];
    conceptos.forEach((concepto: ISimuladorConceptos) => {
      this.listaConfiguracion = this.listaConfiguracion.filter(
        configuracion => configuracion.valor !== concepto.valor.toUpperCase()
      );
      if (
        concepto.clave === CLAVEDIFERENCIAPRECIO &&
        concepto.tipoConcepto === TipoConcepto.FINANCIADO
      ) {
        diferenciaPrecioFinanciado = concepto;
      }
      if (this.soloGPS && concepto.clave === CLAVEGPS) {
        if (concepto.readonly) {
          controlsDefault.push(concepto.formControlName);
        }
        grupo[concepto.formControlName] = [concepto.monto, validaciones];
      } else {
        if (concepto.readonly) {
          controlsDefault.push(concepto.formControlName);
        }
        grupo[concepto.formControlName] = [concepto.monto, validaciones];
      }
    });

    this.form = this.fb.group(grupo);
    this.sinDiferenciaPrecio(diferenciaPrecioFinanciado);

    this.obtenerMontos(conceptos);
    conceptos.forEach(concepto => {
      if (!concepto.monto) {
        this.form.get(concepto.formControlName).setValue(0);
      }
    });
  }

  public agregarConcepto(event) {
    this.informacionCategoria = false;
    const clave = event.target.value;
    if (clave) {
      let existeConcepto = false;
      this.conceptos.forEach(concepto => {
        if (concepto.clave === clave) {
          this.errorAgregarConcepto = true;
          return (existeConcepto = true);
        }
      });
      if (!existeConcepto) {
        this.errorAgregarConcepto = false;
        this.crearConcepto(clave.toString());
        this.actualizarFormulario(this.conceptos);
        this.calcularMontoTotal();
      }
    } else {
      this.errorAgregarConcepto = false;
    }
  }

  private crearConcepto(clave: string) {
    const valor = this.configuracionEvaluacionCrediticia.simuladorFinanciamiento.filter(
      (configuracion: IProp) => configuracion.clave === clave
    )[0].valor;
    const formControlName = `${valor}-${TipoConcepto.FINANCIADO}`;
    this.form.addControl(formControlName, new FormControl(''));
    const nuevoConcepto = {
      clave,
      valor,
      tipoConcepto: TipoConcepto.FINANCIADO,
      monto: 0
    };
    this.conceptos.push(new SimuladorConceptosModel(nuevoConcepto));

    this.selectConceptos.nativeElement.value = '';
  }

  public volverConsultar() {
    this.simuladorForm = true;
    this.informacionCategoria = false;
  }

  private remateIsValidated(): boolean {
    if (this.esInterno) {
      return true;
    } else {
      const remate = this.formIniciar.get('remate').value;
      return parseFloat(remate) <= parseFloat(this.simuladorIniciarDatos.valorCertificado);
    }
  }

  private esFormularioValido(): boolean {
    const { valorVehiculos, cantidadVehiculos } = this.formIniciar.controls;
    if (this.esInterno) {
      return !valorVehiculos.errors && !cantidadVehiculos.errors;
    } else {
      const { remate } = this.formIniciar.controls;
      return !valorVehiculos.errors && !cantidadVehiculos.errors && !remate.errors;
    }
  }

  public calcular(): void {
    this.errorAgregarConcepto = false;

    const { valorVehiculos, cantidadVehiculos } = this.formIniciar.value;
    if (this.esFormularioValido()) {
      if (
        (Number(valorVehiculos) && Number(cantidadVehiculos) && this.remateIsValidated()) ||
        this.simuladorIniciarDatos.esPedido
      ) {
        this.loading = true;
        const payload = {
          valorVehiculos,
          cantidadVehiculos
        };

        payload['limpiar'] = this._seLimpia;

        this.calcularEvent.emit(payload);
      }
    }
  }

  private calcularMontoTotal() {
    let result = new Big(0);
    for (const key in this.coleccionMontos) {
      if (this.coleccionMontos.hasOwnProperty(key)) {
        const monto = Number(this.coleccionMontos[key]);
        if (monto) {
          const element = new Big(monto);
          result = result.plus(element);
        }
      }
    }
    this.montoTotal = result.toFixed(2);
    this.excedeFinanciamiento();
  }

  public consultar(): void {
    const { valid } = this.form;

    if (valid && (!this.excedeLineaMaxima || this.soloGPS)) {
      this.loading = true;
      this.guardadoExitoso = false;
      const finalForm = actualizarUppercaseForm(this.formIniciar.value);

      const listaConceptosRequest = [];

      this.conceptos.forEach(concepto => {
        const { monto, clave, tipoConcepto } = concepto;
        listaConceptosRequest.push({
          monto,
          clave,
          tipoConcepto
        });
      });

      const payload: IConsultarRequest = {
        ...finalForm,
        listaConceptos: listaConceptosRequest
      };

      if (!this.esInterno) {
        const { remate } = this.formIniciar.value;
        payload['fondoRemate'] = remate;
      }

      this.consultarEvent.emit(payload);
    }
  }

  public confirmarCambio() {
    if (this.categoriaInformacion.nuevaCategoria) {
      this.modalConfirmarCambio = true;
    } else {
      this.aceptarCambio();
    }
  }

  public aceptarCambio() {
    const { valid } = this.form;
    if (valid) {
      this.loading = true;
      this.aceptarCambioEvent.emit(true);

      if (this.portalSandbox.esMobile) {
        this.informacionCategoria = false;
      }
      this.guardadoExitoso = true;
      this.modalConfirmarCambio = false;
    }
  }

  public seGuardoSimulacionSuccess(guardarSimulador) {
    this.descargarSimulador(guardarSimulador);
    this.loading = false;
    this.seGuardo = true;
    this.disabledConfirmar = true;
    this._seLimpia = false;

    this.consultarFailed = null;
    this.simuladorForm = true;

    // inicializando
    this.obtenerListaConfiguracion(guardarSimulador);
    this.calcularMensajeError = null;

    this.mostrarMensajeExcedente();
    this.conceptos = guardarSimulador.listaConceptos;
    this.mostrarCalcular = true;
    this.conceptos = guardarSimulador.listaConceptos.map(
      simulador => new SimuladorConceptosModel(simulador)
    );
    this.actualizarFormulario(this.conceptos);
    this.conceptos.forEach(concepto => {
      this.validacionExcedeDiferencia(
        concepto.monto,
        concepto.montoInicial,
        concepto.formControlName
      );
    });
    this.desactivarFormDocumento(true);
    this.fechaFinanciamiento = guardarSimulador.fechaFinanciamiento;
    this.soloGPS = guardarSimulador.soloGps;

    this.lineaMaximaFinanciamiento = Number(guardarSimulador.lineaMaxima)
      ? guardarSimulador.lineaMaxima
      : null;
    this.excedeFinanciamiento();
  }

  public seGuardoSimulacionError(error: string) {
    this.loading = false;
    this.seGuardo = false;
    this.failedConfirmarOPDF = error;
  }

  public generarPDFButton() {
    this.generarPDF.emit(true);
    this.loading = true;
  }

  public seGeneraPDFSuccess(arrayBites: Blob) {
    const blob = new Blob([arrayBites], { type: 'application/pdf' });
    const date = this._dateFormat(String(new Date()));

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `Simulador ${date}.pdf`;
    link.click();
    this.loading = false;
  }

  public seGeneraPDFError(error: APIError) {
    this.loading = false;
    this.seGuardo = false;
    this.failedConfirmarOPDF = error.mensaje;
  }

  public cancelarCambio() {
    this.modalConfirmarCambio = false;
  }

  private getControl(...ids) {
    let controls: any = this.form.controls;
    let control;

    ids.forEach(id => {
      control = controls[id];
      if (controls[id] instanceof FormGroup) {
        controls = controls[id].controls;
        return;
      }
    });
    return control;
  }

  public getControlError(...ids) {
    return this.getControl(...ids).errors;
  }

  public getControlSelectedError(id, error) {
    const errors = this.getControlError(id);
    if (errors) {
      return errors[error];
    }
    return null;
  }

  private excedeFinanciamiento() {
    if (Number(this.montoTotal) > Number(this.lineaMaximaFinanciamiento)) {
      this.excedeLineaMaxima = true;
    } else {
      this.excedeLineaMaxima = false;
    }
  }

  public inputMonto(conceptoActual: IListaConceptos, event) {
    if (event.code !== 'Tab') {
      this.informacionCategoria = false;
      const clave = conceptoActual.clave;
      const formControlName = conceptoActual.formControlName;
      let monto = this.form.get(formControlName).value;

      if (!monto) {
        monto = 0;
      }
      const montoInicial = conceptoActual.montoInicial;
      this.validacionExcedeDiferencia(monto, montoInicial, formControlName);
      this.conceptos.forEach(concepto => {
        if (concepto.formControlName === formControlName) {
          concepto.monto = monto;
        }
      });
      if (!monto) {
        this.form.get(formControlName).setValue(0);
      }

      if (conceptoActual.nombreConcepto) {
        const payload = {
          clave,
          montos: {
            montoFinanciado: monto,
            montoInicial
          }
        };
        this.calcularDiferenciaEvent.emit(payload);
      }

      this.coleccionMontos[formControlName] = monto;
      this.calcularMontoTotal();
    }
  }

  public servicioCalcularDiferenciaSuccess(result, clave) {
    this.conceptos.forEach((concepto, index) => {
      if (concepto.clave === clave && concepto.tipoConcepto === TipoConcepto.CONTADO) {
        this.form.get(concepto.formControlName).setValue(result.montoContado);
        this.conceptos[index].monto = result.montoContado;
      }
    });
  }

  public servicioCalcularSuccess(simuladorCalcularDatos) {
    this.loading = false;
    this.obtenerListaConfiguracion(simuladorCalcularDatos);
    this.calcularMensajeError = null;
    this._valorExcedente = simuladorCalcularDatos.valorExcedente;
    this.mostrarMensajeExcedente();
    this.conceptos = simuladorCalcularDatos.listaConceptos;
    this.mostrarCalcular = true;
    this.conceptos = simuladorCalcularDatos.listaConceptos.map(
      (simulador: IListaConceptos) => new SimuladorConceptosModel(simulador)
    );
    this.actualizarFormulario(this.conceptos);
    this.conceptos.forEach((concepto: ISimuladorConceptos) => {
      this.validacionExcedeDiferencia(
        concepto.monto,
        concepto.montoInicial,
        concepto.formControlName
      );
    });
    this.desactivarFormDocumento(true);

    this.calcularMontoTotal();
  }

  public servicioCalcularError(error: APIError) {
    this.loading = false;
    this.calcularMensajeError = error.mensaje;
  }

  public servicioConsultarSuccess(categoriaInformacion: ISimuladorCategoria) {
    this.loading = false;
    this.seGuardo = false;
    this.disabledConfirmar = false;
    this.portalSandbox.esMobile ? (this.simuladorForm = false) : (this.simuladorForm = true);
    this.categoriaInformacion = categoriaInformacion;
    this.consultarFailed = null;
    this.informacionCategoria = true;
  }

  public servicioConsultarError(error: APIError) {
    this.loading = false;
    this.seGuardo = false;
    this.consultarFailed = error.mensaje;
    this.informacionCategoria = false;
  }

  public desactivarFormDocumento = (activar = false) => {
    let controls: string[];
    this.esInterno
      ? (controls = ['valorVehiculos', 'cantidadVehiculos'])
      : (controls = ['valorVehiculos', 'cantidadVehiculos', 'remate']);

    if (activar) {
      desactivarControles(this.formIniciar, controls);
    } else {
      activarControles(this.formIniciar, controls);
    }
  };

  private sinDiferenciaPrecio(diferenciaPrecioFinanciado: ISimuladorConceptos) {
    if (this.simuladorIniciarDatos) {
      const montoVehiculo = this.formIniciar.get('valorVehiculos').value;
      const valorCertificado = this.simuladorIniciarDatos.valorCertificado;

      if (Number(montoVehiculo) <= Number(valorCertificado)) {
        if (diferenciaPrecioFinanciado) {
          this.form.get(diferenciaPrecioFinanciado.formControlName).setValue(0);
          this.form.get(diferenciaPrecioFinanciado.formControlName).disable();
        }
      }
    }
  }

  private obtenerMontos(conceptos) {
    conceptos.forEach((concepto: ISimuladorConceptos) => {
      if (concepto.tipoConcepto === TipoConcepto.FINANCIADO) {
        this.coleccionMontos[concepto.formControlName] = this.form.get(
          concepto.formControlName
        ).value;
      }
    });
  }

  private obtenerListaConfiguracion(conceptos) {
    conceptos.listaConceptos.forEach(concepto => {
      this.listaConfiguracion = this.configuracionEvaluacionCrediticia.simuladorFinanciamiento.filter(
        configuracion => configuracion.valor !== concepto.valor.toUpperCase()
      );
    });
  }

  public regresar() {
    this.simuladorForm = true;
    this.informacionCategoria = false;
  }

  public validarFormIniciar(control, event) {
    const monto = event.target.value;
    if (!monto) {
      this.formIniciar.get(control).setValue(0);
    }
  }

  private validacionExcedeDiferencia(monto, montoInicial, formControlName) {
    if (formControlName === 'DIFERENCIA DE PRECIO-F' || formControlName === 'GPS-F') {
      if (Number(monto) > Number(montoInicial)) {
        const control = this.form.get(formControlName);
        const excedeDiferencia: ValidationErrors = { excedeDiferencia: true };
        setTimeout(() => {
          control.markAsDirty();
          control.markAsTouched();
          control.setErrors(excedeDiferencia);
        }, 1);
      }
    }
  }

  public valoresInicialesButton() {
    this._seLimpia = true;
    this.consultarFailed = null;
    this.mostrarCalcular = false;
    this.informacionCategoria = false;
    this.desactivarFormDocumento();
    this.formIniciar.get('cantidadVehiculos').setValue(1);
    this.formIniciar.get('valorVehiculos').setValue(this.simuladorIniciarDatos.valorCertificado);
    this.coleccionMontos = {};
    this._valorExcedente = null;
    if (!this.esInterno) {
      this.formIniciar.get('remate').setValue(0);
    }
    this.mostrarMensajeExcedente();
    this.valoresInicialesServicio();
  }

  private valoresInicialesServicio() {
    if (this.esInterno) {
      this.loading = true;
      this.valoresIniciales.emit(true);
    }
  }

  public valoresInicialesSuccess(response: ISimuladorIniciarDatos) {
    this.simuladorIniciarDatos = response;
    this._valorExcedente = this.simuladorIniciarDatos.valorExcedente;
    this.mostrarMensajeExcedente();
    this.actualizarFormIniciar(this.simuladorIniciarDatos);

    this.loading = false;
    this.desactivarFormDocumento(this.simuladorIniciarDatos.esPedido);
  }

  public valoresInicialesError(error: string) {
    this.calcularMensajeError = error;
    this.loading = false;
  }

  private mostrarMensajeExcedente() {
    if (Number(this._valorExcedente) > 0) {
      const montoValorExcedente = this._formatoMoneda(this._valorExcedente);
      this.excedenteMensaje = `${SimuladorMensajeExcedenteEnum.TIENE_EXCEDENTE} ${montoValorExcedente}`;
    } else {
      this.excedenteMensaje = SimuladorMensajeExcedenteEnum.SIN_EXCEDENTE;
    }
  }

  public descargarSimulador(file) {
    if (file && file.archivo) {
      const date = this._dateFormat(String(new Date()));
      const link = document.createElement('a');
      link.href = 'data:application/octet-stream;base64,' + file.archivo;
      link.download = `Simulador ${date}.pdf`;
      link.click();
    }
  }
}
