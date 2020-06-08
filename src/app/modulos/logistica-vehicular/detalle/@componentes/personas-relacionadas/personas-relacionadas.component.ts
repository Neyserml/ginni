import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { ICargoOcupacion } from 'app/modulos/logistica-vehicular/detalle/@models/editar.interface';
import {
  IPersonaRelacionadaItem,
  PersonaRelacionada,
  IPersonaRelacionada
} from 'app/modulos/logistica-vehicular/detalle/@models/persona-relacionada.model';
import * as PersonasRelacionadasAction from 'app/modulos/logistica-vehicular/detalle/@store/personas-relacionadas.action';
import { DetalleApiService } from 'app/modulos/logistica-vehicular/detalle/detalle-api.service';
import {
  getPersonasRelacionadas,
  getPersonasRelacionadasFailed,
  getPersonasRelacionadasLoading
} from 'app/modulos/logistica-vehicular/detalle/@store';
import { getAsociado } from 'app/modulos/logistica-vehicular/detalle/@store/index';
import {
  IGinniSelectLoadEvent,
  IGinniOption
} from 'app/@compartidos/components/select/select.component';
import { IProp, APIError } from 'app/@compartidos/models';
import { ArrayProp } from 'app/@compartidos/models/prop.interface';
import * as store from 'app/@compartidos/store';
import { EMPTY } from 'app/@compartidos/utils/consts';
import {
  isEmpty,
  actualizarUppercaseForm,
  normalizarTildes,
  activarControles,
  desactivarControles
} from 'app/@compartidos/utils/helpers';
import { ValidationService } from 'app/@compartidos/utils/validation.service';
import { Configuracion } from 'app/modulos/portal/@models/configuracion.model';
import { PortalApiService } from 'app/modulos/portal/portal.api.service';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import Big from 'big.js';
import { isNullOrUndefined } from 'util';
import {
  TiposPersona,
  NO_REMUNERADO,
  CONVIVIENTE,
  CONYUGE,
  CASADO,
  PROPIETARIO,
  EIRL,
  CLAVE_CASADO
} from 'app/modulos/logistica-vehicular/detalle/detalle.enum';
import { CARNET_EXTRANJERIA, DNI, SIMBOLO_SOL } from 'app/@compartidos/compartidos.enum';
import { NotificationTypeEnum } from 'app/@compartidos/services/notification-type.enum';
import { IDetalle } from 'app/@compartidos/interfaces/detalle.interface';

@Component({
  selector: 'ginni-personas-relacionadas',
  templateUrl: './personas-relacionadas.component.html',
  styleUrls: ['./personas-relacionadas.component.scss']
})
export class PersonasRelacionadasComponent implements OnInit, OnDestroy {
  @Input() configuracion: Configuracion;
  @Input() public idPersona: string;

  @Input()
  public idEstadoCivilPersona: string;

  @Input()
  public tipoPersona: TiposPersona.NATURAL | TiposPersona.JURIDICO;
  @Input()
  public accesoEditar: boolean;
  @Input()
  public mostrarModal: boolean;

  @Output() agregarIngreso: EventEmitter<IProp> = new EventEmitter<IProp>();

  public scrollFirstInvalid = new Subject();
  public indexPersonaRelacionadaEliminar = null;
  public showModalPersonasRelacionadas = false;

  public personasRelacionadas: IPersonaRelacionadaItem[];

  public cargandoObteniendoPersona = false;
  public guardadoMensaje: string;
  public guardadoType: string;
  public btnBuscarRelacionado = true;
  public btnBorrarDatos = false;
  public seEliminaUnaPersona = false;
  public informacionPersonaRelacionada = false;
  public nombrePersona: string;
  public mensajeLimpiarCampos = false;
  public mostrarLimpiaButton = false;
  public mostrarBusquedaButton = true;
  public modalModificarEvaluacion = false;

  public formModal: FormGroup;
  public formDocumento: FormGroup;
  public formInformacionLaboral: FormGroup;
  public direccionDomicilio;
  public ingresoMensualNeto;
  public enviadoFormulario = false;
  public formDocumentoError = false;

  public agregarRelacionado = false;
  public numeroDocumento;
  public tipoDocumento;
  public listaDocumentosValidos: string[] = [];
  public idPersonaRelacionada: number;
  public idRelacion: number = null;
  public ingresosDolares: number;
  public tipoTrabajador: ArrayProp;
  public esSoloNumeros: boolean;
  public listaTiposRelaciones: IProp[] = [];
  public listaEstadoCivil: IProp[] = [];
  public provincias: IProp[] = [];
  public distritos: IProp[] = [];
  public subscriptions: Subscription[] = [];
  public esTipoJuridico = false;
  public esTipoNatural = false;
  public errorBuscarRelacionado: string;
  public errorBuscarRelacionadoType: string;
  public valueIdTipoRelacion;
  public valorTipoRelacionActual: string;

  // Observadores
  public personasRelacionadas$ = this.appState$.select(getPersonasRelacionadas);
  public personasRelacionadasLoading$ = this.appState$.select(getPersonasRelacionadasLoading);
  public personasRelacionadasFailed$ = this.appState$.select(getPersonasRelacionadasFailed);
  public asociados$ = this.appState$.select(getAsociado);

  constructor(
    private appState$: Store<store.State>,
    public fb: FormBuilder,
    private validations: ValidationService,
    private portalSandbox: PortalSandbox,
    private portalApiService: PortalApiService,
    private asociadoApiService: DetalleApiService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.errorBuscarRelacionadoType = NotificationTypeEnum.Danger;
    this.actualTipoPersona();
    /**
     * se valida undefined al valor que viene en @input idPersona antes de sobreescribir
     */
    if (isNullOrUndefined(this.idPersona)) {
      this.idPersona = this.activatedRoute.snapshot.params['idPersona'];
    }
    this.tipoTrabajador = this.configuracion.tipoTrabajador.filter(
      item => item.valor !== NO_REMUNERADO
    );

    this.mostrarListaDocumentosValidos();
    this.registrarEventos();
    this.documentoFormulario();
    this.actualizarListaRelacionados();
  }

  private actualTipoPersona() {
    if (this.tipoPersona === TiposPersona.NATURAL) {
      this.esTipoNatural = true;
    } else {
      this.esTipoJuridico = true;
    }
  }

  ngOnDestroy() {
    this.desregistrarEventos();
  }

  get paises() {
    return this.portalSandbox.paises;
  }

  get departamentos() {
    return this.portalSandbox.departamentos;
  }

  public actualizarListaRelacionados() {
    if (this.idPersona && this.tipoPersona) {
      const payload = {
        idPersona: this.idPersona,
        tipoPersona: normalizarTildes(this.tipoPersona).toLowerCase()
      };
      this.appState$.dispatch(new PersonasRelacionadasAction.LoadAction(payload));
    }
  }

  public mostrarListaDocumentosValidos() {
    const tiposDocumentos = this.configuracion.tipoDocumento;
    this.listaDocumentosValidos = tiposDocumentos.filter(
      ({ valor }) => valor === DNI || valor === CARNET_EXTRANJERIA
    );
  }

  public registrarEventos() {
    this.subscriptions.push(
      this.asociados$.subscribe((asociados: IDetalle) => {
        this.actualizarNombrePersona(asociados);
      }),
      this.asociadoApiService.asociadoPersonaDatos$.subscribe((asociados: IDetalle) => {
        this.actualizarNombrePersona(asociados);
      }),
      this.personasRelacionadas$.subscribe(personasRelacionadas => {
        if (personasRelacionadas) {
          this.personasRelacionadas = personasRelacionadas;
          this.showModalPersonasRelacionadas = false;
          this.enviadoFormulario = false;

          if (this.seEliminaUnaPersona) {
            this.seEliminaUnaPersona = false;
          } else {
            this.modalModificarEvaluacion = this.mostrarMensaje(this.valueIdTipoRelacion);
          }

          if (personasRelacionadas.length > 0) {
            const valorDocumento = personasRelacionadas[0].tipoDocumento;
            const tiposDocumentos = this.configuracion.tipoDocumento;
            this.listaDocumentosValidos = tiposDocumentos.filter(
              ({ valor }) =>
                valor === DNI || valor === CARNET_EXTRANJERIA || valor === valorDocumento
            );
          }
        }
      }),
      this.personasRelacionadasFailed$.subscribe((error: APIError) => {
        if (error) {
          this.informacionPersonaRelacionada = false;
          this.activarODesactivarFormDocumento(true);
        }
      })
    );
  }

  private actualizarNombrePersona = (asociados: IDetalle) => {
    if (this.tipoPersona === TiposPersona.JURIDICO && asociados) {
      const persona = asociados.personas[0];
      this.nombrePersona = persona.nombrePersona;
    }
  };

  public activarODesactivarFormDocumento = (activar = false) => {
    if (activar) {
      activarControles(this.formDocumento, ['tipoDocumento', 'numeroDocumento']);
    } else {
      desactivarControles(this.formDocumento, ['tipoDocumento', 'numeroDocumento']);
    }
  };

  public modalChange(modalShow) {
    if (!modalShow) {
      this.enviadoFormulario = false;
    }
  }

  public mostrarMensajeAlerta(index) {
    if (this.accesoEditar) {
      if (index >= 0) {
        this.indexPersonaRelacionadaEliminar = index;
      }
    }
  }

  public mostrarMensaje(clave: string) {
    if (this.mostrarModal) {
      const relacionSelected = this.listaTiposRelaciones.filter(
        item => item.clave.toString() === clave.toString()
      );

      if (relacionSelected.length && this.tipoPersona) {
        const relacionSelectedValue = relacionSelected[0].valor;
        return this.validarPorTipoPersonaYRelacion(relacionSelectedValue, this.nombrePersona);
      }
    }
  }

  /**
   * @param nombrePersona nombre del titular
   * @param valorTipoRelacion tipo relacion actual, antes de grabar
   */
  private validarPorTipoPersonaYRelacion = (valorTipoRelacion: string, nombrePersona: string) => {
    // Si se crea persona relacionada (no tiene idRelacion), la relacionDiferente es true por default
    const esRelacionDiferente = this.idRelacion
      ? this.valorTipoRelacionActual.toUpperCase() !== valorTipoRelacion.toUpperCase()
      : true;

    if (this.tipoPersona === TiposPersona.NATURAL) {
      const idEstadoCivilPersonal = this.idEstadoCivilPersona.toString() === CLAVE_CASADO;
      const esConyuge = this.validarActualYNuevaRelacion(CONYUGE, valorTipoRelacion);

      return idEstadoCivilPersonal && esConyuge && esRelacionDiferente;
    } else {
      const tipoRelacionPropietario = this.validarActualYNuevaRelacion(
        PROPIETARIO,
        valorTipoRelacion
      );
      const esEirl = nombrePersona.toUpperCase().includes(EIRL);

      return tipoRelacionPropietario && esEirl && esRelacionDiferente;
    }
  };

  private validarActualYNuevaRelacion(value: string, valorTipoRelacion: string) {
    if (this.valorTipoRelacionActual) {
      const actualRelacion = this.valorTipoRelacionActual.toUpperCase() === value.toUpperCase();
      const nuevaRelacion = valorTipoRelacion.toUpperCase() === value.toUpperCase();
      return actualRelacion || nuevaRelacion;
    } else {
      return valorTipoRelacion.toUpperCase() === value.toUpperCase();
    }
  }

  private mostrarModalPorEstadoCivil(valorTipoRelacion: string, nombrePersona: string) {
    if (this.tipoPersona === TiposPersona.NATURAL) {
      const idEstadoCivilPersonal = this.idEstadoCivilPersona.toString() === CLAVE_CASADO;
      const esConyuge = this.validarActualYNuevaRelacion(CONYUGE, valorTipoRelacion);

      return idEstadoCivilPersonal && esConyuge;
    } else {
      const tipoRelacionPropietario = this.validarActualYNuevaRelacion(
        PROPIETARIO,
        valorTipoRelacion
      );
      const esEirl = nombrePersona.toUpperCase().includes(EIRL);

      return tipoRelacionPropietario && esEirl;
    }
  }

  public filaAEliminar() {
    this.seEliminaUnaPersona = false;
    const idRelacion = this.personasRelacionadas[this.indexPersonaRelacionadaEliminar].idRelacion;
    const tipoRelacion = this.personasRelacionadas[this.indexPersonaRelacionadaEliminar]
      .tipoRelacion;
    this.valorTipoRelacionActual = this.personasRelacionadas[
      this.indexPersonaRelacionadaEliminar
    ].tipoRelacion;

    this.asociadoApiService.eliminarPersonaRelacionada(idRelacion).subscribe(
      () => {
        this.seEliminaUnaPersona = true;
        this.modalModificarEvaluacion = this.mostrarModalPorEstadoCivil(
          tipoRelacion,
          this.nombrePersona
        );

        return this.actualizarListaRelacionados();
      },
      (error: APIError) => {
        this.guardadoMensaje = error.mensaje;
        this.guardadoType = NotificationTypeEnum.Danger;
      }
    );
  }

  public limpiarButton() {
    this.mensajeLimpiarCampos = true;
    this.mostrarLimpiaButton = false;
  }

  public limpiarForm() {
    this.mostrarLimpiaButton = true;
    this.mensajeLimpiarCampos = false;
    this.btnBorrarDatos = false;
    this.btnBuscarRelacionado = true;
    this.mostrarBusquedaButton = false;
    this.reiniciarFormulario();
  }

  private reiniciarFormulario() {
    if (this.formModal) {
      this.formModal.controls['nombres'].setValue(EMPTY);
      this.formModal.controls['apellidoPaterno'].setValue(EMPTY);
      this.formModal.controls['apellidoMaterno'].setValue(EMPTY);
      this.formModal.controls['idTipoRelacion'].setValue(EMPTY);
      this.formModal.controls['idEstadoCivil'].setValue(EMPTY);
      this.formModal.controls['idPaisNacionalidad'].setValue(EMPTY);
      this.formModal.controls['fechaNacimiento'].setValue(EMPTY);
      this.formModal.controls['idSexo'].setValue(EMPTY);
      this.formModal.controls['correo'].setValue(EMPTY);
      this.formModal.controls['celular'].setValue(EMPTY);
      this.formModal.controls['estadoPEP'].setValue(EMPTY);
      this.direccionDomicilio.controls['idDepartamento'].setValue(EMPTY);
      this.direccionDomicilio.controls['idTipoZona'].setValue(EMPTY);
      this.direccionDomicilio.controls['nombreZona'].setValue(EMPTY);
      this.direccionDomicilio.controls['idTipoVia'].setValue(EMPTY);
      this.direccionDomicilio.controls['direccionTexto'].setValue(EMPTY);
      this.direccionDomicilio.controls['referencia'].setValue(EMPTY);
      this.formModal.controls['aportaIngresos'].setValue(EMPTY);

      if (this.formInformacionLaboral && this.esTipoNatural) {
        this.formInformacionLaboral.controls['idTipoTrabajador'].setValue(EMPTY);
        this.formInformacionLaboral.controls['centroTrabajo'].setValue(EMPTY);
        this.formInformacionLaboral.controls['cargoOcupacion'].setValue(EMPTY);
        this.formInformacionLaboral.controls['fechaIngresoTrabajo'].setValue(EMPTY);
        this.formInformacionLaboral.controls['correoLaboral'].setValue(EMPTY);
      }

      if (this.esTipoJuridico) {
        this.formModal.controls['telefonoFijo'].setValue(EMPTY);
        if (this.formInformacionLaboral) {
          this.formInformacionLaboral.controls['cargoOcupacion'].setValue(EMPTY);
          this.formInformacionLaboral.controls['fechaIngresoTrabajo'].setValue(EMPTY);
          this.formInformacionLaboral.controls['correoLaboral'].setValue(EMPTY);
          this.formInformacionLaboral.controls['ingresoMensualNeto']['controls']['monto'].setValue(
            EMPTY
          );
        }
      }
    }
    this.enviadoFormulario = false;
  }

  public cancelarButton() {
    this.mostrarLimpiaButton = true;
    this.mensajeLimpiarCampos = false;
  }

  public buscarRelacionado() {
    const { valid, value } = this.formDocumento;
    if (valid) {
      const formDocumentoMayusculas = actualizarUppercaseForm({ ...value });
      this.cargandoObteniendoPersona = true;
      this.servicioObtenerPersonasRelacionadas(formDocumentoMayusculas);
    }
    this.formDocumentoError = true;
  }

  private servicioObtenerPersonasRelacionadas(payload) {
    this.asociadoApiService.obtenerPersonasRelacionadas(payload).subscribe(
      relacionado => {
        this.mostrarLimpiaButton = true;
        this.errorBuscarRelacionado = null;
        const personaRelacionada = new PersonaRelacionada(
          relacionado,
          this.esTipoNatural,
          this.esTipoJuridico
        );
        this.cargandoObteniendoPersona = false;
        this.btnBuscarRelacionado = false;
        this.btnBorrarDatos = true;
        this.mostrarBusquedaButton = false;
        if (personaRelacionada) {
          this.obtenerValorTipoRelacionActual(personaRelacionada.idTipoRelacion);
          this.informacionPersonaRelacionada = true;
          this.activarODesactivarFormDocumento();
          this.actualizarFormulario(personaRelacionada);
        }
      },
      (error: APIError) => {
        if (error) {
          this.errorBuscarRelacionado = error.mensaje;
          this.cargandoObteniendoPersona = false;
        }
      }
    );
  }

  private obtenerValorTipoRelacionActual = (value: string) => {
    if (this.tipoPersona === TiposPersona.NATURAL) {
      this.valorTipoRelacionActual = this.configuracion.tipoRelacion.getValor(value.toString());
    } else {
      this.valorTipoRelacionActual = this.configuracion.tipoRelacionJuridico.getValor(
        value.toString()
      );
    }
  };

  public documentoFormulario() {
    this.formDocumento = this.fb.group({
      numeroDocumento: [''],
      tipoDocumento: ['', Validators.required]
    });

    const controls = this.formDocumento.controls;
    this.numeroDocumento = controls['numeroDocumento'];
    this.tipoDocumento = controls['tipoDocumento'];
    this.seleccionarDocumento();
  }

  public seleccionarDocumento() {
    const controls = this.formDocumento.controls;
    this.tipoDocumento.valueChanges.subscribe(id => {
      const tipo = this.configuracion.tipoDocumento.getValor(id);
      const controlNumero = controls['numeroDocumento'];
      if (!this.informacionPersonaRelacionada) {
        let validaciones;
        if (this.agregarRelacionado) {
          controlNumero.setValue(EMPTY);
        }
        if (tipo === DNI) {
          this.esSoloNumeros = true;
          validaciones = [
            Validators.minLength(8),
            Validators.maxLength(8),
            Validators.required,
            this.validations.validateNumber
          ];
        } else {
          this.esSoloNumeros = false;
          validaciones = [Validators.maxLength(13), Validators.required];
        }
        controlNumero.setValidators(validaciones);
      }
    });
  }

  public actualizarFormulario(relacionado: PersonaRelacionada) {
    this.obtenerValorTipoRelacionActual(relacionado.idTipoRelacion);

    const idDepartamentoValue = relacionado.direccionDomicilio.idDepartamento;
    this.idPersonaRelacionada = relacionado.idPersonaRelacionada;
    const direccionDomicilio = relacionado.direccionDomicilio;
    const informacionLaboral = relacionado.informacionLaboral;

    if (this.esTipoNatural) {
      const modalControlsNatural = {
        nombres: [relacionado.nombres, [Validators.required, Validators.maxLength(100)]],
        apellidoPaterno: [
          relacionado.apellidoPaterno,
          [Validators.required, Validators.maxLength(75)]
        ],
        apellidoMaterno: [
          relacionado.apellidoMaterno,
          [Validators.required, Validators.maxLength(75)]
        ],
        idTipoRelacion: [relacionado.idTipoRelacion, Validators.required],
        idEstadoCivil: [relacionado.idEstadoCivil, Validators.required],
        idPaisNacionalidad: [relacionado.idPaisNacionalidad, Validators.required],
        fechaNacimiento: [
          relacionado.fechaNacimiento,
          [Validators.required, this.validations.fechaNacimiento(18)]
        ],
        idSexo: [relacionado.idSexo, Validators.required],
        correo: [relacionado.correo, [Validators.maxLength(65), this.validations.validateEmail]],
        celular: [relacionado.celular, [Validators.required, Validators.maxLength(11)]],
        estadoPEP: [relacionado.estadoPEP],
        direccionDomicilio: this.fb.group(
          {
            idDepartamento: [direccionDomicilio.idDepartamento],
            idProvincia: [direccionDomicilio.idProvincia],
            idDistrito: [direccionDomicilio.idDistrito],
            idTipoZona: [direccionDomicilio.idTipoZona],
            nombreZona: [direccionDomicilio.nombreZona, Validators.maxLength(100)],
            idTipoVia: [direccionDomicilio.idTipoVia, Validators.required],
            direccionTexto: [
              direccionDomicilio.direccionTexto,
              [Validators.required, Validators.maxLength(255)]
            ],
            referencia: [direccionDomicilio.referencia, [Validators.maxLength(255)]]
          },
          {
            validator: [this.validations.direccionValidation(this.portalSandbox)]
          }
        ),
        aportaIngresos: [relacionado.aportaIngresos]
      };

      this.formModal = this.fb.group(modalControlsNatural);

      const laboralControlsNatural = {
        idTipoTrabajador: [informacionLaboral.idTipoTrabajador, Validators.required],
        centroTrabajo: [
          informacionLaboral.centroTrabajo,
          [Validators.required, Validators.maxLength(65)]
        ],
        cargoOcupacion: [
          this.convertCargoToOpcion(informacionLaboral.cargoOcupacion),
          Validators.required
        ],
        fechaIngresoTrabajo: [
          informacionLaboral.fechaIngresoTrabajo,
          [Validators.required, this.validations.fechaMaximaActual]
        ],
        correoLaboral: [
          informacionLaboral.correoLaboral,
          [this.validations.validateEmail, Validators.maxLength(65), Validators.required]
        ]
      };
      this.formInformacionLaboral = this.fb.group(laboralControlsNatural);
    }

    if (this.esTipoJuridico) {
      const modalControlsJuridico = {
        nombres: [relacionado.nombres, [Validators.required, Validators.maxLength(100)]],
        apellidoPaterno: [
          relacionado.apellidoPaterno,
          [Validators.required, Validators.maxLength(75)]
        ],
        apellidoMaterno: [
          relacionado.apellidoMaterno,
          [Validators.required, Validators.maxLength(75)]
        ],
        idTipoRelacion: [relacionado.idTipoRelacion, Validators.required],
        idEstadoCivil: [relacionado.idEstadoCivil, Validators.required],
        idPaisNacionalidad: [relacionado.idPaisNacionalidad, Validators.required],
        fechaNacimiento: [relacionado.fechaNacimiento, [this.validations.fechaNacimiento(18)]],
        idSexo: [relacionado.idSexo, Validators.required],
        correo: [
          relacionado.correo,
          [Validators.required, Validators.maxLength(65), this.validations.validateEmail]
        ],
        celular: [relacionado.celular, [Validators.required, Validators.maxLength(11)]],
        telefonoFijo: [relacionado.telefonoFijo, [Validators.maxLength(11)]],
        estadoPEP: [relacionado.estadoPEP],
        direccionDomicilio: this.fb.group(
          {
            idDepartamento: [direccionDomicilio.idDepartamento],
            idProvincia: [direccionDomicilio.idProvincia],
            idDistrito: [direccionDomicilio.idDistrito],
            idTipoZona: [direccionDomicilio.idTipoZona],
            nombreZona: [direccionDomicilio.nombreZona, Validators.maxLength(100)],
            idTipoVia: [direccionDomicilio.idTipoVia, Validators.required],
            direccionTexto: [
              direccionDomicilio.direccionTexto,
              [Validators.required, Validators.maxLength(255)]
            ],
            referencia: [direccionDomicilio.referencia, [Validators.maxLength(255)]]
          },
          {
            validator: [this.validations.direccionValidation(this.portalSandbox)]
          }
        ),
        aportaIngresos: [relacionado.aportaIngresos]
      };
      this.formModal = this.fb.group(modalControlsJuridico);

      const ingresoMensualNeto = relacionado.informacionLaboral.ingresoMensualNeto;

      const laboralControlsJuridico = {
        cargoOcupacion: [
          this.convertCargoToOpcion(informacionLaboral.cargoOcupacion),
          Validators.required
        ],
        fechaIngresoTrabajo: [
          informacionLaboral.fechaIngresoTrabajo,
          [Validators.required, this.validations.fechaMaximaActual]
        ],
        correoLaboral: [
          informacionLaboral.correoLaboral,
          [Validators.required, Validators.maxLength(65), this.validations.validateEmail]
        ],
        ingresoMensualNeto: this.fb.group(
          {
            idMoneda: [ingresoMensualNeto.idMoneda, [Validators.required]],
            monto: [
              ingresoMensualNeto.monto,
              [
                Validators.required,
                Validators.min(1),
                this.validations.validateNumber,
                this.validations.ceroPrimerDigitoValidation,
                this.validations.validateMonto
              ]
            ]
          },
          {
            validator: Validators.required
          }
        )
      };

      this.formInformacionLaboral = this.fb.group(laboralControlsJuridico);

      this.ingresoMensualNeto = this.formInformacionLaboral.controls['ingresoMensualNeto'];

      const { idMoneda, monto } = this.ingresoMensualNeto.controls;
      this.obtenerIngresoDolar(idMoneda.value, monto.value);
    }

    this.direccionDomicilio = this.formModal.controls['direccionDomicilio'];

    if (!idDepartamentoValue) {
      this.provincias = [];
      this.distritos = [];
    }

    this.bloquearListaDeRelacion();
    this.bloquearListaDeEstadoCivil();

    const controls = this.formModal.controls;
    const formDireccion: any = controls['direccionDomicilio'];
    const { controls: direccionControl } = formDireccion;

    direccionControl['idDepartamento'].valueChanges.subscribe(idDepartamento => {
      if (isEmpty(idDepartamento)) {
        this.provincias = [];
        this.distritos = [];
      } else {
        direccionControl.idProvincia.setValue(EMPTY);
        direccionControl.idDistrito.setValue(EMPTY);

        this.portalApiService.getComboProvincias(idDepartamento).subscribe(provincias => {
          this.provincias = provincias;
        });
      }
    });

    direccionControl['idProvincia'].valueChanges.subscribe(idProvincia => {
      if (isEmpty(idProvincia)) {
        this.distritos = [];
      } else {
        direccionControl.idDistrito.setValue(EMPTY);
        const idDepartamento = direccionControl['idDepartamento'].value;

        this.portalApiService
          .getComboDistritos(idDepartamento, idProvincia)
          .subscribe(distritos => {
            this.distritos = distritos;
          });
      }
    });

    this.portalApiService
      .getComboProvincias(direccionDomicilio['idDepartamento'])
      .subscribe(provincias => {
        this.provincias = provincias;
      });

    this.portalApiService
      .getComboDistritos(direccionDomicilio['idDepartamento'], direccionDomicilio['idProvincia'])
      .subscribe(distritos => {
        this.distritos = distritos;
      });
  }

  private bloquearListaDeRelacion() {
    const configuracionListaTipoRelacion = this.configuracion.tipoRelacion.unir(
      this.configuracion.tipoRelacionJuridico
    );
    if (this.tipoPersona === TiposPersona.NATURAL) {
      const controlIdTipoRelacion = this.formModal.get('idTipoRelacion');
      const idConyuge = this.configuracion.tipoRelacion.getClave(CONYUGE);
      const idConviviente = this.configuracion.tipoRelacion.getClave(CONVIVIENTE);
      const valueIdTipoRelacion = controlIdTipoRelacion.value.toString();
      if (valueIdTipoRelacion === EMPTY) {
        this.listaTiposRelaciones = configuracionListaTipoRelacion.filter(
          ({ clave }) => clave === idConyuge || clave === idConviviente
        );
      } else {
        this.listaTiposRelaciones = configuracionListaTipoRelacion.filter(
          ({ clave }) =>
            clave === idConyuge || clave === idConviviente || clave === valueIdTipoRelacion
        );
      }
    } else {
      this.listaTiposRelaciones = this.configuracion.tipoRelacionJuridico.filter(
        ({ clave }) => clave !== '19'
      );
    }
  }

  private bloquearListaDeEstadoCivil() {
    const configuracionListaEstadoCivil = this.configuracion.estadoCivil.getArray();
    if (this.tipoPersona === TiposPersona.NATURAL) {
      const controlIdTipoRelacion = this.formModal.get('idEstadoCivil');
      const idCasado = this.configuracion.estadoCivil.getClave(CASADO);
      const idConviviente = this.configuracion.estadoCivil.getClave(CONVIVIENTE);
      const valueIdTipoRelacion = controlIdTipoRelacion.value.toString();
      if (valueIdTipoRelacion === EMPTY) {
        this.listaEstadoCivil = configuracionListaEstadoCivil.filter(
          ({ clave }) => clave === idCasado || clave === idConviviente
        );
      } else {
        this.listaEstadoCivil = configuracionListaEstadoCivil.filter(
          ({ clave }) =>
            clave === idCasado || clave === idConviviente || clave === valueIdTipoRelacion
        );
      }
    } else {
      this.listaEstadoCivil = configuracionListaEstadoCivil;
    }
  }

  public obtenerIngresoDolar(idMoneda, monto) {
    const monedaValor = this.configuracion.tipoMoneda.getValor(idMoneda.toString());
    if (monedaValor === SIMBOLO_SOL) {
      monto = Number(monto);
      const tipoCambio = new Big(this.configuracion.tipoCambio);
      const montoMoneda = new Big(monto);
      const montoDolares = montoMoneda.div(tipoCambio).toFixed(2);
      this.ingresosDolares = montoDolares;
    }
  }

  public keyupForm(idMoneda, event) {
    const monto = event.target.value;
    if (monto[0] && monto.toString().length > 0 && monto[0] !== '.') {
      this.obtenerIngresoDolar(idMoneda, monto);
    } else {
      this.ingresosDolares = 0;
      event.target.value = 0;
    }
  }

  public editarPersonaRelacionada(persona: IPersonaRelacionadaItem) {
    this.mostrarBusquedaButton = false;
    this.agregarRelacionado = false;
    const { numeroDocumento, idTipoDocumento } = persona;
    this.formDocumento.controls['numeroDocumento'].setValue(numeroDocumento);
    this.formDocumento.controls['tipoDocumento'].setValue(idTipoDocumento);
    this.showModalPersonasRelacionadas = true;
    this.idRelacion = persona.idRelacion;

    this.cargandoObteniendoPersona = true;
    this.activarODesactivarFormDocumento();
    this.asociadoApiService.obtenerPersonasRelacionadaPorIdRelacion(this.idRelacion).subscribe(
      relacionado => {
        const personaRelacionada = new PersonaRelacionada(
          relacionado,
          this.esTipoNatural,
          this.esTipoJuridico
        );
        this.cargandoObteniendoPersona = false;
        if (personaRelacionada) {
          this.informacionPersonaRelacionada = true;
          this.activarODesactivarFormDocumento();
          this.actualizarFormulario(personaRelacionada);
        }
        this.btnBorrarDatos = false;
        this.btnBuscarRelacionado = false;
      },
      () => {
        this.cargandoObteniendoPersona = false;
        this.activarODesactivarFormDocumento(false);
      }
    );
  }

  public agregandoPersonaRelacionada() {
    if (this.accesoEditar) {
      this.mensajeLimpiarCampos = false;
      this.formDocumento.controls['tipoDocumento'].setValue(EMPTY);
      this.formDocumento.controls['numeroDocumento'].setValue(EMPTY);
      this.formDocumentoError = false;
      this.mostrarBusquedaButton = true;
      this.mostrarListaDocumentosValidos();
      this.agregarRelacionado = true;
      this.idRelacion = null;
      this.showModalPersonasRelacionadas = true;
      this.informacionPersonaRelacionada = false;
      this.reiniciarFormulario();
      this.activarODesactivarFormDocumento(true);
      this.btnBorrarDatos = false;
      this.btnBuscarRelacionado = true;
    }
  }

  public guardarForm() {
    if (this.accesoEditar) {
      this.enviadoFormulario = true;
      let formValue = actualizarUppercaseForm(this.formModal.value);
      formValue['numeroDocumento'] = this.formDocumento.value.numeroDocumento;
      formValue['tipoDocumento'] = this.formDocumento.value.tipoDocumento;
      formValue = actualizarUppercaseForm(formValue);
      const cargoOcupacionControl = this.formInformacionLaboral.controls['cargoOcupacion'];

      if (this.esTipoJuridico) {
        const valueIngresos = this.ingresoMensualNeto.controls['monto'].value;
        if (Number(valueIngresos) > 1) {
          this.ingresoMensualNeto.controls.monto.setValidators([Validators.required]);
        }
      }

      if (this.formModal.get('aportaIngresos').value || this.esTipoJuridico) {
        let cargoOcupacionValue: string;

        if (cargoOcupacionControl.value) {
          cargoOcupacionValue = cargoOcupacionControl.value.text;
        }

        if (!cargoOcupacionValue || !cargoOcupacionControl.value) {
          this.formInformacionLaboral.controls['cargoOcupacion'].setErrors([{ vacio: true }]);
        }

        const { valid, value } = this.formInformacionLaboral;
        if (valid) {
          formValue['informacionLaboral'] = actualizarUppercaseForm(value);
          const informacionLaboral = formValue.informacionLaboral;
          informacionLaboral.cargoOcupacion = this.convertOpcionToCargo(
            informacionLaboral.cargoOcupacion
          );
        } else {
          this.scrollFirstInvalid.next(true);
          return false;
        }
      }

      this.guardandoRelacionado(formValue);
    }
  }

  public guardandoRelacionado(formValue) {
    if (this.formModal.valid) {
      this.valueIdTipoRelacion = this.formModal.get('idTipoRelacion').value.toString();

      this.cargandoObteniendoPersona = true;
      const payload: IPersonaRelacionada = {
        tipoPersona: normalizarTildes(this.tipoPersona).toLowerCase(),
        idPersona: this.idPersona,
        idPersonaRelacionada: this.idPersonaRelacionada,
        idRelacion: this.idRelacion,
        ...formValue
      };

      if (this.idRelacion) {
        this.asociadoApiService.actualizarPersonasRelacionadas(payload).subscribe(
          () => {
            this.cargandoObteniendoPersona = false;
            return this.actualizarListaRelacionados();
          },
          (error: APIError) => {
            this.guardadoMensaje = error.mensaje;
            this.guardadoType = NotificationTypeEnum.Danger;
            this.cargandoObteniendoPersona = false;
          }
        );
      } else {
        this.asociadoApiService.agregarPersonasRelacionadas(payload).subscribe(
          () => {
            this.btnBorrarDatos = false;
            this.cargandoObteniendoPersona = false;
            if (this.formModal.get('aportaIngresos').value) {
              const valueIdTipoRelacion = this.formModal.get('idTipoRelacion').value.toString();
              const listaTiposRelaciones = this.listaTiposRelaciones.find(
                tipoRelacion => tipoRelacion.clave === valueIdTipoRelacion
              );
              this.agregarIngreso.emit(listaTiposRelaciones);
            }

            return this.actualizarListaRelacionados();
          },
          (error: APIError) => {
            this.guardadoMensaje = error.mensaje;
            this.guardadoType = NotificationTypeEnum.Danger;
            this.cargandoObteniendoPersona = false;
          }
        );
      }
    } else {
      this.scrollFirstInvalid.next(true);
    }
  }

  private getControl(...ids) {
    let controls: any = this.formModal.controls;
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
    return this.enviadoFormulario && this.getControl(...ids).errors;
  }

  public getControlSelectedError(id, error) {
    if (this.enviadoFormulario) {
      const errors = this.getControlError(id);
      if (errors) {
        return errors[error];
      }

      return null;
    }
  }

  private convertCargoToOpcion(cargo: ICargoOcupacion): IGinniOption {
    if (cargo) {
      return {
        text: cargo.descripcion,
        value: Number(cargo.identificador)
      };
    }
    return null;
  }

  private convertOpcionToCargo(option: IGinniOption): ICargoOcupacion {
    if (option) {
      return {
        identificador: option.value.toString(),
        descripcion: option.text
      };
    } else {
      return {
        identificador: EMPTY,
        descripcion: EMPTY
      };
    }
  }

  public cargoOcupacionInputChange({ value, finish }: IGinniSelectLoadEvent) {
    this.asociadoApiService.obtenerCargoOcupacion(value).subscribe(res => {
      finish(
        res.map(
          (prop: IProp): IGinniOption => ({
            value: prop.valor,
            text: prop.clave
          })
        )
      );
    });
  }

  public desregistrarEventos() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
