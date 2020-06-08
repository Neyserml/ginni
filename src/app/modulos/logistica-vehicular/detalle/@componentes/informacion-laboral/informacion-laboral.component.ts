import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { ICargoOcupacion } from 'app/modulos/logistica-vehicular/detalle/@models/editar.interface';
import { IInformacionLaboralResponse } from 'app/modulos/logistica-vehicular/detalle/@models/laboral.model';
import { getLaboral } from 'app/modulos/logistica-vehicular/detalle/@store';
import * as laboralAction from 'app/modulos/logistica-vehicular/detalle/@store/laboral.action';
import { DetalleApiService } from 'app/modulos/logistica-vehicular/detalle/detalle-api.service';
import { NO_REMUNERADO } from 'app/modulos/logistica-vehicular/detalle/detalle.enum';
import {
  IGinniSelectLoadEvent,
  IGinniOption
} from 'app/@compartidos/components/select/select.component';
import { IProp, APIError } from 'app/@compartidos/models';
import * as store from 'app/@compartidos/store';
import { EMPTY } from 'app/@compartidos/utils/consts';
import {
  isEmpty,
  actualizarUppercaseForm,
  desactivarControles,
  activarControles
} from 'app/@compartidos/utils/helpers';
import { ValidationService } from 'app/@compartidos/utils/validation.service';
import { Configuracion } from 'app/modulos/portal/@models/configuracion.model';
import { PortalApiService } from 'app/modulos/portal/portal.api.service';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { AlertMensajes } from 'app/@compartidos/compartidos.enum';
import { NotificationTypeEnum } from 'app/@compartidos/services/notification-type.enum';

@Component({
  selector: 'ginni-informacion-laboral',
  templateUrl: './informacion-laboral.component.html',
  styles: []
})
export class InformacionLaboralComponent implements OnInit, OnDestroy {
  public cargandoGuardando = false;
  public enviadoFormulario = false;
  public idNoRemunerado: string;
  public desactivarUbigeo: boolean;
  public distritos: IProp[] = [];
  public guardadoMensaje: string;
  public guardadoType: string;
  public scrollFirstInvalid = new Subject();

  public laboral$ = this.appState$.select(getLaboral);
  public laboral: IInformacionLaboralResponse;
  public provincias: IProp[] = [];

  @Input()
  public accesoEditar: boolean;
  @Input()
  public configuracion: Configuracion;
  @Input()
  public idPersona: string;

  public form: FormGroup;
  public contacto;
  public direccion;

  public subscriptions: Subscription[] = [];

  public get departamentos() {
    return this.portalSandbox.departamentos;
  }

  constructor(
    public fb: FormBuilder,
    public appState$: Store<store.State>,
    private portalSandbox: PortalSandbox,
    private asociadoApiService: DetalleApiService,
    private portalApiService: PortalApiService,
    private validations: ValidationService
  ) {}

  ngOnInit() {
    this.appState$.dispatch(new laboralAction.LoadAction(this.idPersona));
    this.registrarEventos();
  }

  ngOnDestroy() {
    this.desregistrarEventos();
  }

  public registrarEventos() {
    this.subscriptions.push(
      this.laboral$.subscribe(laboral => {
        if (laboral) {
          this.noRemunerado();
          this.actualizarFormulario(laboral);
          this.laboral = laboral;
        }
      })
    );
  }

  private noRemunerado() {
    if (this.configuracion.tipoTrabajador) {
      this.idNoRemunerado = this.configuracion.tipoTrabajador.getClave(NO_REMUNERADO);
    }
  }

  public seSeleccionNoRemunerado(): boolean {
    if (this.form) {
      const id = this.form.controls['idTipoTrabajador'].value;
      return id && id.toString() === this.idNoRemunerado;
    }
    return false;
  }

  public bloquearUbigeos = group => {
    if (!this.seSeleccionNoRemunerado()) {
      return this.validations.direccionValidation(this.portalSandbox)(group);
    }
  };

  public bloqueoNoRemunerado = () => {
    if (this.seSeleccionNoRemunerado()) {
      desactivarControles(this.form, [
        'fechaIngresoTrabajo',
        'centroTrabajo',
        'contacto',
        'estadoPEP'
      ]);
      desactivarControles(this.direccion, [
        'idTipoZona',
        'nombreZona',
        'idTipoVia',
        'direccionTexto',
        'referencia'
      ]);
      this.desactivarUbigeo = false;
    } else {
      activarControles(this.form, [
        'fechaIngresoTrabajo',
        'centroTrabajo',
        'contacto',
        'estadoPEP'
      ]);
      activarControles(this.direccion, [
        'idTipoZona',
        'nombreZona',
        'idTipoVia',
        'direccionTexto',
        'referencia'
      ]);
      this.desactivarUbigeo = true;
    }
  };

  public desregistrarEventos() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public actualizarFormulario(laboral: IInformacionLaboralResponse) {
    const direccion = laboral.direccion;
    const contacto = laboral.contacto;
    this.form = this.fb.group({
      centroTrabajo: [laboral.centroTrabajo, [Validators.required, Validators.maxLength(65)]],
      cargoOcupacion: [this.convertCargoToOpcion(laboral.cargoOcupacion), Validators.required],
      idTipoTrabajador: [laboral.idTipoTrabajador, [Validators.required]],
      fechaIngresoTrabajo: [laboral.fechaIngresoTrabajo, this.validations.fechaMaximaActual],
      estadoPEP: [laboral.estadoPEP],
      direccion: this.fb.group(
        {
          idDepartamento: [direccion.idDepartamento],
          idProvincia: [direccion.idProvincia],
          idDistrito: [direccion.idDistrito],
          idTipoZona: [direccion.idTipoZona],
          nombreZona: [direccion.nombreZona, [Validators.maxLength(100)]],
          idTipoVia: [direccion.idTipoVia, [Validators.required]],
          direccionTexto: [
            direccion.direccionTexto,
            [Validators.required, Validators.maxLength(255)]
          ],
          referencia: [direccion.referencia, [Validators.maxLength(255)]]
        },
        {
          validator: [this.bloquearUbigeos]
        }
      ),
      contacto: this.fb.group({
        idTelefono: [contacto.idTelefono],
        numeroTelefono: [contacto.numeroTelefono, [Validators.required, Validators.maxLength(11)]],
        anexo: [contacto.anexo, [Validators.maxLength(5), this.validations.validateNumber]],
        correoElectronico: [
          contacto.correoElectronico,
          [this.validations.validateEmail, Validators.maxLength(65)]
        ]
      })
    });

    this.direccion = this.form.controls['direccion'];
    this.contacto = this.form.controls['contacto'];
    const controls = this.form.controls;

    const formDireccion: any = controls['direccion'];
    const { controls: direccionControl } = formDireccion;

    const idDepartamentoValue = direccionControl.idDepartamento.value;

    if (!idDepartamentoValue) {
      this.provincias = [];
      this.distritos = [];
    }

    const idTipoTrabajador = this.form.controls.idTipoTrabajador;

    idTipoTrabajador.valueChanges.subscribe(this.bloqueoNoRemunerado);
    this.bloqueoNoRemunerado();

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
    return this.enviadoFormulario && this.getControl(...ids).errors;
  }

  public getControlSelectedError(id, error) {
    const errors = this.getControlError(id);
    if (errors) {
      return errors[error];
    }
    return null;
  }

  public guardarForm() {
    if (this.accesoEditar) {
      this.scrollFirstInvalid.next(true);
      this.enviadoFormulario = true;

      const cargoOcupacionControl = this.form.controls['cargoOcupacion'];
      const cargoOcupacionValue = cargoOcupacionControl.value;

      if (cargoOcupacionValue && !cargoOcupacionValue.text) {
        this.form.controls['cargoOcupacion'].setErrors([{ vacio: true }]);
      }

      if (this.form.valid) {
        const finalForm = actualizarUppercaseForm(this.form.value);

        finalForm.cargoOcupacion = this.convertOpcionToCargo(finalForm.cargoOcupacion);

        finalForm.estadoAM = this.laboral.estadoAM;
        finalForm.estadoPLA = this.laboral.estadoPLA;
        finalForm.estadoUIF = this.laboral.estadoUIF;
        this.cargandoGuardando = true;
        this.asociadoApiService
          .actualizarInformacionLaboral({
            idPersona: this.idPersona,
            body: finalForm
          })
          .subscribe(
            () => {
              this.cargandoGuardando = false;
              this.guardadoMensaje = AlertMensajes.Success;
              this.guardadoType = NotificationTypeEnum.Success;
            },
            (error: APIError) => {
              this.cargandoGuardando = false;
              this.guardadoMensaje = error.mensaje;
              this.guardadoType = NotificationTypeEnum.Danger;
            }
          );
      }
    }
  }
}
