import { Component, OnDestroy, OnInit, OnChanges, ViewEncapsulation, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IForm } from 'app/@compartidos/interfaces/form.interface';
import { IProp } from 'app/@compartidos/models/prop.interface';
import { FormElement } from 'app/@compartidos/compartidos.enum';
import { ValidationService } from 'app/@compartidos/utils/validation.service';
import { Validators } from '@angular/forms';
import { Configuracion } from 'app/modulos/portal/@models/configuracion.model';
import { PortalApiService } from 'app/modulos/portal/portal.api.service';
import {
  IInformacionRelevante,
  IObtenerDatosPersona,
  IDireccion
} from '../../@interfaces/datos-persona.interface';
import { ITelefono } from 'app/modulos/logistica-vehicular/detalle/@models/personal.model';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import * as store from 'app/@compartidos/store';
import * as DatosPersonaAction from 'app/modulos/reactivaciones/detalle-resueltos/generacion-contrato/componentes/validacion-datos/@store/obtener-datos-persona.action';
import {
  getDatosPersona,
  getDatosPersonaLoading,
  getDatosPersonaFailed
} from 'app/modulos/reactivaciones/detalle-resueltos/generacion-contrato/componentes/validacion-datos/@store';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { isEmpty } from 'app/@compartidos/utils/helpers';
import { EMPTY } from 'app/@compartidos/utils/consts';

@Component({
  selector: 'ginni-informacion-personal',
  templateUrl: './informacion-personal.component.html',
  styleUrls: ['./informacion-personal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InformacionPersonalComponent implements OnInit, OnChanges, OnDestroy {
  public celulares: ITelefono[] = [];
  public datosPersona: IObtenerDatosPersona;
  public datosPersonales: IForm[];
  public datosDomiciliarios: IDireccion;
  public distritos: IProp[] = [];
  public failed: string;
  public form: FormGroup = this.fb.group({});
  public formInfoRelevante: FormGroup;
  public formDatosDomiciliarios: FormGroup;
  public formularioEnviado = false;
  public formDatosPersonales: FormGroup = this.fb.group({});
  public formDatosPersonalesIsValid: boolean;
  public formDatosDomiciliariosIsValid: boolean;
  private grupoTelefonos: IForm[];
  public informacionRelevante: IInformacionRelevante;
  public mostrarAlerta: boolean;
  public telefonos: ITelefono[];
  public telefonosFijos: ITelefono[] = [];
  public provincias: IProp[] = [];
  private subscriptions: Subscription[] = [];
  public loading: boolean;
  public validForm: boolean;

  public datosPersona$ = this.appState$.select(getDatosPersona);
  public datosPersonaLoading$ = this.appState$.select(getDatosPersonaLoading);
  public datosPersonaFailed$ = this.appState$.select(getDatosPersonaFailed);

  @Input()
  public configuracion: Configuracion;

  @Input()
  public idPersona: number;

  get paises() {
    return this.portalSandbox.paises;
  }

  get departamentos() {
    return this.portalSandbox.departamentos;
  }

  constructor(
    public appState$: Store<store.State>,
    public fb: FormBuilder,
    private portalApiService: PortalApiService,
    private portalSandbox: PortalSandbox,
    public validations: ValidationService
  ) {}

  ngOnChanges() {}

  ngOnInit() {
    this.mostrarAlerta = false;
    this.loading = true;
    this.grupoTelefonos = null;
    this.appState$.dispatch(new DatosPersonaAction.LoadAction(this.idPersona));
    this.registrarEventos();
  }

  ngOnDestroy() {
    this.loading = false;
    this.desregistrarEventos();
  }

  private desregistrarEventos() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private registrarEventos() {
    this.subscriptions.push(
      this.datosPersona$.subscribe((datosPersona: IObtenerDatosPersona) => {
        if (datosPersona) {
          this.datosPersona = datosPersona;
          this.setearTelefonos();
          this.grupoTelefonos = this.crearGrupoTelefonos(this.telefonos, this.validations);
          this.informacionRelevante = this.datosPersona.informacionRelevante;
          this.datosDomiciliarios = this.datosPersona.direccion;
          this.buildForm();
          this.buildDatosPersonales();
          this.formIsValid();
          this.loading = false;
          this.failed = null;
        }
      }),
      this.datosPersonaFailed$.subscribe(failed => {
        if (failed) {
          this.failed = failed;
          this.loading = false;
        }
      }),
      this.datosPersonaLoading$.subscribe((loading: boolean) => {
        this.loading = loading;
      })
    );
  }

  private buildForm() {
    this.formInfoRelevante = this.fb.group({
      pep: [this.informacionRelevante.pep],
      uif: [this.informacionRelevante.uif],
      lavadoActivos: [this.informacionRelevante.lavadoActivos],
      actividadMinera: [this.informacionRelevante.actividadMinera]
    });
    this.formDatosDomiciliarios = this.fb.group(
      {
        idDepartamento: [this.datosDomiciliarios.idDepartamento, Validators.required],
        idProvincia: [this.datosDomiciliarios.idProvincia, Validators.required],
        idDistrito: [this.datosDomiciliarios.idDistrito, Validators.required],
        idTipoZona: [this.datosDomiciliarios.idTipoZona],
        nombreZona: [this.datosDomiciliarios.nombreZona, Validators.maxLength(100)],
        idTipoVia: [this.datosDomiciliarios.idTipoVia, [Validators.required]],
        direccionTexto: [
          this.datosDomiciliarios.direccionTexto,
          [Validators.required, Validators.maxLength(255)]
        ],
        referencia: [this.datosDomiciliarios.referencia, [Validators.maxLength(255)]]
      },
      {
        validator: this.validations.direccionValidation(this.portalSandbox)
      }
    );

    // logica ubigeos
    this.formDatosDomiciliarios.controls['idDepartamento'].valueChanges.subscribe(
      idDepartamento => {
        if (isEmpty(idDepartamento)) {
          this.provincias = [];
          this.distritos = [];
        } else {
          this.formDatosDomiciliarios.get('idProvincia').setValue(EMPTY);
          this.formDatosDomiciliarios.get('idDistrito').setValue(EMPTY);

          this.portalApiService.getComboProvincias(idDepartamento).subscribe(provincias => {
            this.provincias = provincias;
          });
        }
      }
    );

    this.formDatosDomiciliarios.controls['idProvincia'].valueChanges.subscribe(idProvincia => {
      if (isEmpty(idProvincia)) {
        this.distritos = [];
      } else {
        this.formDatosDomiciliarios.controls.idDistrito.setValue(EMPTY);
        const idDepartamento = this.formDatosDomiciliarios.controls['idDepartamento'].value;
        this.portalApiService
          .getComboDistritos(idDepartamento, idProvincia)
          .subscribe(distritos => {
            this.distritos = distritos;
          });
      }
    });

    this.portalApiService
      .getComboProvincias(this.datosDomiciliarios.idDepartamento)
      .subscribe(provincias => {
        this.provincias = provincias;
      });

    this.portalApiService
      .getComboDistritos(
        this.datosDomiciliarios.idDepartamento,
        this.datosDomiciliarios.idProvincia
      )
      .subscribe(distritos => {
        this.distritos = distritos;
      });
  }

  public setearTelefonos() {
    this.telefonosFijos = this.datosPersona.telefonosFijos;
    this.celulares = this.datosPersona.celulares;

    this.telefonosFijos = this.telefonosFijos.filter(
      (fijos, index) => fijos.valor.length > 0 || index === 0
    );
    this.celulares = this.celulares.filter(celular => celular.valor.length > 0);

    this.celulares = this.celulares.map((celular, index) => {
      return { ...celular, indice: `M${index}` };
    });

    this.telefonosFijos = this.telefonosFijos.map((fijo, index) => {
      return { ...fijo, indice: `F${index}` };
    });

    this.telefonos = [...this.telefonosFijos, ...this.celulares];
  }

  public crearGrupoTelefonos = (telefonos: ITelefono[], validations: ValidationService) => {
    const grupo = [];

    const listValidations = [Validators.maxLength(11), validations.validateNumber];

    this.celulares.forEach((item, index) => {
      grupo.push({
        label: `Celular ${index + 1}`,
        formControlName: item.indice,
        value: item.valor,
        element: FormElement.INPUT,
        grillas: 'col-xs-12 col-sm-4 col-md-3',
        maxLength: '11',
        obligatorio: false,
        soloNumeros: true,
        validaciones: listValidations
      });
    });

    // si no existen celulares, se crea al menos uno que será obligatorio
    if (this.celulares.length === 0) {
      grupo.push({
        label: `Celular 1`,
        formControlName: 'M0',
        value: '',
        element: FormElement.INPUT,
        grillas: 'col-xs-12 col-sm-4 col-md-3',
        maxLength: '11',
        obligatorio: true,
        soloNumeros: true,
        validaciones: listValidations.concat([Validators.required])
      });
    }

    this.telefonosFijos.forEach((item, index) => {
      grupo.push({
        label: `Teléfono ${index + 1}`,
        formControlName: item.indice,
        value: item.valor,
        element: FormElement.INPUT,
        grillas: 'col-xs-12 col-sm-4 col-md-3',
        maxLength: '11',
        obligatorio: false,
        soloNumeros: true,
        validaciones: listValidations
      });
    });

    let requerido;

    requerido = telefonos.find((telefono: ITelefono) => {
      return telefono.tipo === 'M';
    });

    // El primero de los tipo M será el obligatorio
    if (requerido) {
      grupo.map((item: IForm, index: number) => {
        if (item.formControlName === requerido.indice) {
          grupo[index].validaciones = listValidations.concat([Validators.required]);
          grupo[index].obligatorio = true;
        }
      });
    }

    return grupo;
  };

  private buildDatosPersonales() {
    const datos1 = [
      {
        label: 'Nombres',
        formControlName: 'nombres',
        maxLength: '8',
        value: this.datosPersona.nombres,
        element: FormElement.TEXT,
        grillas: 'col-xs-12 col-sm-4 col-md-3',
        obligatorio: false,
        validaciones: []
      },
      {
        label: 'Apellido paterno',
        formControlName: 'apePaterno',
        maxLength: '',
        value: this.datosPersona.apePaterno,
        element: FormElement.TEXT,
        grillas: 'col-xs-12 col-sm-4 col-md-3',
        obligatorio: false,
        validaciones: []
      },
      {
        label: 'Apellido materno',
        formControlName: 'apeMaterno',
        maxLength: '',
        value: this.datosPersona.apeMaterno,
        element: FormElement.TEXT,
        grillas: 'col-xs-12 col-sm-4 col-md-3',
        obligatorio: false,
        validaciones: []
      },
      {
        label: '',
        formControlName: '',
        value: '',
        element: FormElement.TEXT,
        grillas: 'col-xs-12 col-sm-4 col-md-3',
        obligatorio: false,
        validaciones: []
      },
      {
        label: 'Tipo de documento',
        formControlName: 'tipoDocumento',
        value: this.datosPersona.tipoDocumento,
        element: FormElement.TEXT,
        grillas: 'col-xs-12 col-sm-4 col-md-3',
        obligatorio: false,
        validaciones: []
      },
      {
        label: 'N° documento',
        formControlName: 'numeroDocumento',
        value: this.datosPersona.numeroDocumento,
        element: FormElement.TEXT,
        grillas: 'col-xs-12 col-sm-4 col-md-3',
        options: [{ clave: '1', valor: 'materno' }, { clave: '2', valor: 'paterno' }],
        obligatorio: false,
        validaciones: []
      },
      {
        label: '',
        formControlName: '',
        value: '',
        element: FormElement.TEXT,
        grillas: 'col-xs-12 col-sm-4 col-md-3',
        obligatorio: false,
        validaciones: []
      },
      {
        label: '',
        formControlName: '',
        value: '',
        element: FormElement.TEXT,
        grillas: 'col-xs-12 col-sm-4 col-md-3',
        obligatorio: false,
        validaciones: []
      }
    ];

    const datos2 = [
      {
        label: '',
        formControlName: '',
        value: '',
        element: FormElement.TEXT,
        grillas: 'col-xs-12 col-sm-4 col-md-3',
        obligatorio: false,
        validaciones: []
      },
      {
        label: 'Correo electrónico',
        formControlName: 'correo',
        value: this.datosPersona.correo,
        element: FormElement.INPUT,
        grillas: 'col-xs-12 col-sm-4 col-md-6',
        obligatorio: true,
        maxLength: '60',
        validaciones: [
          Validators.required,
          this.validations.validateEmail,
          Validators.maxLength(65)
        ]
      },
      {
        label: 'RUC',
        formControlName: 'ruc',
        value: this.datosPersona.ruc,
        element: FormElement.INPUT,
        grillas: 'col-xs-12 col-sm-4 col-md-3',
        obligatorio: false,
        soloNumeros: true,
        maxLength: '11',
        validaciones: [
          Validators.minLength(11),
          Validators.maxLength(11),
          this.validations.validateNumber
        ]
      },
      {
        label: 'Estado civil',
        formControlName: 'idEstadoCivil',
        value: this.datosPersona.idEstadoCivil,
        element: FormElement.SELECT,
        grillas: 'col-xs-12 col-sm-4 col-md-3',
        options: this.configuracion.estadoCivil,
        obligatorio: true,
        validaciones: [Validators.required]
      },
      {
        label: 'Fecha de nacimiento',
        formControlName: 'fechaNacimiento',
        value: this.datosPersona.fechaNacimiento,
        element: FormElement.DATE,
        grillas: 'col-xs-12 col-sm-4 col-md-3',
        obligatorio: true,
        validaciones: [this.validations.fechaNacimiento(18)]
      },
      {
        label: 'Nacionalidad',
        formControlName: 'idPaisNacionalidad',
        value: this.datosPersona.idPaisNacionalidad,
        element: FormElement.SELECT,
        grillas: 'col-xs-12 col-sm-4 col-md-3',
        options: this.paises,
        obligatorio: true,
        validaciones: [Validators.required]
      },
      {
        label: 'Sexo',
        formControlName: 'idSexo',
        value: this.datosPersona.idSexo,
        element: FormElement.SELECT,
        grillas: 'col-xs-12 col-sm-4 col-md-3',
        options: this.configuracion.sexo,
        obligatorio: true,
        validaciones: [Validators.required]
      }
    ];
    this.datosPersonales = [...datos1, ...this.grupoTelefonos, ...datos2];
  }

  public grabar() {
    this.formularioEnviado = true;
    Object.assign(this.form, this.formDatosPersonales);

    this.validForm = this.validarForms();
  }

  public obtenerDatosPersonales(form: FormGroup) {
    this.formDatosPersonales = form;
    const { valid } = this.formDatosPersonales;
    this.formDatosPersonalesIsValid = valid;
  }

  private validarForms() {
    const { valid: validDatosPersonales } = this.formDatosPersonales;
    const { valid: validDatosDomiciliaros } = this.formDatosDomiciliarios;
    return validDatosPersonales && validDatosDomiciliaros ? true : false;
  }

  public formIsValid(): void {
    setTimeout(() => {
      this.validForm = this.validarForms();
      this.mostrarAlerta = true;
    }, 1000);
  }
}
