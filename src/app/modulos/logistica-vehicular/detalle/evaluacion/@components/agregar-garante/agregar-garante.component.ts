import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  EventEmitter,
  Output,
  Input
} from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import * as store from 'app/@compartidos/store';
import { ArrayProp } from 'app/@compartidos/models/prop.interface';
import { ValidationService } from 'app/@compartidos/utils/validation.service';
import { EMPTY } from 'app/@compartidos/utils/consts';
import { DNI, CARNET_EXTRANJERIA } from 'app/@compartidos/compartidos.enum';
import { IDocumentosPersonas } from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/documentos-personas.interface';
import { getLocalidades } from 'app/modulos/portal/@store/index';
import * as localidadesAction from 'app/modulos/portal/@store/localidades.action';
import {
  ConfiguracionEvaluacionCrediticia,
  Configuracion
} from 'app/modulos/portal/@models/configuracion.model';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import * as buscarRespaldoAction from 'app/modulos/logistica-vehicular/detalle/evaluacion/@store/buscar-respaldo.action';
import {
  getBuscarRespaldo,
  getBuscarRespaldoFailed,
  getBuscarRespaldoLoading
} from 'app/modulos/logistica-vehicular/detalle/evaluacion/@store';
import {
  IGaranteDetalle,
  IBuscarGarante
} from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/garante.interface';
import { EvaluacionApiService } from 'app/modulos/logistica-vehicular/detalle/evaluacion/evaluacion-api.service';
import { TiposPersona } from 'app/modulos/logistica-vehicular/detalle/detalle.enum';
import { isNullOrUndefined } from 'util';
import { activarControles, desactivarControles } from 'app/@compartidos/utils/helpers';

@Component({
  selector: 'ginni-agregar-garante',
  templateUrl: './agregar-garante.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})
export class AgregarGaranteComponent implements OnInit, OnDestroy {
  public listaTiposGarante: ArrayProp;
  public listaTipoDocumento: ArrayProp;
  private tipoDocumento: AbstractControl;
  public esSoloNumeros: boolean;
  public formError: boolean;
  public loading: boolean;
  public numeroDocumentoValor;
  public tipoDocumentoValor;
  public existeGarante: boolean;
  public idTipoRelacion;
  public mensajeError: string;
  public personaRepetida: IDocumentosPersonas;

  @Output()
  public volverConsultar: EventEmitter<boolean> = new EventEmitter();

  @Output()
  public garante = new EventEmitter();

  @Input()
  public editarGarante: IDocumentosPersonas;

  @Input()
  public informacionAsociado;

  @Input()
  public configuracionEvaluacionCrediticia: ConfiguracionEvaluacionCrediticia;

  @Input()
  public configuracion: Configuracion;

  @Input()
  public documentosPersonas;

  @Input()
  public accionGarante: string;

  @Input()
  public idBloqueContrato: string;

  // Formulario
  public form: FormGroup;
  public subscriptions: Subscription[] = [];

  // Observadores
  public localidades$ = this.appState$.select(getLocalidades);
  public buscarRespaldo$ = this.appState$.select(getBuscarRespaldo);
  public buscarRespaldoFailed$ = this.appState$.select(getBuscarRespaldoFailed);
  public buscarRespaldoLoading$ = this.appState$.select(getBuscarRespaldoLoading);
  public mensajesSistema: { mensaje: string[]; esLegal?: boolean } = { mensaje: [] };
  public modalAlerta: boolean;

  constructor(
    public fb: FormBuilder,
    public portalSandbox: PortalSandbox,
    private evaluacionApiService: EvaluacionApiService,
    private validations: ValidationService,
    public appState$: Store<store.State>
  ) {}

  ngOnInit() {
    this.existeGarante = true;
    this.appState$.dispatch(new localidadesAction.LoadPaisesAction());
    this.appState$.dispatch(new localidadesAction.LoadDepartametoAction());

    this.obtenerDatosPersona();
    this.filtrarTipoDocumento();
    this.modalAlerta = false;
    this.inicializarForm();
    this.validarEditarGarante();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.appState$.dispatch(new buscarRespaldoAction.ResetAction());
  }

  private registrarEventos() {
    this.subscriptions.push(
      this.buscarRespaldo$.subscribe((garante: IGaranteDetalle) => {
        this.loading = true;
        const { numeroDocumento, tipoDocumento, idTipoRelacion } = this.form.value;

        if (garante) {
          const esLegal = garante.esLegal;
          this.evaluacionApiService.mensajesSistemas = garante.mensajesAlertas;
          this.mensajesSistema.mensaje = garante.mensajesAlertas;
          if (garante.mensajesAlertas.length > 0 && isNullOrUndefined(this.editarGarante)) {
            this.modalAlerta = true;
            this.mensajesSistema.esLegal = esLegal;
          }
          if (esLegal) {
            this.activarODesactivarFormDocumento(true);
            this.existeGarante = true;
          } else {
            this.activarODesactivarFormDocumento();
            this.existeGarante = false;
          }

          this.form.get('numeroDocumento').setValue(numeroDocumento);
          this.loading = false;
          this.mensajeError = '';

          const payload = {
            ...garante,
            numeroDocumento,
            tipoDocumento,
            idTipoRelacion
          };
          this.garante.emit(payload);
        }
      }),
      this.buscarRespaldoFailed$.subscribe((error: string) => {
        if (error) {
          this.loading = false;
          this.mensajeError = error;
        }
      })
    );
  }

  private inicializarForm() {
    this.form = this.fb.group({
      idTipoRelacion: ['', Validators.required],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required]
    });

    this.tipoDocumento = this.form.get('tipoDocumento');
    this.seleccionarDocumento();
  }

  private obtenerDatosPersona() {
    const tipoPersona = this.informacionAsociado.tipoPersona;
    if (tipoPersona === TiposPersona.NATURAL) {
      this.listaTiposGarante = this.configuracionEvaluacionCrediticia.tipoRespaldoNatural;
    } else {
      this.listaTiposGarante = this.configuracionEvaluacionCrediticia.tipoRespaldoJuridico;
    }
  }

  private filtrarTipoDocumento() {
    this.listaTipoDocumento = this.configuracion.tipoDocumento.filter(
      documento => documento.valor === DNI || documento.valor === CARNET_EXTRANJERIA
    );
  }

  public seleccionarDocumento() {
    const controls = this.form.controls;
    this.tipoDocumento.valueChanges.subscribe(id => {
      const tipo = this.configuracion.tipoDocumento.getValor(id);
      const controlNumeroDocumento = controls['numeroDocumento'];
      controlNumeroDocumento.setValue(EMPTY);
      let validaciones;
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
      controlNumeroDocumento.setValidators(validaciones);
    });
  }

  private validarNuevoRespaldo(numeroDocumento: string, idTipoDocumento: string) {
    if (this.documentosPersonas && this.documentosPersonas.seAgrega) {
      this.documentosPersonas.documentos.forEach(documento => {
        if (
          documento.numeroDocumento === numeroDocumento &&
          idTipoDocumento === documento.idTipoDocumento
        ) {
          this.personaRepetida = documento;
          this.form.get('numeroDocumento').setErrors({ repetido: true });
        }
      });
    }
  }

  public buscarRespaldo(form: FormGroup) {
    const { tipoDocumento, numeroDocumento } = this.form.value;

    if (this.documentosPersonas) {
      this.validarNuevoRespaldo(numeroDocumento, tipoDocumento);
    }

    this.formError = true;

    if (form.valid) {
      this.loading = true;
      this.formError = false;
      const payload: IBuscarGarante = {
        tipoDocumento,
        numeroDocumento,
        idBloqueContrato: this.idBloqueContrato
      };
      this.appState$.dispatch(new buscarRespaldoAction.LoadAction(payload));

      this.registrarEventos();
    }
  }

  public activarODesactivarFormDocumento = (activar = false) => {
    if (activar) {
      activarControles(this.form, ['idTipoRelacion', 'tipoDocumento', 'numeroDocumento']);
    } else {
      desactivarControles(this.form, ['idTipoRelacion', 'tipoDocumento', 'numeroDocumento']);
    }
  };

  public validarEditarGarante() {
    if (!isNullOrUndefined(this.editarGarante)) {
      this.form.controls.idTipoRelacion.setValue(
        this.listaTiposGarante
          .filter(re => re.valor === this.editarGarante.tipo)
          .map(prop => prop.clave)[0]
      );
      this.form.controls.tipoDocumento.setValue(this.editarGarante.idTipoDocumento);
      this.form.controls.numeroDocumento.setValue(this.editarGarante.numeroDocumento);
      this.buscarRespaldo(this.form);
    }
  }
}
