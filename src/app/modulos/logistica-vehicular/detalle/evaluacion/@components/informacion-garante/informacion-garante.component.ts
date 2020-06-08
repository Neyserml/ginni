import { Component, OnInit, Input, ViewEncapsulation, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import * as store from 'app/@compartidos/store';
import {
  isEmpty,
  actualizarUppercaseForm,
  getIdBloqueContrato
} from 'app/@compartidos/utils/helpers';
import { IProp, APIError } from 'app/@compartidos/models';
import { EMPTY } from 'app/@compartidos/utils/consts';
import { ValidationService } from 'app/@compartidos/utils/validation.service';
import { Configuracion } from 'app/modulos/portal/@models/configuracion.model';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { PortalApiService } from 'app/modulos/portal/portal.api.service';
import {
  IGaranteDetalle,
  IAgregarGarante
} from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/garante.interface';
import { DetalleApiService } from 'app/modulos/logistica-vehicular/detalle/detalle-api.service';
import { IDocumentosPersonas } from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/documentos-personas.interface';
import {
  AGREGAR,
  EDITAR
} from 'app/modulos/logistica-vehicular/detalle/evaluacion/evaluacion.enum';
import {
  getPersonasRelacionadas,
  getPersonalFailed
} from 'app/modulos/logistica-vehicular/detalle/@store';
import { IPersonaRelacionadaItem } from 'app/modulos/logistica-vehicular/detalle/@models/persona-relacionada.model';
import { EvaluacionApiService } from 'app/modulos/logistica-vehicular/detalle/evaluacion/evaluacion-api.service';
import {
  TiposPersona,
  CONVIVIENTE,
  CASADO
} from 'app/modulos/logistica-vehicular/detalle/detalle.enum';
import { NotificationTypeEnum } from 'app/@compartidos/services/notification-type.enum';

const CONTROL_RELACION = 'relacion';
const CONTROL_VINCULADO = 'vinculado';

@Component({
  selector: 'ginni-informacion-garante',
  templateUrl: './informacion-garante.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class InformacionGaranteComponent implements OnInit {
  public typeError = NotificationTypeEnum.Danger;
  public typeSuccess = NotificationTypeEnum.Success;
  private actualEstadoCivil: string;
  private actualEstadoCivilSelected: string;
  public distritosNacimiento: IProp[] = [];
  public disabledDepartamentos = false;
  public distritos: IProp[] = [];
  public enviadoFormulario = false;
  private idBloqueContrato: string;
  public provinciasNacimiento: IProp[] = [];
  public modalModificarEvaluacion = false;
  public modalEstasSeguroEliminar = false;
  public provincias: IProp[] = [];
  public scrollFirstInvalid = new Subject();
  public seGuarda = false;

  @Input()
  public accesoEditar: boolean;

  @Input()
  public accionGarante: string;

  @Input()
  public configuracion: Configuracion;

  @Input()
  public editarGarante: IDocumentosPersonas;

  @Input()
  public idPersona: string;

  @Input()
  public guardadoExitoso = false;

  @Input()
  public guardadoError: string;

  @Input()
  public loading: boolean;

  @Input()
  public failed: string;

  @Input()
  public tipoPersona: TiposPersona.NATURAL | TiposPersona.JURIDICO;

  @Input()
  public informacionGarante: IGaranteDetalle;

  @Input()
  public mostrarModal: boolean;

  @Output()
  public datosPersonaGarante: EventEmitter<any> = new EventEmitter();
  @Output()
  public mostrarPersonasRelacionadas: EventEmitter<boolean> = new EventEmitter();
  @Output()
  public desabilitarTabs: EventEmitter<boolean> = new EventEmitter();

  public CONTROL_RELACION = CONTROL_RELACION;
  public CONTROL_VINCULADO = CONTROL_VINCULADO;

  public personasRelacionadas: IPersonaRelacionadaItem[];

  // form
  public form: FormGroup = this.fb.group({});
  public direccionDomicilio;
  public actividadEconomica;
  public facturacionMensual;
  public lugarNacimiento;
  public subscriptions: Subscription[] = [];

  // Observadores
  public personasRelacionadas$ = this.appState$.select(getPersonasRelacionadas);
  public personasRelacionadasFailed$ = this.appState$.select(getPersonalFailed);

  get departamentos() {
    return this.portalSandbox.departamentos;
  }

  constructor(
    public fb: FormBuilder,
    public portalSandbox: PortalSandbox,
    public portalApiService: PortalApiService,
    public validations: ValidationService,
    public appState$: Store<store.State>,
    public asociadoApiService: DetalleApiService,
    private evaluacionApiService: EvaluacionApiService
  ) {}

  public ngOnInit() {
    this.idBloqueContrato = getIdBloqueContrato();
    this.actualizarFormulario();
    this.obtenerEstadoCivil(this.informacionGarante);
    this.registrarEventos();
  }

  private registrarEventos() {
    this.subscriptions.push(
      this.personasRelacionadas$.subscribe(personasRelacionadas => {
        this.personasRelacionadas = personasRelacionadas;
      }),
      this.personasRelacionadasFailed$.subscribe(error => {
        if (error) {
          this.failed = error;
        }
      })
    );
  }

  private obtenerEstadoCivil(garante) {
    const estadoCivilClave = garante.idEstadoCivil.toString();
    const estadoCivilValor = this.configuracion.estadoCivil.getValor(estadoCivilClave);

    if (estadoCivilValor === CASADO || estadoCivilValor === CONVIVIENTE) {
      this.mostrarPersonasRelacionadas.emit(true);
    }
  }

  private actualizarFormulario() {
    this.form = this.creandoFormGroup(this.informacionGarante);
    const direccionDomicilio = this.informacionGarante.direccionDomicilio;
    this.direccionDomicilio = this.form.controls['direccionDomicilio'];
    this.actualEstadoCivil = this.informacionGarante.idEstadoCivil.toString();
    this.actualEstadoCivilSelected = this.informacionGarante.idEstadoCivil.toString();
    const controls = this.form.controls;
    const formDireccion: any = controls['direccionDomicilio'];
    const { controls: direccionControl } = formDireccion;

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

    this.cambioDepartamento(direccionControl);
    this.cambioProvincia(direccionControl);
  }

  private cambioDepartamento(direccionControl) {
    direccionControl['idDepartamento'].valueChanges.subscribe(idDepartamento => {
      if (direccionControl) {
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
      }
    });
  }

  private cambioProvincia(direccionControl) {
    direccionControl['idProvincia'].valueChanges.subscribe(idProvincia => {
      if (direccionControl) {
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
      }
    });
  }

  private creandoFormGroup(informacionGarante): FormGroup {
    const direccion = informacionGarante.direccionDomicilio;
    return this.fb.group({
      nombres: [informacionGarante.nombres, [Validators.required, Validators.maxLength(100)]],
      apellidoPaterno: [
        informacionGarante.apellidoPaterno,
        [Validators.required, Validators.maxLength(75)]
      ],
      apellidoMaterno: [
        informacionGarante.apellidoMaterno,
        [Validators.required, Validators.maxLength(75)]
      ],
      idEstadoCivil: [informacionGarante.idEstadoCivil, [Validators.required]],
      fechaNacimiento: [informacionGarante.fechaNacimiento, [this.validations.fechaNacimiento(18)]],
      idSexo: [informacionGarante.idSexo, [Validators.required]],
      telefonoFijo: [
        informacionGarante.telefonoFijo,
        [Validators.required, Validators.maxLength(11)]
      ],
      correo: [
        informacionGarante.correo,
        [Validators.required, this.validations.validateEmail, Validators.maxLength(65)]
      ],
      direccionDomicilio: this.fb.group(
        {
          idDepartamento: [direccion.idDepartamento, Validators.required],
          idProvincia: [direccion.idProvincia, Validators.required],
          idDistrito: [direccion.idDistrito, Validators.required],
          idTipoZona: [direccion.idTipoZona],
          nombreZona: [direccion.nombreZona, Validators.maxLength(255)],
          idTipoVia: [direccion.idTipoVia, [Validators.required]],
          direccionTexto: [
            direccion.direccionTexto,
            [Validators.required, Validators.maxLength(255)]
          ],
          referencia: [direccion.referencia, [Validators.maxLength(255)]]
        },
        {
          validator: this.validations.direccionValidation(this.portalSandbox)
        }
      )
    });
  }

  public getControl(...ids) {
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

  public getOpcionSeleccionada(options?: IProp[], clave?: string) {
    if (!options || !clave) {
      return null;
    }
    const seleccionado = options.filter(item => item.clave === clave)[0];
    return seleccionado ? seleccionado.valor : null;
  }

  public guardarForm() {
    if (this.accesoEditar) {
      this.enviadoFormulario = true;
      this.guardadoError = null;
      this.guardadoExitoso = false;
      if (this.form.valid) {
        if (this.estaPorEliminarsePersonaRelacionada()) {
          this.modalEstasSeguroEliminar = true;
        } else {
          this.enviarActualizarPersonal();
        }
      }
      this.scrollFirstInvalid.next(true);
    }
  }

  private esCasado(idEstadoCivil?): boolean {
    const claveCasado = this.configuracion.estadoCivil.getClave(CASADO);
    const claveConviviente = this.configuracion.estadoCivil.getClave(CONVIVIENTE);
    const estadoCivilComparar = idEstadoCivil || this.getControl('idEstadoCivil').value;
    return (
      estadoCivilComparar.toString() === claveCasado.toString() ||
      estadoCivilComparar.toString() === claveConviviente.toString()
    );
  }

  private estaPorEliminarsePersonaRelacionada() {
    const nuevoEstadoCivil = this.form.get('idEstadoCivil').value;
    const actualEstadoCivilEsCasado = this.esCasado(this.actualEstadoCivil.toString());
    const nuevoEstadoCivilEsCasado = this.esCasado(nuevoEstadoCivil.toString());
    if (
      !nuevoEstadoCivilEsCasado &&
      actualEstadoCivilEsCasado &&
      this.personasRelacionadas &&
      this.personasRelacionadas.length
    ) {
      return true;
    } else {
      return false;
    }
  }

  public enviarActualizarPersonal(esModal = false) {
    this.loading = true;
    this.modalEstasSeguroEliminar = false;
    const finalForm = actualizarUppercaseForm(this.form.value);
    this.actualEstadoCivil = finalForm.idEstadoCivil;
    const tipoZonaValor = finalForm.direccionDomicilio.idTipoZona;
    let seAgrega = false;
    if (tipoZonaValor && tipoZonaValor === 'NULL') {
      finalForm.direccion.idTipoZona = EMPTY;
    }
    const { idTipoRelacion, tipoDocumento, numeroDocumento } = this.informacionGarante;
    const payload: IAgregarGarante = {
      ...finalForm,
      idTipoRelacion,
      tipoDocumento,
      numeroDocumento
    };

    if (this.accionGarante === AGREGAR) {
      seAgrega = true;
    } else {
      seAgrega = false;
    }

    if (seAgrega) {
      this.servicioGuardarGarante(payload, esModal);
    } else {
      this.servicioActualizarGarante(payload, esModal);
    }
  }

  private servicioMensajesSistema() {
    this.asociadoApiService
      .asociadoMensajesSistema(this.idBloqueContrato)
      .subscribe((mensajesSistema: Array<string>) => {
        if (mensajesSistema) {
          this.asociadoApiService.guardarMensajesSistema(mensajesSistema);
        }
      });
  }

  public servicioGuardarGarante(payload, esModal) {
    this.evaluacionApiService.agregarRespaldo(payload, this.idBloqueContrato).subscribe(
      idPersonaGarante => {
        if (idPersonaGarante) {
          this.accionGarante = EDITAR;
          this.servicioMensajesSistema();
          if (esModal) {
            this.asociadoApiService.esSoltero(true);
          } else {
            this.asociadoApiService.esSoltero(false);
          }

          this.modalModificarEvaluacion = this.mostrarModal;

          this.servicioExitoso(payload, idPersonaGarante);
        }
      },
      (error: APIError) => {
        if (error) {
          this.desabilitarTabs.emit();
          this.servicioError(error);
        }
      }
    );
  }

  public servicioActualizarGarante(payload, esModal) {
    this.evaluacionApiService.actualizarRespaldo(payload).subscribe(
      idPersonaGarante => {
        if (idPersonaGarante) {
          this.servicioMensajesSistema();
          if (esModal) {
            this.asociadoApiService.esSoltero(true);
          } else {
            this.asociadoApiService.esSoltero(false);
          }
          this.modalModificarEvaluacion = this.mostrarModalModificarEvaluacion(CASADO);
          this.servicioExitoso(payload, idPersonaGarante);
          this.actualEstadoCivilSelected = payload.idEstadoCivil;
        }
      },
      (error: APIError) => {
        if (error) {
          this.servicioError(error);
        }
      }
    );
  }

  private mostrarModalModificarEvaluacion(value: string) {
    const nuevoEstadoCivil = this.form.get('idEstadoCivil').value;
    if (nuevoEstadoCivil.toString() !== this.actualEstadoCivilSelected.toString()) {
      const valorActualEstadoCivil = this.configuracion.estadoCivil.getValor(
        this.actualEstadoCivilSelected.toString()
      );
      const valorNuevoEstadoCivil = this.configuracion.estadoCivil.getValor(
        nuevoEstadoCivil.toString()
      );

      const actualEstadoCivilValido = valorActualEstadoCivil === value;
      const nuevoEstadoCivilValido = valorNuevoEstadoCivil === value;

      return actualEstadoCivilValido || nuevoEstadoCivilValido;
    }
  }

  private servicioExitoso(payload, idPersonaGarante) {
    this.loading = false;
    this.guardadoError = null;
    this.guardadoExitoso = true;
    const datos = {
      idPersonaGarante,
      idEstadoCivil: payload.idEstadoCivil
    };
    this.datosPersonaGarante.emit(datos);
  }

  private servicioError(error) {
    this.guardadoError = error.mensaje;
    this.guardadoExitoso = false;
    this.loading = false;
  }
}
