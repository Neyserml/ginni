import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import {
  AdjudicadosTipo,
  CodigoNumero,
  CodigoValor,
  ContratoResueltoInfoSimulacion,
  ContratoResueltoRelacionadosSimulacion,
  ContratosYTipoDeBien,
  GuardarSimulacionRequest,
  ListaContratosResueltos,
  ListaDeGruposRequest,
  ListaDeGruposResponse,
  SimuladorRequest,
  SimuladorResponse,
  TiposDeBien
} from '../../../detalle-resueltos.interface';
import { DetalleResueltosService } from '../../../detalle-resueltos.service';
import { AsociadoDetalleEnum } from '../../../detalle-resueltos.enum';
import { collapseInDownAnimation } from 'app/@compartidos/animations/collapseInDown.animation';
import { InBetween } from 'app/@compartidos/directives/validar-max-min/validar-max-min.interface';
import { ICias } from 'app/@compartidos/interfaces/simulador-reactivaciones.interface';
import { APIError } from 'app/@compartidos/models';
import { AlertType, NotificationTypeEnum } from 'app/@compartidos/services/notification-type.enum';
import { NotEmptyValidator } from 'app/@compartidos/validators/not-empty.validator';
import { OptionalValidator } from 'app/@compartidos/validators/optional.validator';
import {
  dateFormat,
  esMobile,
  formatoMoneda,
  formatoMonedaSinSimbolo
} from 'app/@compartidos/utils/helpers';
import { BandejaService } from 'app/modulos/reactivaciones/bandeja/bandeja.service';
import { BandejaEnum } from 'app/modulos/reactivaciones/bandeja/bandeja.enum';
import { SimuladorDetalleContrato } from 'app/modulos/reactivaciones/detalle-resueltos/@models/simulador.model';

@Component({
  selector: 'ginni-simulador',
  animations: [collapseInDownAnimation],
  styleUrls: ['./simulador.component.scss'],
  templateUrl: './simulador.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SimuladorComponent implements OnInit {
  @ViewChild('scrollFixed', { read: ElementRef }) scrollFixed: ElementRef;
  @ViewChild('scrollContratosFixed', { read: ElementRef }) scrollContratosFixed: ElementRef;
  public scrollFirstInvalid = new Subject();
  private diferenciaCiaSubject: Subject<string> = new Subject<string>();
  private ciaSubject: Subject<ICias> = new Subject<ICias>();
  public _dateFormat = dateFormat;
  public _esMobile = esMobile;
  public _formatoMoneda = formatoMoneda;
  public _formatoMonedaSinSimbolo = formatoMonedaSinSimbolo;

  public adjudicadosDetalle: AdjudicadosTipo[] = [];
  public certificados: CodigoNumero[] = [];
  public confirmSave = false;
  public contratoActual: ContratoResueltoInfoSimulacion = null;
  public contratosRelacionados: ContratoResueltoRelacionadosSimulacion[] = [];
  public contratosYProductos: CodigoValor[] = [];
  public diaPago: number = null;
  public disableForm = false;
  public deshabilitarGuardado = false;
  public errorPayment = false;
  public failed: string;
  public failedAdjudicadosDetalle: string;
  public failedCertificados: string;
  public failedContratosRelacionados: string;
  public guardarSimulacionAlertMessage: string;
  public failedInversionInmobiliaria: string;
  public failedListadoDeGrupos: string;
  public failedMarcas: string;
  public failedMetodos: string;
  public failedModelos: string;
  public failedProgramaProductos: string;
  public failedSimulador: string;
  public failedTiposDeBien: string;
  public failedValidarPagoRedirigir: string;
  public fechaProximaAsamblea = '';
  public fechaUltimaSimulacion = '';
  public form: FormGroup;
  public formErrors = {
    tipoDeBienControl: '',
    programaProductosControl: '',
    grupoControl: '',
    valorCertificadoControl: '',
    marcaControl: '',
    modeloControl: '',
    numeroDeFormatoControl: '',
    inversionInmobiliariaControl: '',
    updateSimulacionControl: '',
    diferenciaCiaControl: ''
  };
  public generateError = false;
  public grupoId: number;
  public habilitarGuardado: boolean;
  public deshabilitarSwitch: boolean;
  public inBetween: InBetween[] = [];
  public inversionInmobiliaria: CodigoValor[] = [];

  get isTipoVehiculo(): boolean {
    return this._isTipoVehiculo;
  }

  set isTipoVehiculo(tipo) {
    this._isTipoVehiculo = tipo;
  }

  public _isTipoVehiculo: boolean;
  public listaDeGrupos: ListaDeGruposResponse[] = [];
  public loading = false;
  public loadingAdjudicadosDetalle = false;
  public loadingCertificados = false;
  public loadingContratosRelacionados = false;
  public loadingGenerarObligacionACuenta = false;
  public loadingGuardarSimulacion = false;
  public loadingInversionInmobiliaria = false;
  public loadingListadoDeGrupos = false;
  public loadingMarcas = false;
  public loadingMetodos = false;
  public loadingModal = false;
  public loadingModelos = false;
  public loadingProgramaProductos = false;
  public loadingSimulador = false;
  public loadingSimulation = false;
  public loadingTiposDeBien = false;
  public loadingValidarPagoRedirigir = false;
  public generateOverflow = false;
  public guardarSimulacionMensaje = false;
  public modelos: CodigoValor[] = [];
  public marcas: CodigoValor[] = [];
  public metodoCodigo: number;
  public metodos: CodigoValor[] = [];
  public mostrarContratosRelacionados = false;
  public mostrarSimulacion = false;
  public mostrarGrupos = false;
  public mostrarPagos = false;
  public movimientoTipo = '';
  public nuevoNumeroDeContrato: string;
  public numeroAsamblea: number = null;
  public numeroMeses = '';
  public payment = false;
  public porcentajeCuotaAdmin: number = null;
  public numeroProximaAsamblea: number = null;
  public scrollerHeight = 0;
  public scrollerContratosHeight = 0;
  public scrollFixedHeight = 0;
  public scrollContratosFixedHeight = 0;
  public showInformacionRelevante = true;
  public showtotal = false;
  public simulacionCaducada = false;
  public simulador: SimuladorResponse = null;
  public state = {
    accordeon: [],
    accordeonGrupos: [],
    accordeonContratos: [],
    checkboxes: [],
    item: {},
    radiobuttons: [],
    switch: {
      value: false
    }
  };
  public submitted = false;
  public tiposDeBien: TiposDeBien[] = [];
  public vacantes: number = null;
  public validarSwitch = false;
  public validationMessages = {
    tipoDeBienControl: {
      min: 'Este campo es obligatorio'
    },
    programaProductosControl: {
      min: 'Este campo es obligatorio',
      required: 'Este campo es obligatorio'
    },
    grupoControl: {
      required: 'Este campo es obligatorio',
      empty: 'Este campo es obligatorio'
    },
    valorCertificadoControl: {
      min: 'Este campo es obligatorio',
      required: 'Este campo es obligatorio'
    },
    numeroDeFormatoControl: {
      required: 'Este campo es obligatorio'
    },
    inversionInmobiliariaControl: {
      min: 'Este campo es obligatorio'
    },
    marcaControl: {
      min: 'Este campo es obligatorio'
    },
    modeloControl: {
      min: 'Este campo es obligatorio'
    },
    updateSimulacionControl: {
      min: 'Este campo es obligatorio'
    },
    diferenciaCiaControl: {
      max: 'Ingrese un monto menor',
      min: 'Ingrese un monto mayor',
      required: 'Este campo es obligatorio'
    },
    cia0: {
      max: 'Ingrese un monto menor',
      min: 'Ingrese un monto mayor',
      required: 'Este campo es obligatorio'
    }
  };
  public guardarSimulacionAlertType: AlertType;
  private contratoOrigenId: number;
  private contratoID: number;

  get tipoDeBienControl() {
    return this.form.get('tipoDeBienControl') as FormControl;
  }

  get programaProductosControl() {
    return this.form.get('programaProductosControl') as FormControl;
  }

  get grupoControl() {
    return this.form.get('grupoControl') as FormControl;
  }

  get marcaControl() {
    return this.form.get('marcaControl') as FormControl;
  }

  get modeloControl() {
    return this.form.get('modeloControl') as FormControl;
  }

  get inversionInmobiliariaControl() {
    return this.form.get('inversionInmobiliariaControl') as FormControl;
  }

  get diferenciaCiaControl() {
    return this.form.get('diferenciaCiaControl') as FormControl;
  }

  get updateSimulacionControl() {
    return this.form.get('updateSimulacionControl') as FormControl;
  }

  get numeroDeFormatoControl() {
    return this.form.get('numeroDeFormatoControl') as FormControl;
  }

  get valorCertificadoControl() {
    return this.form.get('valorCertificadoControl') as FormControl;
  }

  constructor(
    private bandejaService: BandejaService,
    private detalleService: DetalleResueltosService,
    private formBuilder: FormBuilder,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadingSimulation = true;
    this.iniciarDiferenciaCiaSubject();
    this.iniciarCiaSubject();
    this.toggleMostrarPagos();
    this.toggleInformacionRelevante();
    this.validarPagoGenerado();
  }

  private validarPagoGenerado() {
    if (
      this.bandejaService.contratoActual &&
      this.bandejaService.contratoActual.reactivacionContratoID
    ) {
      this.loadingValidarPagoRedirigir = true;
      this.detalleService
        .validarPagoGenerado(this.bandejaService.contratoActual.reactivacionContratoID)
        .subscribe(
          res => {
            this.loadingValidarPagoRedirigir = false;
            if (res.pagoGenerado) {
              this.loadingSimulation = false;
              this.errorPayment = true;
            } else {
              this.cargarSimulacionRedirigir();
            }
          },
          (error: APIError) => {
            this.loadingValidarPagoRedirigir = false;
            this.failedValidarPagoRedirigir = error.mensaje;
          }
        );
    } else {
      this.router.navigate([`${BandejaEnum.Url}`]);
    }
  }

  private cargarSimulacionRedirigir() {
    if (this.bandejaService.contratoActual) {
      this.cargarSimulacionAlmacenada();
    } else {
      this.router.navigate([`${BandejaEnum.Url}`]);
    }
  }

  public getNumeroContratoByContratoId(contratoID) {
    const contratoActual = this.contratoActual.listaContratos.find(
      contrato => contrato.contratoID === contratoID
    );

    if (contratoActual) {
      return contratoActual.numeroContrato;
    }
  }

  public agrearContrato(): void {
    if (!this.disableForm) {
      this.mostrarContratosRelacionados = true;
      this.contratosRelacionados = [];
      this.loadingContratosRelacionados = true;
      this.detalleService
        .getContratoResueltoRelacionadosSimulacion(this.contratoOrigenId)
        .subscribe(
          contratos => {
            this.loadingContratosRelacionados = false;
            this.contratosRelacionados = this.notInContratos(contratos);
            this.generateCheckboxesState(this.contratosRelacionados);
            this.generateAccordeonContratosState(this.contratosRelacionados);
          },
          (error: APIError) => {
            this.failedContratosRelacionados = error.mensaje;
            this.loadingContratosRelacionados = false;
          }
        );
    }
  }

  public agregarContratosSeleccionados(): void {
    this.state.checkboxes.forEach((item, index) => {
      this.state.item = item;
      if (this.state.checkboxes[index]) {
        this.contratoActual.listaContratos.push(this.contratosRelacionados[index]);
        delete this.state.checkboxes[index];
        if (this.state.accordeon) {
          this.state.accordeon[this.state.accordeon.length] = false;
        }
      }
    });
    this.adjudicadosDetalle = null;
    this.cerrarContratosRelacionados();
  }

  public agregarGrupoIsDisabled(): boolean {
    return !this.state.radiobuttons.find(checkbox => checkbox);
  }

  public agregarGrupoSeleccionado(): void {
    this.deshabilitarSwitch = false;
    this.state.radiobuttons.forEach((item, index) => {
      this.state.item = item;
      if (this.listaDeGrupos[index] && this.state.radiobuttons[index]) {
        this.form.get('grupoControl').setValue(this.listaDeGrupos[index].numeroGrupo);
        this.setGrupoFormAttributes(this.listaDeGrupos[index]);
        this.getAsambleasAdjudicadas(this.listaDeGrupos[index].grupoId);
        this.llenarCertificados(this.listaDeGrupos[index].numeroGrupo);
      }
    });
    this.cerrarListadoDeGrupos();
    this.clearSimulation();
    this.closeAlert();
  }

  public agregarIsDisabled(): boolean {
    return !this.state.checkboxes.find(checkbox => checkbox);
  }

  public isRecupero() {
    return this.movimientoTipo.toUpperCase() === 'RECUPERO' ? 'diferir' : 'aplicar';
  }

  public buildForm(formValues): void {
    const values = new SimuladorDetalleContrato(formValues);
    const controls = {
      tipoDeBienControl: [values.tipoDeBienControl, [Validators.min(1)]],
      programaProductosControl: [values.programaProductosControl, [Validators.min(1)]],
      grupoControl: [
        values.grupoControl,
        [
          Validators.min(1),
          Validators.nullValidator,
          NotEmptyValidator,
          Validators.minLength(1),
          Validators.required
        ]
      ],
      valorCertificadoControl: [values.valorCertificadoControl, [Validators.min(1)]],
      marcaControl: [values.marcaControl, OptionalValidator([Validators.min(1)])],
      modeloControl: [values.modeloControl, OptionalValidator([Validators.min(1)])],
      numeroDeFormatoControl: [
        values.numeroDeFormatoControl,
        OptionalValidator([Validators.required])
      ],
      inversionInmobiliariaControl: [
        values.inversionInmobiliariaControl,
        OptionalValidator([Validators.min(1)])
      ],
      updateSimulacionControl: [values.updateSimulacionControl],
      diferenciaCiaControl: [
        values.diferenciaCiaControl,
        [Validators.required, Validators.min(0.0)]
      ]
    };
    this.form = this.formBuilder.group(controls);
    this.onValueChanges();
  }

  public cerrarContratosRelacionados(): void {
    this.mostrarContratosRelacionados = false;
    this.actualizarProductos(this.form.get('tipoDeBienControl').value);
    this.contratosRelacionados = [];
    this.scrollerContratosHeight = 0;
  }

  public cerrarListadoDeGrupos() {
    this.scrollerHeight = 0;
    this.mostrarGrupos = false;
  }

  public cerrarSimulacionCaducada() {
    this.simulacionCaducada = false;
  }

  public checkRadiobutton(index: number) {
    this.state.radiobuttons.forEach((radio, radioIndex) => {
      this.state.item = radio;
      this.state.radiobuttons[radioIndex] = index === radioIndex;
    });
  }

  public clearSimulation() {
    if (this.submitted) {
      this.submitted = false;
      this.form.get('marcaControl').setValue(0);
      this.form.get('modeloControl').setValue(0);
      this.form.get('inversionInmobiliariaControl').setValue(0);
      this.form.get('numeroDeFormatoControl').setValue('');
      this.cleanGrupoAttr();
      this.mostrarSimulacion = false;
      this.closeAlert();
    }
  }

  public closeAlert() {
    this.guardarSimulacionAlertMessage = null;
    this.guardarSimulacionAlertType = null;
    this.guardarSimulacionMensaje = false;
    this.fechaUltimaSimulacion = null;
  }

  public checkInBeetween() {
    if (this.inBetween) {
      this.inBetween.map(cia => {
        if (document.getElementById(cia.id) && document.getElementById(cia.id).classList) {
          cia.between
            ? document.getElementById(cia.id).classList.remove('error')
            : document.getElementById(cia.id).classList.add('error');
        }
      });
      if (this.inBetween.find(cia => !cia.between)) {
        this.deshabilitarGuardado = true;
        this.deshabilitarSwitch = true;
        this.state.switch.value = false;
        this.removeOptionalFields();
      } else {
        this.deshabilitarGuardado = false;
        this.deshabilitarSwitch = false;
      }
    }
  }

  public eliminarContrato(index: number, contratoOrigen: boolean): void {
    if (!contratoOrigen && !this.disableForm) {
      this.contratoActual.listaContratos.splice(index, 1);
      this.state.accordeon.splice(index, 1);
      this.actualizarProductos(this.form.get('tipoDeBienControl').value);
      this.adjudicadosDetalle = null;
      this.clearSimulation();
      this.closeAlert();
    }
  }

  public guardarSimulacion() {
    this.removeOptionalFields();
    if (!this.disableForm && this.noErrors()) {
      this.deshabilitarGuardado = true;
      this.deshabilitarSwitch = true;
      this.disableForm = true;
      this.loadingGuardarSimulacion = true;
      const bienServicio = this.isTipoVehiculo
        ? this.form.get('modeloControl').value
        : this.form.get('inversionInmobiliariaControl').value;
      const bienServicioID = bienServicio === 0 || bienServicio === '0' ? null : bienServicio;
      const movimientoSimulacionDetalle = this.simulador.simulaciones[0].detalle.cias.map(
        simulador => ({
          contratoId: simulador.contratoId,
          importeCIA: simulador.saldo
        })
      );
      const simulacion: GuardarSimulacionRequest = {
        listaIDTipoBienServicio: this.form.get('tipoDeBienControl').value,
        grupoID: this.grupoId,
        certificadoPosicionID: this.form.get('valorCertificadoControl').value,
        marcaID:
          this.form.get('marcaControl').value === 0 || this.form.get('marcaControl').value === '0'
            ? null
            : this.form.get('marcaControl').value,
        bienServicioID,
        numeroFormato:
          this.form.get('numeroDeFormatoControl').value === ''
            ? null
            : this.form.get('numeroDeFormatoControl').value,
        listaIDSimulacionOpcion: this.form.get('updateSimulacionControl').value,
        contratoId: this.contratoID,
        importeDiferenciaCIA: this.simulador.simulaciones[0].detalle.diferenciaCiaValor,
        movimientoSimulacionDetalle
      };
      this.detalleService.guardarSimulacion(simulacion).subscribe(
        res => {
          this.guardarSimulacionAlertType = NotificationTypeEnum.Success;
          this.loadingGuardarSimulacion = false;
          this.guardarSimulacionMensaje = true;
          this.guardarSimulacionAlertMessage = res.mensaje;
          this.fechaUltimaSimulacion = this._dateFormat(res.fechaUltimaSimulacion);
          this.disableForm = false;
          this.deshabilitarGuardado = true;
          this.deshabilitarSwitch = false;
          this.router.navigate([
            '/portal/bandeja-de-reactivaciones/detalle/generar-contrato/validar-datos'
          ]);
        },
        (error: APIError) => {
          this.guardarSimulacionAlertType = NotificationTypeEnum.Danger;
          this.guardarSimulacionMensaje = true;
          this.guardarSimulacionAlertMessage = error.mensaje;
          this.loadingGuardarSimulacion = false;
          this.disableForm = false;
          this.deshabilitarGuardado = false;
          this.deshabilitarSwitch = false;
        }
      );
    }
  }

  public isFieldValid(field: string) {
    return !this.form.get(field).valid && this.form.get(field).touched && this.submitted;
  }

  public isInBetween(value: InBetween): void {
    if (document.getElementById(value.id) && document.getElementById(value.id).classList) {
      value.between
        ? document.getElementById(value.id).classList.remove('error')
        : document.getElementById(value.id).classList.add('error');
      this.inBetween.map(item => {
        if (value.id === item.id) {
          item.id = value.id;
          item.between =
            value &&
            String(value).trim() !== '' &&
            Number(item.min) <= Number(value) &&
            Number(value) <= Number(item.max);
          item.max = value.max;
          item.min = value.min;
          item.value = value.value;
        }
      });
    }
  }

  public toggleInformacionRelevante() {
    this.showInformacionRelevante = this._esMobile() ? !this.showInformacionRelevante : true;
  }

  public toggleMostrarPagos() {
    this.mostrarPagos = this._esMobile() ? !this.mostrarPagos : true;
  }

  private generateAccordeonState(items: ListaContratosResueltos[]): void {
    items.forEach((item, index) => {
      if (item.contratoOrigen) {
        this.contratoOrigenId = item.contratoID;
      }
      this.state.item = item;
      this.state.accordeon[index] = false;
    });
  }

  private generateAccordeonGruposState(items: ListaDeGruposResponse[]): void {
    items.forEach((item, index) => {
      this.state.item = item;
      this.state.accordeonGrupos[index] = false;
    });
    this.setScrollHeight();
  }

  private generateAccordeonContratosState(items: ContratoResueltoRelacionadosSimulacion[]): void {
    items.forEach((item, index) => {
      this.state.item = item;
      this.state.accordeonContratos[index] = false;
    });
    this.setContratosScrollHeight();
  }

  private setScrollHeight() {
    setTimeout(() => {
      if (this.scrollFixed) {
        this.scrollFixedHeight = this.scrollFixed.nativeElement.offsetHeight;
      }
      this.scrollerHeight = window.innerHeight - this.scrollFixedHeight - 19;
    }, 100);
  }

  private setContratosScrollHeight() {
    setTimeout(() => {
      if (this.scrollContratosFixed) {
        this.scrollContratosFixedHeight = this.scrollContratosFixed.nativeElement.offsetHeight;
      }
      this.scrollerContratosHeight = window.innerHeight - this.scrollContratosFixedHeight - 19;
    }, 100);
  }

  private generateCheckboxesState(items: ListaContratosResueltos[]): void {
    items.forEach((item, index) => {
      this.state.item = item;
      this.state.checkboxes[index] = false;
    });
  }

  private generateRadiobuttonsState(items: ListaDeGruposResponse[]): void {
    items.forEach((item, index) => {
      this.state.item = item;
      this.state.radiobuttons[index] = false;
    });
  }

  public hasProgramaProductos() {
    return (
      this.form.get('programaProductosControl').value !== 0 &&
      this.form.get('programaProductosControl').value !== '0'
    );
  }

  public listadoDeGrupos() {
    if (this.hasProgramaProductos()) {
      const contratos = this.contratoActual.listaContratos.map(contrato => contrato.contratoID);
      const codigoProducto = this.form.get('programaProductosControl').value;
      if (contratos && codigoProducto !== 0) {
        this.mostrarGrupos = true;
        const listaDeGruposRequest = {
          contratos,
          codigoProducto
        };
        this.getListaDeGrupos(listaDeGruposRequest);
      }
    }
  }

  private notInContratos(
    contratos: ContratoResueltoRelacionadosSimulacion[]
  ): ContratoResueltoRelacionadosSimulacion[] {
    return contratos.filter(
      contrato =>
        !this.contratoActual.listaContratos.find(cont => cont.contratoID === contrato.contratoID)
    );
  }

  private fillErrorsAmount(): void {
    const form = this.form;
    Object.keys(this.formErrors).forEach(field => {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && !control.valid && (!control.disabled && (control.touched || this.submitted))) {
        const messages = this.validationMessages[field];
        const errors = Object.keys(control.errors).map(key => messages[key]);
        if (this.isTipoVehiculo) {
          if (field !== 'inversionInmobiliariaControl') {
            this.formErrors[field] = errors[0];
          }
        } else {
          if (!(field === 'marcaControl' || field === 'modeloControl')) {
            this.formErrors[field] = errors[0];
          }
        }
      }
    });
  }

  private onValueChanged(): void {
    this.closeAlert();
    this.deshabilitarGuardado = false;
    this.state.switch.value = false;
    this.deshabilitarSwitch = false;
    if (!this.form) {
      return;
    }
    this.fillErrorsAmount();
  }

  private onValueChanges() {
    this.valorCertificadoControl.valueChanges.subscribe(() => {
      this.mostrarSimulacion = false;
      this.submitted = false;
    });
    this.form.valueChanges.subscribe(() => this.fillErrorsAmount());
  }

  private cleanGrupoAttr() {
    this.numeroAsamblea = null;
    this.diaPago = null;
    this.vacantes = null;
    this.fechaProximaAsamblea = '';
    this.porcentajeCuotaAdmin = null;
    this.numeroProximaAsamblea = null;
    this.movimientoTipo = '';
    this.numeroMeses = '';
  }

  private setGrupoFormAttributes(grupo: ListaDeGruposResponse): void {
    this.numeroAsamblea = grupo.numeroAsamblea;
    this.diaPago = grupo.diaPago;
    this.vacantes = grupo.vacantes;
    this.fechaProximaAsamblea = grupo.fechaProximaAsamblea;
    this.numeroProximaAsamblea = grupo.proximaAsamblea;
    this.porcentajeCuotaAdmin = grupo.porcentajeCuotaAdmin;
    this.movimientoTipo = grupo.movimientoTipo;
    this.numeroMeses = grupo.numeroMeses;
  }

  private addOptionalFields() {
    if (this.isTipoVehiculo) {
      this.marcaControl.setValidators([Validators.min(1)]);
      this.marcaControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
      this.modeloControl.setValidators([Validators.min(1)]);
      this.modeloControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    } else {
      this.inversionInmobiliariaControl.setValidators([Validators.min(1)]);
      this.inversionInmobiliariaControl.updateValueAndValidity({
        onlySelf: true,
        emitEvent: false
      });
    }
    this.numeroDeFormatoControl.setValidators([Validators.required]);
    this.numeroDeFormatoControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    this.diferenciaCiaControl.setValidators([Validators.required]);
    this.diferenciaCiaControl.updateValueAndValidity();
  }

  private removeOptionalFields() {
    this.form.get('marcaControl').clearValidators();
    this.form.get('marcaControl').updateValueAndValidity();
    this.form.get('modeloControl').clearValidators();
    this.form.get('modeloControl').updateValueAndValidity();
    this.form.get('numeroDeFormatoControl').clearValidators();
    this.form.get('numeroDeFormatoControl').updateValueAndValidity();
    this.form.get('inversionInmobiliariaControl').clearValidators();
    this.form.get('inversionInmobiliariaControl').updateValueAndValidity();
    if (this.inBetween) {
      this.inBetween.map(cia => {
        this.form.get(cia.id).clearValidators();
        this.form.get(cia.id).updateValueAndValidity();
      });
    }
  }

  submit(): void {
    this.disableForm = true;
    this.removeOptionalFields();
    this.state.switch.value = false;
    this.submitted = true;
    this.mostrarSimulacion = false;
    this.validateRequiredFormFields(this.form);
    if (this.form.valid) {
      this.deshabilitarGuardado = false;
      this.getMetodos();
    } else {
      this.deshabilitarGuardado = true;
      this.disableForm = false;
    }
  }

  private validateAllFormFields(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  private validateRequiredFormFields(formGroup: FormGroup) {
    formGroup.controls.tipoDeBienControl.markAsTouched();
    formGroup.controls.programaProductosControl.markAsTouched();
    formGroup.controls.grupoControl.markAsTouched();
    formGroup.controls.valorCertificadoControl.markAsTouched();
  }

  public validateSwitch() {
    if (!this.deshabilitarSwitch) {
      this.disableForm = true;
      if (this.state.switch.value) {
        this.validarSwitch = true;
        this.addOptionalFields();
        this.onValueChanged();
        this.validateAllFormFields(this.form);
        this.scrollFirstInvalid.next(!this.noErrors());
        this.state.switch.value = this.noErrors();
        this.disableForm = false;
      } else {
        this.closeAlert();
        this.validarSwitch = true;
        this.state.switch.value = false;
        this.removeOptionalFields();
        this.disableForm = false;
      }
    } else if (this.state.switch.value) {
      this.validarSwitch = false;
      this.state.switch.value = false;
      this.removeOptionalFields();
    }
  }

  public tipoInmueble(tipoBien: string): boolean {
    return tipoBien.toUpperCase() === AsociadoDetalleEnum.Inmueble.toUpperCase();
  }

  public tipoVehiculo(tipoBien: string): boolean {
    return tipoBien.toUpperCase() === AsociadoDetalleEnum.Vehiculo.toUpperCase();
  }

  public toggleCollapse(index: number): void {
    this.state.accordeon.forEach((item, i) => {
      this.state.item = item;
      this.state.accordeon[i] =
        index === i ? (this.state.accordeon[i] = !this.state.accordeon[i]) : false;
    });
  }

  public toggleCollapseGrupos(index: number): void {
    this.state.accordeonGrupos.forEach((item, i) => {
      this.state.item = item;
      this.state.accordeonGrupos[i] =
        index === i ? (this.state.accordeonGrupos[i] = !this.state.accordeonGrupos[i]) : false;
    });
  }

  public toggleCollapseContratos(index: number): void {
    this.state.accordeonContratos.forEach((item, i) => {
      this.state.item = item;
      this.state.accordeonContratos[i] =
        index === i
          ? (this.state.accordeonContratos[i] = !this.state.accordeonContratos[i])
          : false;
    });
  }

  public updateSimulacion() {
    this.state.switch.value = false;
    this.removeOptionalFields();
    const modo = this.form.get('updateSimulacionControl').value;
    if (this.grupoId) {
      const grupoId = this.grupoId;
      const certificadoId = this.form.get('valorCertificadoControl').value;
      const contratosId = this.contratoActual.listaContratos.map(contrato => contrato.contratoID);
      const simuladorRequest = {
        modo,
        grupoId,
        certificadoId,
        contratosId
      };
      this.getSimulador(simuladorRequest);
    }
    this.disableForm = false;
  }

  public valorCertificadoChange() {
    this.closeAlert();
  }

  private actualizarProductos(codigoTipoBien: number): void {
    this.deshabilitarSwitch = false;
    if (this.contratoActual && this.contratoActual.listaContratos) {
      const contratos = this.contratoActual.listaContratos.map(contrato => contrato.contratoID);
      this.isTipoVehiculoSelected(codigoTipoBien);
      if (contratos && codigoTipoBien) {
        this.getProductosPorContratosYTipoDeBien({ contratos, codigoTipoBien });
        this.form.get('programaProductosControl').setValue(0);
        this.llenarAdicionalesProductos(0);
        this.form.get('grupoControl').setValue(undefined);
      }
    }
  }

  canDeactivate() {
    if (confirm('Are you sure!')) {
      return true;
    } else {
      return false;
    }
  }

  private getAsambleasAdjudicadas(grupoId: number): void {
    this.adjudicadosDetalle = [];
    this.detalleService.getAsambleasAdjudicadas(grupoId).subscribe(
      adjudicadosDetalle => {
        this.loadingAdjudicadosDetalle = false;
        this.adjudicadosDetalle = adjudicadosDetalle;
      },
      (error: APIError) => {
        this.failedAdjudicadosDetalle = error.mensaje;
        this.loadingAdjudicadosDetalle = false;
      }
    );
  }

  private getCertificados(grupoId: number): void {
    this.certificados = [];
    this.detalleService.getCertificados(grupoId).subscribe(
      certificados => {
        this.loadingCertificados = false;
        this.certificados = certificados;
      },
      (error: APIError) => {
        this.failedCertificados = error.mensaje;
        this.loadingCertificados = false;
      }
    );
  }

  private getContratoResueltoInfoSimulacion(
    listaContratosResueltos: ListaContratosResueltos[] = null
  ) {
    this.contratoActual = null;
    this.loading = false;
    this.detalleService
      .getContratoResueltoInfoSimulacion(this.bandejaService.contratoActual.reactivacionContratoID)
      .subscribe(
        contrato => {
          this.contratoActual = contrato;
          if (listaContratosResueltos && listaContratosResueltos.length > 0) {
            this.contratoActual.listaContratos = listaContratosResueltos;
            this.generateAccordeonState(listaContratosResueltos);
            this.contratoID = listaContratosResueltos[0].contratoID;
            this.isTipoVehiculo =
              listaContratosResueltos[0].tipoBien.toUpperCase() ===
              AsociadoDetalleEnum.Vehiculo.toUpperCase();
            this.cargarSimulacionListas();
          } else {
            this.generateAccordeonState(contrato.listaContratos);
            this.form.get('tipoDeBienControl').setValue(contrato.listaContratos[0].tipoBienId);
            this.contratoID = contrato.listaContratos[0].contratoID;
            this.isTipoVehiculo =
              contrato.listaContratos[0].tipoBien.toUpperCase() ===
              AsociadoDetalleEnum.Vehiculo.toUpperCase();
            this.loadingSimulation = false;
          }
          this.llenarProductos(contrato.listaContratos[0].tipoBienId);
        },
        () => {}
      );
  }

  private getInversionInmobiliaria(tipoDeBien: number): void {
    this.inversionInmobiliaria = [];
    this.detalleService.getInversionInmobiliaria(tipoDeBien).subscribe(
      inversionInmobiliaria => {
        this.loadingInversionInmobiliaria = false;
        this.inversionInmobiliaria = inversionInmobiliaria;
      },
      (error: APIError) => {
        this.failedInversionInmobiliaria = error.mensaje;
        this.loadingInversionInmobiliaria = false;
      }
    );
  }

  private getListaDeGrupos(listaDeGruposRequest: ListaDeGruposRequest): void {
    this.scrollerHeight = 0;
    this.listaDeGrupos = [];
    this.loadingListadoDeGrupos = true;
    this.detalleService.getListaDeGrupos(listaDeGruposRequest).subscribe(
      listaDeGrupos => {
        this.loadingListadoDeGrupos = false;
        this.listaDeGrupos = listaDeGrupos;
        if (listaDeGrupos) {
          this.generateRadiobuttonsState(this.listaDeGrupos);
          this.generateAccordeonGruposState(listaDeGrupos);
        }
      },
      (error: APIError) => {
        this.failedListadoDeGrupos = error.mensaje;
        this.loadingListadoDeGrupos = false;
      }
    );
  }

  private getMarcasByProductoId(productoId: number): void {
    this.marcas = [];
    this.loadingMarcas = true;
    this.detalleService.getMarcasByProductoId(productoId).subscribe(
      marcas => {
        this.loadingMarcas = false;
        this.marcas = marcas;
      },
      (error: APIError) => {
        this.failedMarcas = error.mensaje;
        this.loadingMarcas = false;
      }
    );
  }

  private getMetodos(): void {
    this.metodos = [];
    this.loadingMetodos = true;
    this.detalleService.getMetodos(this.grupoId).subscribe(
      metodos => {
        this.loadingMetodos = false;
        this.metodos = metodos;
        const modo = metodos[0].codigo;
        this.metodoCodigo = modo;
        this.form.get('updateSimulacionControl').setValue(modo);
        this.habilitarGuardado = metodos[0].habilitarGuardado;
        if (this.grupoId) {
          const grupoId = this.grupoId;
          const certificadoId = this.form.get('valorCertificadoControl').value;
          const contratosId = this.contratoActual.listaContratos.map(
            contrato => contrato.contratoID
          );
          const simuladorRequest = {
            modo,
            grupoId,
            certificadoId,
            contratosId
          };
          this.getSimulador(simuladorRequest);
        }
      },
      (error: APIError) => {
        this.failedMetodos = error.mensaje;
        this.loadingMetodos = false;
      }
    );
  }

  private getModelosByMarcaId(marcaId: number): void {
    this.modelos = [];
    this.loadingModelos = true;
    this.detalleService.getModelosByMarcaId(marcaId).subscribe(
      modelos => {
        this.loadingModelos = false;
        this.modelos = modelos;
      },
      (error: APIError) => {
        this.failedModelos = error.mensaje;
        this.loadingModelos = false;
      }
    );
  }

  private getProductosPorContratosYTipoDeBien(contratosTipoDeBien: ContratosYTipoDeBien): void {
    this.contratosYProductos = [];
    this.loadingProgramaProductos = true;
    this.detalleService.getProductosPorContratosYTipoDeBien(contratosTipoDeBien).subscribe(
      programaProductos => {
        this.loadingProgramaProductos = false;
        this.contratosYProductos = programaProductos;
      },
      (error: APIError) => {
        this.failedProgramaProductos = error.mensaje;
        this.loadingProgramaProductos = false;
      }
    );
  }

  public errorsCia() {
    if (this.simulador) {
      this.simulador.simulaciones[0].detalle.cias.map((cias, index) => {
        // pasar con bigjs
        if (
          Number(cias.saldo) >= Number(cias.saldoMinimo) &&
          Number(cias.saldo) <= Number(cias.saldoMaximo)
        ) {
          this.formErrors['cia' + index] = '';
        } else {
          this.formErrors['cia' + index] =
            Number(cias.saldo) > Number(cias.saldoMaximo)
              ? this.validationMessages['cia' + index].max
              : this.validationMessages['cia' + index].min;
        }
      });
    }
  }

  public errorsDiferenciaCia() {
    if (this.simulador) {
      if (
        Number(this.simulador.simulaciones[0].detalle.diferenciaCiaValor) >=
          Number(this.simulador.simulaciones[0].detalle.diferenciaCiaMinima) &&
        Number(this.simulador.simulaciones[0].detalle.diferenciaCiaValor) <=
          Number(this.simulador.simulaciones[0].detalle.diferenciaCiaMaxima)
      ) {
        this.formErrors.diferenciaCiaControl = '';
      } else {
        this.formErrors.diferenciaCiaControl =
          Number(this.simulador.simulaciones[0].detalle.diferenciaCiaValor) >
          Number(this.simulador.simulaciones[0].detalle.diferenciaCiaMaxima)
            ? this.validationMessages.diferenciaCiaControl.max
            : this.validationMessages.diferenciaCiaControl.min;
      }
      this.validateAllFormFields(this.form);
    }
  }

  private validateBetween(min, max, value) {
    if (min && max && value) {
      return (
        value &&
        String(value).trim() !== '' &&
        Number(min) <= Number(value) &&
        Number(value) <= Number(max)
      );
    }
  }

  private getSimulador(simuladorRequest: SimuladorRequest): void {
    this.simulador = null;
    this.loadingSimulador = true;
    this.inBetween = [];
    this.detalleService.getSimulation(simuladorRequest).subscribe(
      simulador => {
        this.simulador = simulador;
        if (simulador.simulaciones[0].detalle.diferenciaCiaMaxima > 0) {
          this.inBetween.push({
            id: 'diferenciaCiaControl',
            value: this.formatValue(String(simulador.simulaciones[0].detalle.diferenciaCiaValor)),
            min: simulador.simulaciones[0].detalle.diferenciaCiaMinima,
            max: simulador.simulaciones[0].detalle.diferenciaCiaMaxima,
            between: this.validateBetween(
              simulador.simulaciones[0].detalle.diferenciaCiaMinima,
              simulador.simulaciones[0].detalle.diferenciaCiaMaxima,
              simulador.simulaciones[0].detalle.diferenciaCiaValor
            )
          });
        }
        simulador.simulaciones[0].detalle.cias.map((ciaItem, index) => {
          if (ciaItem.saldoMaximo > 0) {
            this.inBetween.push({
              id: 'cia' + index,
              value: this.formatValue(String(ciaItem.saldo)),
              min: ciaItem.saldoMinimo,
              max: ciaItem.saldoMaximo,
              between: this.validateBetween(ciaItem.saldoMinimo, ciaItem.saldoMaximo, ciaItem.saldo)
            });
          }
        });
        this.mostrarSimulacion = true;
        this.loadingSimulador = false;
        simulador.simulaciones.map(simulacion => {
          if (simulacion.detalle.diferenciaCiaMaxima > 0) {
            this.diferenciaCiaControl.enable();
            this.diferenciaCiaControl.setValidators([
              Validators.required,
              Validators.min(simulacion.detalle.diferenciaCiaMinima),
              Validators.max(simulacion.detalle.diferenciaCiaMaxima)
            ]);
          }
          simulacion.detalle.cias.map((cia, index) => {
            if (cia.saldoMaximo > 0) {
              this.formErrors['cia' + index] = '';
              this.validationMessages['cia' + index] = {
                max: 'Ingrese un monto menor a: ' + cia.saldoMaximo,
                min: 'Ingrese un monto mayor a: ' + cia.saldoMinimo,
                required: 'Este campo es obligatorio'
              };
              this.form.addControl(
                'cia' + index,
                new FormControl(cia.saldo, [
                  Validators.required,
                  Validators.min(cia.saldoMinimo),
                  Validators.max(cia.saldoMaximo)
                ])
              );
              this.form.updateValueAndValidity();
              this.errorsCia();
              this.errorsDiferenciaCia();
            }
          });
        });
        this.showtotal = true;
        this.disableForm = false;
        setTimeout(() => {
          this.checkInBeetween();
        }, 50);
      },
      (error: APIError) => {
        if (error.status === 500 || error.codigo.toUpperCase() === 'GINNI-075') {
          this.disableForm = false;
          this.generateOverflow = true;
          this.loadingSimulador = false;
        } else {
          this.disableForm = false;
          this.mostrarSimulacion = true;
          this.guardarSimulacionAlertType = NotificationTypeEnum.Danger;
          this.guardarSimulacionMensaje = true;
          this.guardarSimulacionAlertMessage = error.mensaje;
          this.failedSimulador = error.mensaje;
          this.loadingSimulador = false;
        }
      }
    );
  }

  private noErrors = (): boolean =>
    Object.values(this.formErrors).find(value => value !== '') === undefined;

  private getTipoDeBien() {
    this.loadingTiposDeBien = true;
    this.tiposDeBien = [];
    this.detalleService.getTiposDeBien().subscribe(
      tiposDeBien => {
        this.loadingTiposDeBien = false;
        this.tiposDeBien = tiposDeBien;
      },
      (error: APIError) => {
        this.failedTiposDeBien = error.mensaje;
        this.loadingTiposDeBien = false;
      }
    );
  }

  private cargarSimulacion() {
    this.detalleService
      .cargarSimulacion(this.bandejaService.contratoActual.reactivacionContratoID)
      .subscribe(
        simulacion => {
          this.metodos = simulacion.metodos.lista;
          this.form.get('updateSimulacionControl').setValue(simulacion.metodos.listaIdSelected);
          this.habilitarGuardado = simulacion.metodos.lista.find(
            x => x.codigo === simulacion.metodos.listaIdSelected
          ).habilitarGuardado;
          this.simulador = simulacion.simulacionResponse;
          this.mostrarSimulacion = true;
          this.loadingSimulador = false;
          if (simulacion.simulacionResponse.simulaciones[0].detalle.diferenciaCiaMaxima > 0) {
            this.inBetween.push({
              id: 'diferenciaCiaControl',
              value: this.formatValue(
                String(simulacion.simulacionResponse.simulaciones[0].detalle.diferenciaCiaValor)
              ),
              min: simulacion.simulacionResponse.simulaciones[0].detalle.diferenciaCiaMinima,
              max: simulacion.simulacionResponse.simulaciones[0].detalle.diferenciaCiaMaxima,
              between: this.validateBetween(
                simulacion.simulacionResponse.simulaciones[0].detalle.diferenciaCiaMinima,
                simulacion.simulacionResponse.simulaciones[0].detalle.diferenciaCiaMaxima,
                simulacion.simulacionResponse.simulaciones[0].detalle.diferenciaCiaValor
              )
            });
          }
          simulacion.simulacionResponse.simulaciones[0].detalle.cias.map((ciaItem, index) => {
            if (ciaItem.saldoMaximo > 0) {
              this.inBetween.push({
                id: 'cia' + index,
                value: this.formatValue(String(ciaItem.saldo)),
                min: ciaItem.saldoMinimo,
                max: ciaItem.saldoMaximo,
                between: this.validateBetween(
                  ciaItem.saldoMinimo,
                  ciaItem.saldoMaximo,
                  ciaItem.saldo
                )
              });
            }
          });
          simulacion.simulacionResponse.simulaciones.map(simulacionItem => {
            if (simulacionItem.detalle.diferenciaCiaMaxima > 0) {
              this.diferenciaCiaControl.enable();
              this.diferenciaCiaControl.setValidators([
                Validators.required,
                Validators.min(simulacionItem.detalle.diferenciaCiaMinima),
                Validators.max(simulacionItem.detalle.diferenciaCiaMaxima)
              ]);
            }
            simulacionItem.detalle.cias.map((cia, index) => {
              if (cia.saldoMaximo > 0) {
                this.formErrors['cia' + index] = '';
                this.validationMessages['cia' + index] = {
                  max: 'Ingrese un monto menor a: ' + cia.saldoMaximo,
                  min: 'Ingrese un monto mayor a: ' + cia.saldoMinimo,
                  required: 'Este campo es obligatorio'
                };
                this.form.addControl(
                  'cia' + index,
                  new FormControl(cia.saldo, [
                    Validators.required,
                    Validators.min(cia.saldoMinimo),
                    Validators.max(cia.saldoMaximo)
                  ])
                );
                this.form.updateValueAndValidity();
                this.errorsCia();
                this.errorsDiferenciaCia();
              }
            });
          });
          this.showtotal = true;
          this.disableForm = false;
          this.loadingSimulation = false;
          setTimeout(() => {
            this.checkInBeetween();
          }, 50);
        },
        () => {}
      );
  }

  private cargarSimulacionAlmacenada() {
    this.detalleService
      .consultarValidacion(this.bandejaService.contratoActual.reactivacionContratoID)
      .subscribe(
        validacion => {
          if (!validacion.existeSimulacion) {
            this.getTipoDeBien();
            this.buildForm('');
            this.getContratoResueltoInfoSimulacion();
          } else {
            this.buildForm('');
            if (validacion.existeValidacion) {
              this.simulacionCaducada = true;
              this.getTipoDeBien();
              this.getContratoResueltoInfoSimulacion();
            } else {
              this.cargarSimulacionGrupos();
            }
          }
        },
        () => {
          this.buildForm('');
          this.getContratoResueltoInfoSimulacion();
          this.loadingSimulation = false;
        }
      );
  }

  private generarObligacionACuenta(payload: GuardarSimulacionRequest) {
    this.loadingGenerarObligacionACuenta = true;
    this.detalleService.generarObligacionACuenta(payload).subscribe(
      res => {
        this.loadingGenerarObligacionACuenta = false;
        this.loadingModal = false;
        setTimeout(() => {
          if (res) {
            this.nuevoNumeroDeContrato = res.numeroContrato;
            this.payment = true;
            this.closeAlert();
          }
        }, 300);
      },
      (error: APIError) => {
        this.loadingModal = false;
        if (error.status === 422) {
          setTimeout(() => {
            this.loadingGenerarObligacionACuenta = false;
            this.guardarSimulacionAlertType = NotificationTypeEnum.Danger;
            this.guardarSimulacionMensaje = true;
            this.guardarSimulacionAlertMessage = error.mensaje;
          }, 300);
        } else if (error.status === 500) {
          setTimeout(() => {
            this.loadingGenerarObligacionACuenta = false;
            this.generateError = true;
          }, 300);
        }
      }
    );
  }

  private cargarSimulacionGrupos() {
    this.loading = true;
    this.detalleService
      .cargarSimulacionGrupos(this.bandejaService.contratoActual.reactivacionContratoID)
      .subscribe(
        contratoActual => {
          this.contratoActual = {
            listaContratos: contratoActual.listaContratos,
            listaTipoBien: null,
            maximoAfusionar: null
          };
          this.contratoActual.listaContratos = contratoActual.listaContratos;
          this.generateAccordeonState(contratoActual.listaContratos);
          this.contratoID = contratoActual.listaContratos[0].contratoID;
          this.submitted = true;
          this.cargarSimulacionListas();
        },
        (error: APIError) => {
          this.loading = false;
          this.failed = error.mensaje;
        }
      );
  }

  private cargarSimulacionListas() {
    this.detalleService
      .cargarSimulacionListas(this.bandejaService.contratoActual.reactivacionContratoID)
      .subscribe(
        listas => {
          this.tiposDeBien = listas.tipobien.lista;
          this.isTipoVehiculo =
            listas.tipobien.lista
              .find(tipoBien => tipoBien.listaId === listas.tipobien.listaIdSelected)
              .nombre.toUpperCase() === AsociadoDetalleEnum.Vehiculo.toUpperCase();
          this.contratosYProductos = listas.producto.lista;
          this.grupoId = listas.grupo.grupoId;
          if (this.isTipoVehiculo) {
            if (listas.marca && listas.marca.lista) {
              this.marcas = listas.marca.lista;
            }
            if (listas.modelo && listas.modelo.lista) {
              this.modelos = listas.modelo.lista;
            }
          } else {
            if (listas.inversionInmobiliaria && listas.inversionInmobiliaria.lista) {
              this.inversionInmobiliaria = listas.inversionInmobiliaria.lista;
            }
          }
          this.getAsambleasAdjudicadas(listas.grupo.grupoId);
          setTimeout(() => {
            this.form.get('tipoDeBienControl').setValue(listas.tipobien.listaIdSelected);
            this.form.get('programaProductosControl').setValue(listas.producto.listaIdSelected);
            this.form.get('grupoControl').setValue(listas.grupo.numeroGrupo);
            this.form.get('valorCertificadoControl').setValue(listas.certificado.listaIdSelected);
            if (this.isTipoVehiculo) {
              if (listas.marca && listas.marca.listaIdSelected) {
                this.form.get('marcaControl').setValue(listas.marca.listaIdSelected);
              }
              if (listas.modelo && listas.modelo.listaIdSelected) {
                this.form.get('modeloControl').setValue(listas.modelo.listaIdSelected);
              }
            } else {
              if (listas.inversionInmobiliaria && listas.inversionInmobiliaria.listaIdSelected) {
                this.form
                  .get('inversionInmobiliariaControl')
                  .setValue(listas.inversionInmobiliaria.listaIdSelected);
              }
            }
            this.form.get('numeroDeFormatoControl').setValue(listas.numeroFormato);
            this.certificados = listas.certificado.lista;
            this.porcentajeCuotaAdmin = listas.grupo.porcentajeCuotaAdmin;
            this.numeroProximaAsamblea = listas.grupo.proximaAsamblea;
            this.diaPago = listas.grupo.diaPago;
            this.vacantes = listas.grupo.vacantes;
            this.fechaProximaAsamblea = listas.grupo.fechaProximaAsamblea;
            this.movimientoTipo = listas.grupo.movimientoTipo;
            this.numeroMeses = listas.grupo.numeroMeses;
            this.loadingSimulador = true;
            this.cargarSimulacion();
          }, 1000);
        },
        () => {}
      );
  }

  private isTipoVehiculoSelected(codigoTipoBien: number): void {
    const tipoBien = this.tiposDeBien.find(
      tipoDeBien => tipoDeBien.listaId === Number(codigoTipoBien)
    );
    this.isTipoVehiculo = tipoBien
      ? tipoBien.nombre.toUpperCase() === AsociadoDetalleEnum.Vehiculo.toUpperCase()
      : null;
  }

  private llenarAdicionalesProductos(productoId: number | string): void {
    this.marcas = [];
    if (Number(productoId) !== 0) {
      this.getMarcasByProductoId(Number(productoId));
    }
    if (this.isTipoVehiculo) {
      this.form.get('marcaControl').setValue(0);
    }
    this.listaDeGrupos = [];
    this.form.get('grupoControl').setValue(undefined);
    this.certificados = [];
    this.form.get('valorCertificadoControl').setValue(0);
    if (!this.isTipoVehiculo) {
      this.form.get('inversionInmobiliariaControl').setValue(0);
    }
    this.form.get('numeroDeFormatoControl').setValue('');
    this.modelos = [];
    if (this.isTipoVehiculo) {
      this.form.get('modeloControl').setValue(0);
    }
    this.cleanGrupoAttr();
    this.clearSimulation();
  }

  private llenarProductos(tipoDeBienId: number): void {
    this.deshabilitarSwitch = false;
    this.actualizarProductos(tipoDeBienId);
    this.removeOptionalFields();
    this.cleanGrupoAttr();
    this.adjudicadosDetalle = null;
    this.closeAlert();
    if (!this.isTipoVehiculo) {
      if (this.habilitarGuardado || !this.deshabilitarSwitch) {
        this.form.get('inversionInmobiliariaControl').setValidators([Validators.min(1)]);
        this.form.get('inversionInmobiliariaControl').updateValueAndValidity();
      }
      this.getInversionInmobiliaria(tipoDeBienId);
      this.form.get('inversionInmobiliariaControl').setValue(0);
    } else {
      this.form.get('inversionInmobiliariaControl').clearValidators();
      this.form.get('inversionInmobiliariaControl').updateValueAndValidity();
    }
    this.certificados = [];
    this.form.get('valorCertificadoControl').setValue(0);
    this.marcas = [];
    this.modelos = [];
    if (this.isTipoVehiculo) {
      if (this.habilitarGuardado || !this.deshabilitarSwitch) {
        this.form.get('marcaControl').setValidators([Validators.min(1)]);
        this.form.get('marcaControl').updateValueAndValidity();

        this.form.get('modeloControl').setValidators([Validators.min(1)]);
        this.form.get('modeloControl').updateValueAndValidity();
      }

      this.form.get('marcaControl').setValue(0);
      this.form.get('modeloControl').setValue(0);
    } else {
      this.form.get('marcaControl').clearValidators();
      this.form.get('modeloControl').clearValidators();
      this.form.get('marcaControl').updateValueAndValidity();
      this.form.get('modeloControl').updateValueAndValidity();
    }
    this.contratosYProductos = [];
    this.form.get('programaProductosControl').setValue(0);
    this.form.get('grupoControl').setValue('');
    this.form.get('numeroDeFormatoControl').setValue('');
    this.clearSimulation();
    this.adjudicadosDetalle = null;
  }

  private llenarCertificados(grupoId: string): void {
    this.certificados = [];
    const grupo = this.listaDeGrupos.filter(grupoActual => grupoActual.numeroGrupo === grupoId);
    if (grupo && grupo[0] && grupo[0].grupoId) {
      this.grupoId = grupo[0].grupoId;
      this.getCertificados(grupo[0].grupoId);
      this.form.get('numeroDeFormatoControl').setValue('');
      this.form.get('valorCertificadoControl').setValue(0);
      if (!this.isTipoVehiculo) {
        this.form.get('inversionInmobiliariaControl').setValue(0);
      }
      if (this.isTipoVehiculo) {
        this.form.get('marcaControl').setValue(0);
        this.form.get('modeloControl').setValue(0);
      }
    }
    this.clearSimulation();
  }

  private updateGuardarSimulacionState() {
    if (
      this.simulador &&
      this.simulador.simulaciones &&
      this.simulador.simulaciones[0] &&
      this.simulador.simulaciones[0].detalle &&
      this.simulador.simulaciones[0].detalle.cias
    ) {
      this.deshabilitarGuardado = !(
        this.noErrors() &&
        this.validateBetween(
          this.simulador.simulaciones[0].detalle.diferenciaCiaMinima,
          this.simulador.simulaciones[0].detalle.diferenciaCiaMaxima,
          this.simulador.simulaciones[0].detalle.diferenciaCiaValor
        ) &&
        !this.simulador.simulaciones[0].detalle.cias.find(
          ciaItem => !this.validateBetween(ciaItem.saldoMinimo, ciaItem.saldoMaximo, ciaItem.saldo)
        )
      );
    }
  }

  public llenarMarcas(value: number): void {
    this.deshabilitarSwitch = false;
    this.adjudicadosDetalle = null;
    this.removeOptionalFields();
    if (this.isTipoVehiculo && Number(value)) {
      this.getMarcasByProductoId(value);
    }
    this.valorCertificadoControl.setValue(0);
    this.llenarCertificados('0');
    this.cleanGrupoAttr();
    this.closeAlert();
    this.modelos = [];
    this.marcas = [];
    if (Number(value) === 0) {
      this.inversionInmobiliariaControl.setValue(0);
    }
    this.marcaControl.setValue(0);
    this.modeloControl.setValue(0);
    this.form.get('grupoControl').setValue('');
    this.form.get('numeroDeFormatoControl').setValue('');
    this.adjudicadosDetalle = null;
  }

  public llenarModelos(marcaId: number): void {
    this.deshabilitarSwitch = false;
    this.state.switch.value = false;
    this.modelos = [];
    this.removeOptionalFields();
    this.closeAlert();
    this.updateGuardarSimulacionState();
    if (Number(marcaId)) {
      this.getModelosByMarcaId(marcaId);
    }
    this.modeloControl.setValue(0);
  }

  public deshabilitarSwitchModelo() {
    this.state.switch.value = false;
    this.removeOptionalFields();
    this.closeAlert();
    this.updateGuardarSimulacionState();
  }

  public formatValue(value: string) {
    if (value) {
      const regexp = new RegExp(/^([\d]{0,5})(\.[\d]{1,2})?$/);
      if (!regexp.test(value)) {
        const splitValue = value.split('.');
        if (typeof splitValue[0] === 'string') {
          if (typeof splitValue[1] === 'string') {
            return splitValue[0].substr(0, 5) + '.' + splitValue[1].substr(0, 2);
          } else {
            return splitValue[0].substr(0, 5) + '.00';
          }
        } else {
          if (typeof splitValue[1] === 'string') {
            return '0.' + splitValue[1].substr(0, 2);
          } else {
            return '';
          }
        }
      } else {
        return value;
      }
    } else {
      return '';
    }
  }

  public formIsDisabled() {
    return this.disableForm;
  }

  public iniciarDiferenciaCiaSubject(): void {
    this.diferenciaCiaSubject.debounceTime(1000).subscribe(value => {
      this.deshabilitarSwitch = true;
      if (!this.form.valid) {
        this.deshabilitarSwitch = true;
        this.deshabilitarGuardado = true;
        return;
      }
      if (value !== '') {
        if (
          !(
            this.simulador.simulaciones[0].detalle.diferenciaCiaMinima <= Number(value) &&
            this.simulador.simulaciones[0].detalle.diferenciaCiaMaxima >= Number(value)
          )
        ) {
          this.deshabilitarSwitch = true;
          this.deshabilitarGuardado = true;
          return;
        }
        this.fechaUltimaSimulacion = null;
        if (this.simulador) {
          this.inBetween = [];
          this.disableForm = true;
          this.deshabilitarSwitch = true;
          const certificadoId = this.form.get('valorCertificadoControl').value;
          const contratosId = this.contratoActual.listaContratos.map(
            contrato => contrato.contratoID
          );
          const modo = this.form.get('updateSimulacionControl').value;
          const payload = {
            certificadoId,
            contratosId,
            grupoId: this.grupoId,
            modo,
            cuotaCelebracion: this.simulador.cuotasCelebracion.valor,
            cuotaAdjudicacion: this.simulador.cuotasAdjudicacion.valor,
            diferenciaCiaValor: Number(this.simulador.simulaciones[0].detalle.diferenciaCiaValor),
            cias: this.simulador.simulaciones[0].detalle.cias.map(ciaItem => ({
              contratoId: ciaItem.contratoId,
              saldo: Number(ciaItem.saldo)
            }))
          };
          if (
            this.noErrors() &&
            this.validateBetween(
              this.simulador.simulaciones[0].detalle.diferenciaCiaMinima,
              this.simulador.simulaciones[0].detalle.diferenciaCiaMaxima,
              this.simulador.simulaciones[0].detalle.diferenciaCiaValor
            ) &&
            !this.simulador.simulaciones[0].detalle.cias.find(
              ciaItem =>
                !this.validateBetween(ciaItem.saldoMinimo, ciaItem.saldoMaximo, ciaItem.saldo)
            )
          ) {
            this.showtotal = false;
            this.detalleService.putSimulation(payload).subscribe(
              simulation => {
                this.simulador = simulation;
                this.deshabilitarGuardado = false;
                if (simulation.simulaciones[0].detalle.diferenciaCiaMaxima > 0) {
                  this.inBetween.push({
                    id: 'diferenciaCiaControl',
                    value: this.formatValue(
                      String(simulation.simulaciones[0].detalle.diferenciaCiaValor)
                    ),
                    min: simulation.simulaciones[0].detalle.diferenciaCiaMinima,
                    max: simulation.simulaciones[0].detalle.diferenciaCiaMaxima,
                    between: this.validateBetween(
                      simulation.simulaciones[0].detalle.diferenciaCiaMinima,
                      simulation.simulaciones[0].detalle.diferenciaCiaMaxima,
                      simulation.simulaciones[0].detalle.diferenciaCiaValor
                    )
                  });
                }
                simulation.simulaciones[0].detalle.cias.map((ciaItem, index) => {
                  if (ciaItem.saldoMaximo > 0) {
                    this.inBetween.push({
                      id: 'cia' + index,
                      value: this.formatValue(String(ciaItem.saldo)),
                      min: ciaItem.saldoMinimo,
                      max: ciaItem.saldoMaximo,
                      between: this.validateBetween(
                        ciaItem.saldoMinimo,
                        ciaItem.saldoMaximo,
                        ciaItem.saldo
                      )
                    });
                  }
                });
                this.disableForm = false;
                this.showtotal = true;
                this.deshabilitarSwitch = false;
                this.deshabilitarGuardado = false;
                this.checkInBeetween();
              },
              () => {
                this.deshabilitarGuardado = false;
              }
            );
          } else {
            this.deshabilitarSwitch = true;
            this.deshabilitarGuardado = true;
            this.disableForm = false;
          }
        }
      } else {
        this.deshabilitarSwitch = true;
        this.deshabilitarGuardado = true;
      }
    });
  }

  public inversionInmobiliariaChange() {
    this.deshabilitarSwitch = false;
    this.state.switch.value = false;
    this.removeOptionalFields();
    this.closeAlert();
    this.updateGuardarSimulacionState();
  }

  public diferenciaCiaOnKeyUp(textValue: string): void {
    this.form.get('diferenciaCiaControl').setValue(this.formatValue(textValue));
    this.simulador.simulaciones[0].detalle.diferenciaCiaValor = this.formatValue(textValue);
    this.deshabilitarGuardado = true;
    this.state.switch.value = false;
    this.removeOptionalFields();
    this.closeAlert();
    this.isInBetween({
      id: 'diferenciaCiaControl',
      between:
        textValue &&
        String(textValue).trim() !== '' &&
        Number(this.simulador.simulaciones[0].detalle.diferenciaCiaMinima) <= Number(textValue) &&
        Number(textValue) <= Number(this.simulador.simulaciones[0].detalle.diferenciaCiaMaxima),
      max: this.simulador.simulaciones[0].detalle.diferenciaCiaMaxima,
      min: this.simulador.simulaciones[0].detalle.diferenciaCiaMinima,
      value: this.formatValue(textValue)
    });
    this.diferenciaCiaSubject.next(this.formatValue(textValue));
    this.fillErrorsAmount();
  }

  public cambiarEstadoBotonGuardado(textValue: string): void {
    const metodoActual = this.metodos.find(metodo => metodo.codigo === Number(textValue));
    this.habilitarGuardado = metodoActual.habilitarGuardado;
    this.disableForm = true;
    this.updateSimulacion();
    this.closeAlert();
  }

  public iniciarCiaSubject(): void {
    this.ciaSubject.debounceTime(1000).subscribe(cia => {
      this.deshabilitarSwitch = true;
      if (!this.form.valid) {
        this.deshabilitarSwitch = true;
        this.deshabilitarGuardado = true;
        return;
      }
      if (cia.value !== '') {
        if (
          !(
            this.simulador.simulaciones[0].detalle.cias[cia.index].saldoMinimo <=
              Number(cia.value) &&
            this.simulador.simulaciones[0].detalle.cias[cia.index].saldoMaximo >= Number(cia.value)
          )
        ) {
          this.deshabilitarSwitch = true;
          this.deshabilitarGuardado = true;
          return;
        }
        this.fechaUltimaSimulacion = null;
        if (this.simulador) {
          this.inBetween = [];
          this.disableForm = true;
          this.deshabilitarSwitch = true;
          const certificadoId = this.form.get('valorCertificadoControl').value;
          const contratosId = this.contratoActual.listaContratos.map(
            contrato => contrato.contratoID
          );
          const modo = this.form.get('updateSimulacionControl').value;
          const payload = {
            certificadoId,
            contratosId,
            grupoId: this.grupoId,
            modo,
            cuotaCelebracion: this.simulador.cuotasCelebracion.valor,
            cuotaAdjudicacion: this.simulador.cuotasAdjudicacion.valor,
            diferenciaCiaValor: Number(this.simulador.simulaciones[0].detalle.diferenciaCiaValor),
            cias: this.simulador.simulaciones[0].detalle.cias.map(ciaItem => ({
              contratoId: ciaItem.contratoId,
              saldo: Number(ciaItem.saldo)
            }))
          };
          if (
            this.noErrors() &&
            this.validateBetween(
              this.simulador.simulaciones[0].detalle.diferenciaCiaMinima,
              this.simulador.simulaciones[0].detalle.diferenciaCiaMaxima,
              this.simulador.simulaciones[0].detalle.diferenciaCiaValor
            ) &&
            !this.simulador.simulaciones[0].detalle.cias.find(
              ciaItem =>
                !this.validateBetween(ciaItem.saldoMinimo, ciaItem.saldoMaximo, ciaItem.saldo)
            )
          ) {
            this.showtotal = false;
            this.detalleService.putSimulation(payload).subscribe(
              simulation => {
                this.simulador = simulation;
                this.deshabilitarGuardado = false;
                if (simulation.simulaciones[0].detalle.diferenciaCiaMaxima > 0) {
                  this.inBetween.push({
                    id: 'diferenciaCiaControl',
                    value: this.formatValue(
                      String(simulation.simulaciones[0].detalle.diferenciaCiaValor)
                    ),
                    min: simulation.simulaciones[0].detalle.diferenciaCiaMinima,
                    max: simulation.simulaciones[0].detalle.diferenciaCiaMaxima,
                    between: this.validateBetween(
                      simulation.simulaciones[0].detalle.diferenciaCiaMinima,
                      simulation.simulaciones[0].detalle.diferenciaCiaMaxima,
                      simulation.simulaciones[0].detalle.diferenciaCiaValor
                    )
                  });
                }
                simulation.simulaciones[0].detalle.cias.map((ciaItem, index) => {
                  if (ciaItem.saldoMaximo > 0) {
                    this.inBetween.push({
                      id: 'cia' + index,
                      value: this.formatValue(String(ciaItem.saldo)),
                      min: ciaItem.saldoMinimo,
                      max: ciaItem.saldoMaximo,
                      between: this.validateBetween(
                        ciaItem.saldoMinimo,
                        ciaItem.saldoMaximo,
                        ciaItem.saldo
                      )
                    });
                  }
                });
                this.disableForm = false;
                this.showtotal = true;
                this.deshabilitarSwitch = false;
                this.deshabilitarGuardado = false;
                this.checkInBeetween();
              },
              () => {
                this.deshabilitarGuardado = false;
              }
            );
          } else {
            this.deshabilitarSwitch = true;
            this.deshabilitarGuardado = true;
            this.disableForm = false;
          }
        }
      } else {
        this.deshabilitarSwitch = true;
        this.deshabilitarGuardado = true;
      }
    });
  }

  public ciaOnKeyUp(textValue, index): void {
    const iCia: ICias = {
      index,
      value: this.formatValue(textValue)
    };
    this.form.get('cia' + index).setValue(this.formatValue(textValue));
    this.simulador.simulaciones[0].detalle.cias[index].saldo = this.formatValue(textValue);
    this.deshabilitarGuardado = true;
    this.state.switch.value = false;
    this.removeOptionalFields();
    this.closeAlert();
    this.isInBetween({
      id: 'cia' + index,
      between:
        textValue &&
        String(textValue).trim() !== '' &&
        Number(this.simulador.simulaciones[0].detalle.cias[index].saldoMinimo) <=
          Number(textValue) &&
        Number(textValue) <= Number(this.simulador.simulaciones[0].detalle.cias[index].saldoMaximo),
      max: this.simulador.simulaciones[0].detalle.cias[index].saldoMaximo,
      min: this.simulador.simulaciones[0].detalle.cias[index].saldoMinimo,
      value: this.formatValue(textValue)
    });
    this.ciaSubject.next(iCia);
    this.fillErrorsAmount();
  }

  public numeroOnKeyUp(value): void {
    if (value === '') {
      this.state.switch.value = false;
      this.removeOptionalFields();
      this.closeAlert();
      this.updateGuardarSimulacionState();
    }
  }

  public generate() {
    this.confirmSave = false;
    this.loadingModal = true;
    const bienServicio = this.isTipoVehiculo
      ? this.form.get('modeloControl').value
      : this.form.get('inversionInmobiliariaControl').value;
    const bienServicioID = bienServicio === 0 || bienServicio === '0' ? null : bienServicio;
    const movimientoSimulacionDetalle = this.simulador.simulaciones[0].detalle.cias.map(
      simulador => ({
        contratoId: simulador.contratoId,
        importeCIA: simulador.saldo
      })
    );
    const payload = {
      listaIDTipoBienServicio: this.form.get('tipoDeBienControl').value,
      grupoID: this.grupoId,
      certificadoPosicionID: this.form.get('valorCertificadoControl').value,
      marcaID:
        this.form.get('marcaControl').value === 0 || this.form.get('marcaControl').value === '0'
          ? null
          : this.form.get('marcaControl').value,
      bienServicioID,
      numeroFormato:
        this.form.get('numeroDeFormatoControl').value === ''
          ? null
          : this.form.get('numeroDeFormatoControl').value,
      listaIDSimulacionOpcion: this.form.get('updateSimulacionControl').value,
      contratoId: this.contratoID,
      importeDiferenciaCIA: this.simulador.simulaciones[0].detalle.diferenciaCiaValor,
      movimientoSimulacionDetalle
    };
    this.generarObligacionACuenta(payload);
  }

  public closeConfirmSave() {
    this.confirmSave = false;
  }

  public closePayment() {
    this.payment = false;
    this.router.navigate([`${BandejaEnum.Url}/detalle/pagos`]);
  }

  public closeErrorPayment() {
    this.errorPayment = false;
    this.location.back();
  }

  public saveAndGenerate() {
    this.confirmSave = true;
    this.closeAlert();
  }

  public closeGenerateError() {
    this.generateError = false;
  }

  public closeGenerateOverflow() {
    this.generateOverflow = false;
  }
}
