import { Component, OnInit, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import Big from 'big.js';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import {
  IInformacionPersonalResponse,
  IVinculado,
  ITelefono,
  IVinculadoBusqueda,
  IActividadEconomica,
  tipoTelefono
} from 'app/modulos/logistica-vehicular/detalle/@models/personal.model';
import {
  getPersonal,
  getPersonalLoading,
  getPersonalFailed,
  getPersonasRelacionadas
} from 'app/modulos/logistica-vehicular/detalle/@store';
import * as personalAction from 'app/modulos/logistica-vehicular/detalle/@store/personal.action';
import * as personasRelacionadasAction from 'app/modulos/logistica-vehicular/detalle/@store/personas-relacionadas.action';
import { DetalleApiService } from 'app/modulos/logistica-vehicular/detalle/detalle-api.service';
import {
  IGinniOption,
  IGinniSelectLoadEvent
} from 'app/@compartidos/components/select/select.component';
import { Configuracion } from 'app/modulos/portal/@models/configuracion.model';
import {
  isEmpty,
  copiarObjeto,
  actualizarUppercaseForm,
  normalizarTildes
} from 'app/@compartidos/utils/helpers';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { IProp, APIError } from 'app/@compartidos/models';
import * as store from 'app/@compartidos/store';
import { PortalApiService } from 'app/modulos/portal/portal.api.service';
import { EMPTY } from 'app/@compartidos/utils/consts';
import { ValidationService } from 'app/@compartidos/utils/validation.service';
import { IPersonaRelacionadaItem } from 'app/modulos/logistica-vehicular/detalle/@models/persona-relacionada.model';
import {
  TiposPersona,
  CASADO,
  CONVIVIENTE,
  CLAVE_CASADO
} from 'app/modulos/logistica-vehicular/detalle/detalle.enum';
import { SIMBOLO_SOL, AlertMensajes } from 'app/@compartidos/compartidos.enum';
import { NotificationTypeEnum } from 'app/@compartidos/services/notification-type.enum';

const CONTROL_RELACION = 'relacion';
const CONTROL_VINCULADO = 'vinculado';

@Component({
  selector: 'ginni-informacion-personal',
  templateUrl: './informacion-personal.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class InformacionPersonalComponent implements OnInit, OnDestroy {
  public enviadoFormulario = false;
  public scrollFirstInvalid = new Subject();
  public tipoPersona: TiposPersona.NATURAL | TiposPersona.JURIDICO;

  public telefonosFijos: ITelefono[] = [];
  public celulares: ITelefono[] = [];
  public provincias: IProp[] = [];
  public distritos: IProp[] = [];
  public provinciasNacimiento: IProp[] = [];
  public distritosNacimiento: IProp[] = [];
  public disabledDepartamentos = false;
  public vinculados: IVinculado[] = [];
  public ID_SOLES;
  public ID_PERU;
  public cargando = false;
  public cargandoGuardando = false;
  public guardadoMensaje: string;
  public guardadoType: string;
  public modalEstasSeguroEliminar = false;
  public modalModificarEvaluacion = false;
  public personasRelacionadas: IPersonaRelacionadaItem[];
  public actualEstadoCivil;
  public ingresosDolares: number;
  private idTelefonoRequerido: number;
  private telefonos: ITelefono[];
  public tagDatosPersonalesOGenerales: string;

  public get esTipoNatural() {
    return this.tipoPersona ? this.tipoPersona === TiposPersona.NATURAL : false;
  }
  public get esTipoJuridico() {
    return this.tipoPersona ? this.tipoPersona === TiposPersona.JURIDICO : false;
  }

  // Observadores
  public personal$ = this.appState$.select(getPersonal);
  public personalLoading$ = this.appState$.select(getPersonalLoading);
  public personalFailed$ = this.appState$.select(getPersonalFailed);
  public personasRelacionadas$ = this.appState$.select(getPersonasRelacionadas);

  public personal: IInformacionPersonalResponse;

  @Input()
  public configuracion: Configuracion;
  @Input()
  public idPersona: string;

  @Input()
  public accesoEditar: boolean;

  public CONTROL_RELACION = CONTROL_RELACION;
  public CONTROL_VINCULADO = CONTROL_VINCULADO;

  // form
  public form: FormGroup = this.fb.group({});
  public formVinculados: FormGroup;
  public direccion;
  public actividadEconomica;
  public facturacionMensual;
  public lugarNacimiento;

  public subscriptions: Subscription[] = [];

  get paises() {
    return this.portalSandbox.paises;
  }

  get departamentos() {
    return this.portalSandbox.departamentos;
  }

  get mostrarSeparacionBienes(): boolean {
    if (this.configuracion && this.esTipoNatural) {
      return this.esCasadoOConviviente();
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

  private esCasadoOConviviente(idEstadoCivil?): boolean {
    const claveCasado = this.configuracion.estadoCivil.getClave(CASADO);
    const claveConviviente = this.configuracion.estadoCivil.getClave(CONVIVIENTE);
    const estadoCivilComparar = idEstadoCivil || this.getControl('idEstadoCivil').value;

    return estadoCivilComparar === claveCasado || estadoCivilComparar === claveConviviente;
  }

  constructor(
    public fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public portalSandbox: PortalSandbox,
    private asociadoApiService: DetalleApiService,
    public portalApiService: PortalApiService,
    private appState$: Store<store.State>,
    public validations: ValidationService
  ) {}

  public ngOnInit() {
    this.cargando = true;
    this.tipoPersona = this.activatedRoute.snapshot.data.tipo;

    this.tagDatosPersonalesOGenerales =
      this.tipoPersona === TiposPersona.NATURAL ? 'Datos personales' : 'Datos generales';

    this.llamarInformarcionPersonal();
    this.registrarEventos();
  }

  public ngOnDestroy(): void {
    this.desregistrarEventos();
  }

  public registrarEventos() {
    this.subscriptions.push(
      this.personal$.subscribe(personal => {
        if (personal) {
          this.cargando = false;
          this.telefonosFijos = personal.telefonosFijos;
          this.celulares = personal.celulares;
          this.personal = personal;

          if (this.esTipoNatural) {
            this.telefonosFijos = this.telefonosFijos.filter(
              (fijos, index) => fijos.valor.length > 0 || index === 0
            );
            this.celulares = this.celulares.filter(celular => celular.valor.length > 0);
          } else if (this.esTipoJuridico) {
            this.celulares = this.celulares.filter(
              (celular, index) => celular.valor.length > 0 || index === 0
            );
            this.telefonosFijos = this.telefonosFijos.filter(telefono => telefono.valor.length > 0);
          }

          this.celulares = this.celulares.map((celular, index) => {
            return { ...celular, indice: `M${index}` };
          });

          this.telefonosFijos = this.telefonosFijos.map((fijo, index) => {
            return { ...fijo, indice: `F${index}` };
          });

          this.telefonos = [...this.telefonosFijos, ...this.celulares];

          if (this.tipoPersona === TiposPersona.NATURAL) {
            this.actualizarFormularioNatural(personal);
          } else {
            this.actualizarFormularioJuridico(personal);
          }
        }
      }),
      this.personasRelacionadas$.subscribe(
        personasRelacionadas => (this.personasRelacionadas = personasRelacionadas)
      )
    );
  }

  private desregistrarEventos() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private crearGrupoTelefonos = (telefonos: ITelefono[], validations: ValidationService) => {
    const grupo = {};

    const listValidations = [Validators.maxLength(11), validations.validateNumber];
    telefonos.forEach(telefono => {
      grupo[telefono.indice] = [telefono.valor, listValidations];
    });

    let requerido;

    if (this.esTipoNatural) {
      requerido = telefonos.find(telefono => {
        return telefono.tipo === 'M';
      });

      if (!requerido) {
        grupo['M0'] = ['', listValidations.concat([Validators.required])];

        this.celulares.push({
          valor: '',
          anexo: null,
          tipo: tipoTelefono.MOVIL,
          indice: 'M0'
        });
      }
    } else {
      requerido = telefonos.find(telefono => {
        return telefono.tipo === 'F';
      });

      if (!requerido) {
        grupo['F0'] = ['', listValidations.concat([Validators.required])];

        this.celulares.push({
          valor: '',
          anexo: null,
          tipo: tipoTelefono.FIJO,
          indice: 'F0'
        });
      }
      this.idTelefonoRequerido = requerido.id;
      grupo['anexo'] = [requerido.anexo, [Validators.maxLength(5), validations.validateNumber]];
    }

    if (requerido) {
      grupo[requerido.indice] = [requerido.valor, listValidations.concat([Validators.required])];
    }

    return this.fb.group(grupo);
  };

  private actualizarFormularioNatural(personal: IInformacionPersonalResponse) {
    const direccion = personal.direccion;

    const telefonos = [...this.telefonosFijos, ...this.celulares];

    this.actualEstadoCivil = personal.idEstadoCivil;
    const lugarNacimiento = personal.lugarNacimiento;

    const deberiaDesactivarDepartamentos = idPais => {
      return idPais === this.portalSandbox.ID_PERU;
    };

    this.form = this.fb.group({
      telefonos: this.crearGrupoTelefonos(telefonos, this.validations),
      correo: [
        personal.correo,
        [Validators.required, this.validations.validateEmail, Validators.maxLength(65)]
      ],
      ruc: [
        personal.ruc,
        [Validators.minLength(11), Validators.maxLength(11), this.validations.validateNumber]
      ],
      idEstadoCivil: [personal.idEstadoCivil, [Validators.required]],
      separacionBienes: [personal.separacionBienes],
      fechaNacimiento: [personal.fechaNacimiento, [this.validations.fechaNacimiento(18)]],
      idPaisNacionalidad: [personal.idPaisNacionalidad, [Validators.required]],
      idSexo: [personal.idSexo, [Validators.required]],
      direccion: this.fb.group(
        {
          idDepartamento: [direccion.idDepartamento, Validators.required],
          idProvincia: [direccion.idProvincia, Validators.required],
          idDistrito: [direccion.idDistrito, Validators.required],
          idTipoZona: [direccion.idTipoZona],
          nombreZona: [direccion.nombreZona, Validators.maxLength(100)],
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
      ),
      lugarNacimiento: this.fb.group(
        {
          idPais: [lugarNacimiento.idPais],
          idDepartamento: [lugarNacimiento.idDepartamento],
          idProvincia: [lugarNacimiento.idProvincia],
          idDistrito: [lugarNacimiento.idDistrito]
        },
        {
          validator: this.validations.direccionValidation(this.portalSandbox)
        }
      )
    });

    if (deberiaDesactivarDepartamentos(lugarNacimiento.idPais)) {
      this.disabledDepartamentos = false;
    }

    this.direccion = this.form.controls['direccion'];
    this.lugarNacimiento = this.form.controls['lugarNacimiento'];
    const controls = this.form.controls;

    const formDireccion: any = controls['direccion'];
    const { controls: direccionControl } = formDireccion;

    controls['idEstadoCivil'].valueChanges.subscribe(() => {
      if (!this.esCasadoOConviviente()) {
        controls['separacionBienes'].setValue(false);
      }
      if (this.personal.separacionBienes) {
        controls.separacionBienes.setValue(true);
      }
    });

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

    const formLugarNacimiento: any = controls['lugarNacimiento'];
    const { controls: nacimientoControl } = formLugarNacimiento;

    nacimientoControl['idPais'].valueChanges.subscribe(idPais => {
      if (deberiaDesactivarDepartamentos(idPais)) {
        this.disabledDepartamentos = false;
      } else {
        this.provinciasNacimiento = [];
        this.distritosNacimiento = [];
        this.disabledDepartamentos = true;
        nacimientoControl['idDepartamento'].setValue(EMPTY);
        nacimientoControl['idProvincia'].setValue(EMPTY);
        nacimientoControl['idDistrito'].setValue(EMPTY);
      }
    });

    nacimientoControl['idDepartamento'].valueChanges.subscribe(idDepartamento => {
      if (isEmpty(idDepartamento)) {
        this.provinciasNacimiento = [];
        this.distritosNacimiento = [];
      } else {
        nacimientoControl['idProvincia'].setValue(EMPTY);
        nacimientoControl['idDistrito'].setValue(EMPTY);
        this.distritosNacimiento = [];

        this.portalApiService.getComboProvincias(idDepartamento).subscribe(provincias => {
          this.provinciasNacimiento = provincias;
        });
      }
    });

    nacimientoControl['idProvincia'].valueChanges.subscribe(idProvincia => {
      if (isEmpty(idProvincia)) {
        this.distritosNacimiento = [];
      } else {
        nacimientoControl['idDistrito'].setValue(EMPTY);
        const idDepartamento = nacimientoControl['idDepartamento'].value;
        this.portalApiService
          .getComboDistritos(idDepartamento, idProvincia)
          .subscribe(distritos => {
            this.distritosNacimiento = distritos;
          });
      }
    });

    this.portalApiService.getComboProvincias(direccion.idDepartamento).subscribe(provincias => {
      this.provincias = provincias;
    });

    this.portalApiService
      .getComboDistritos(direccion.idDepartamento, direccion.idProvincia)
      .subscribe(distritos => {
        this.distritos = distritos;
      });

    this.portalApiService
      .getComboProvincias(lugarNacimiento.idDepartamento)
      .subscribe(provincias => {
        this.provinciasNacimiento = provincias;
      });

    this.portalApiService
      .getComboDistritos(lugarNacimiento.idDepartamento, lugarNacimiento.idProvincia)
      .subscribe(distritos => {
        this.distritosNacimiento = distritos;
      });

    // Vinculados
    this.formVinculados = this.fb.group({});
    this.vinculados = personal.vinculados;
    this.actualizarVinculados();
  }

  public actualizarFormularioJuridico(personal: IInformacionPersonalResponse) {
    const direccion = personal.direccion;
    const telefonos = [...this.telefonosFijos, ...this.celulares];
    const facturacionMensual = personal.facturacionMensual;
    this.ID_SOLES = this.configuracion.tipoMoneda.getClave(SIMBOLO_SOL);
    this.form = this.fb.group({
      telefonos: this.crearGrupoTelefonos(telefonos, this.validations),
      correo: [
        personal.correo,
        [Validators.required, this.validations.validateEmail, Validators.maxLength(65)]
      ],
      numeroPartida: [personal.numeroPartida, [Validators.required, Validators.maxLength(30)]],
      fechaConstitucion: [
        personal.fechaConstitucion,
        [this.validations.fechaValidation, this.validations.fechaMaximaActual]
      ],
      actividadEconomica: [
        this.convertActividadToOpcion(personal.actividadEconomica),
        Validators.required
      ],
      giroNegocio: [personal.giroNegocio, [Validators.required, Validators.maxLength(100)]],
      direccion: this.fb.group(
        {
          idDepartamento: [direccion.idDepartamento],
          idProvincia: [direccion.idProvincia],
          idDistrito: [direccion.idDistrito],
          idTipoZona: [direccion.idTipoZona],
          nombreZona: [direccion.nombreZona, Validators.maxLength(100)],
          idTipoVia: [direccion.idTipoVia, Validators.required],
          direccionTexto: [
            direccion.direccionTexto,
            [Validators.required, Validators.maxLength(255)]
          ],
          referencia: [direccion.referencia, [Validators.maxLength(255)]]
        },
        {
          validator: [this.validations.direccionValidation(this.portalSandbox)]
        }
      ),
      facturacionMensual: this.fb.group({
        idFacturacionMensual: [facturacionMensual.idFacturacionMensual],
        idMoneda: [facturacionMensual.idMoneda || this.ID_SOLES, Validators.required],
        monto: [
          facturacionMensual.monto,
          [
            Validators.required,
            Validators.min(1),
            this.validations.validateNumber,
            this.validations.ceroPrimerDigitoValidation,
            this.validations.validateMonto
          ]
        ]
      })
    });

    this.direccion = this.form.controls['direccion'];
    this.actividadEconomica = this.form.controls['actividadEconomica'];
    this.facturacionMensual = this.form.controls['facturacionMensual'];
    const controls = this.form.controls;
    const { idMoneda, monto } = this.facturacionMensual.controls;
    this.obtenerIngresoDolar(idMoneda.value, monto.value);

    const formDireccion: any = controls['direccion'];
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

    this.portalApiService.getComboProvincias(direccion.idDepartamento).subscribe(provincias => {
      this.provincias = provincias;
    });

    this.portalApiService
      .getComboDistritos(direccion.idDepartamento, direccion.idProvincia)
      .subscribe(distritos => {
        this.distritos = distritos;
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

  public getVinculadosValue(index, id) {
    const group: any = this.formVinculados.controls[index];
    const option = group.controls[id].value;
    if (option) {
      return option.value;
    }
    return null;
  }

  public getVinculadoError(index, error) {
    if (this.enviadoFormulario) {
      const group: any = this.formVinculados.controls[index];
      const errors = group.errors;
      if (errors) {
        return errors[error];
      }
    }
    return null;
  }

  public getTelefono(tipo: string, personal = this.personal) {
    if (personal) {
      const telefono = personal.telefonos.filter(item => item.tipo === tipo)[0];
      return telefono ? telefono.valor : null;
    }
    return null;
  }

  public getOpcionSeleccionada(options?: IProp[], clave?: string) {
    if (!options || !clave) {
      return null;
    }
    const seleccionado = options.filter(item => item.clave === clave)[0];
    return seleccionado ? seleccionado.valor : null;
  }

  private actualizarVinculados() {
    // Vinculados
    this.formVinculados = new FormGroup({});
    this.vinculados.forEach((vinculado, index) => {
      const vinculadoFormGroup = new FormGroup({});
      let option: IGinniOption = null;
      if (vinculado.idPersona) {
        option = {
          value: Number(vinculado.idPersona),
          text: vinculado.descripcion
        };
      }

      vinculadoFormGroup.addControl(CONTROL_VINCULADO, new FormControl(option));
      vinculadoFormGroup.controls[CONTROL_VINCULADO].valueChanges.subscribe((opt: IGinniOption) => {
        if (opt) {
          this.vinculados[index].idPersona = opt.value.toString();
          this.vinculados[index].descripcion = opt.text;
        }
      });
      const idTipoRelacion = vinculado.idTipoRelacion ? vinculado.idTipoRelacion : EMPTY;
      vinculadoFormGroup.addControl(CONTROL_RELACION, new FormControl(idTipoRelacion));
      vinculadoFormGroup.controls[CONTROL_RELACION].valueChanges.subscribe(value => {
        this.vinculados[index].idTipoRelacion = value;
      });
      vinculadoFormGroup.setValidators([this.vinculadosValidate]);

      this.formVinculados.addControl(index.toString(), vinculadoFormGroup);
    });
  }

  public agregarVinculado() {
    if (this.accesoEditar) {
      this.vinculados.push({
        descripcion: ''
      });
      this.actualizarVinculados();
    }
  }

  public eliminarVinculado(indexVinculado) {
    if (this.accesoEditar) {
      this.vinculados = this.vinculados.filter((_v, index) => index !== indexVinculado);
      this.actualizarVinculados();
    }
  }

  private vinculadosValidate(group: FormGroup): { [key: string]: any } {
    const vinculadoControl = group.controls[CONTROL_VINCULADO];
    const relacionControl = group.controls[CONTROL_RELACION];
    let vinculadoError;
    let relacionError;
    if (vinculadoControl.value === null || relacionControl.value === EMPTY) {
      if (vinculadoControl.value === null) {
        vinculadoError = true;
      }
      if (relacionControl.value === EMPTY) {
        relacionError = true;
      }
      return { vinculado: vinculadoError, relacion: relacionError };
    }

    return null;
  }

  public vinculadoInputChange({ value, finish }: IGinniSelectLoadEvent) {
    this.asociadoApiService.obtenerVinculacion(value).subscribe(res => {
      finish(
        res.map(
          (item: IVinculadoBusqueda): IGinniOption => ({
            value: Number(item.idPersona),
            text: item.descripcion
          })
        )
      );
    });
  }

  private estaPorEliminarsePersonaRelacionada() {
    const nuevoEstadoCivil = this.getControl('idEstadoCivil').value;
    const actualEstadoCivilEsCasado = this.esCasadoOConviviente(this.actualEstadoCivil);
    const nuevoEstadoCivilEsCasado = this.esCasadoOConviviente(nuevoEstadoCivil);

    if (nuevoEstadoCivilEsCasado && actualEstadoCivilEsCasado) {
      return false;
    }
    return (
      this.personasRelacionadas &&
      this.personasRelacionadas.length &&
      actualEstadoCivilEsCasado &&
      this.actualEstadoCivil !== nuevoEstadoCivil
    );
  }

  private estaPorCambiarEstadoCasado() {
    if (this.esTipoNatural) {
      const nuevoEstadoCivilId = this.getControl('idEstadoCivil').value;

      if (this.actualEstadoCivil !== nuevoEstadoCivilId) {
        this.modalModificarEvaluacion =
          this.actualEstadoCivil === CLAVE_CASADO || nuevoEstadoCivilId.toString() === CLAVE_CASADO;
      }
    }
  }

  public eliminarPersonaRelacionada() {
    this.enviarActualizarPersonal();
  }

  public guardarForm() {
    if (this.accesoEditar) {
      this.enviadoFormulario = true;

      if (this.form.valid) {
        if (this.esTipoNatural) {
          this.modalEstasSeguroEliminar = true;

          if (this.estaPorEliminarsePersonaRelacionada()) {
            this.modalEstasSeguroEliminar = true;
          } else {
            this.enviarActualizarPersonal();
          }
        } else {
          this.enviarActualizarPersonal();
        }
      }
      this.scrollFirstInvalid.next(true);
    }
  }

  public enviarActualizarPersonal() {
    this.modalEstasSeguroEliminar = false;
    const finalForm = actualizarUppercaseForm(this.form.value);
    const tipoZonaValor = finalForm.direccion.idTipoZona;

    if (tipoZonaValor && tipoZonaValor === 'NULL') {
      finalForm.direccion.idTipoZona = EMPTY;
    }

    finalForm.actividadEconomica = this.convertOpcionToActividad(finalForm.actividadEconomica);

    finalForm.telefonos = this.telefonos.map(tel => {
      return {
        ...tel,
        valor: finalForm.telefonos[tel.indice]
      };
    });

    if (this.esTipoJuridico) {
      const anexo = this.form.get('telefonos').get('anexo').value;

      finalForm.telefonos.map((requerido, index) => {
        if (requerido.id === this.idTelefonoRequerido) {
          finalForm.telefonos[index].anexo = anexo;
        }
      });
    }

    if (this.tipoPersona === TiposPersona.JURIDICO) {
      this.cargandoInformacionPersonal();
      this.asociadoApiService
        .actualizarInformacionAsociado({
          idPersona: this.idPersona,
          body: finalForm
        })
        .subscribe(this.seGuardoExito, this.seGuardoError);
    } else if (this.formVinculados.valid) {
      const groupVinculados = copiarObjeto(this.formVinculados.value);
      finalForm.vinculados = Object.keys(groupVinculados).map(i => {
        const group = groupVinculados[i];
        return {
          idPersona: group.vinculado.value,
          idTipoRelacion: group.relacion
        };
      });
      this.cargandoInformacionPersonal();
      this.asociadoApiService
        .actualizarInformacionPersonal({
          idPersona: this.idPersona,
          body: finalForm
        })
        .subscribe(this.seGuardoExito, this.seGuardoError);
      return;
    }
  }

  private cargandoInformacionPersonal() {
    this.cargandoGuardando = true;
  }

  private seGuardoExito = () => {
    this.cargandoGuardando = false;
    this.guardadoType = NotificationTypeEnum.Success;
    this.guardadoMensaje = AlertMensajes.Success;
    this.estaPorCambiarEstadoCasado();
    this.llamarInformarcionPersonal();
    this.llamarPersonaRelacionadas();
  };

  private seGuardoError = (error: APIError) => {
    this.cargandoGuardando = false;
    this.guardadoMensaje = error.mensaje;
    this.guardadoType = NotificationTypeEnum.Danger;
  };

  private llamarInformarcionPersonal() {
    const payload = {
      idPersona: this.idPersona,
      tipoPersona: this.tipoPersona
    };

    this.appState$.dispatch(new personalAction.LoadAction(payload));
  }

  private llamarPersonaRelacionadas() {
    const payload = {
      idPersona: this.idPersona,
      tipoPersona: normalizarTildes(this.tipoPersona).toLowerCase()
    };

    this.appState$.dispatch(new personasRelacionadasAction.LoadAction(payload));
  }

  public ActividadInputChange({ value, finish }: IGinniSelectLoadEvent) {
    this.asociadoApiService.obtenerActividadEconomica(value).subscribe(res => {
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

  private convertActividadToOpcion(cargo: IActividadEconomica): IGinniOption {
    if (cargo) {
      return {
        text: cargo.descripcion,
        value: Number(cargo.identificador)
      };
    }
    return null;
  }

  private convertOpcionToActividad(option: IGinniOption): IActividadEconomica {
    if (option) {
      return {
        identificador: option.value.toString(),
        descripcion: option.text
      };
    }
  }
}
