import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormArray, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import Big from 'big.js';
import { Subscription } from 'rxjs/Subscription';

import * as store from 'app/@compartidos/store';
import {
  getIngresos,
  getIngresosFailed,
  getPersonasRelacionadas
} from 'app/modulos/logistica-vehicular/detalle/@store';
import * as ingresosAction from 'app/modulos/logistica-vehicular/detalle/@store/ingresos.action';
import { DetalleApiService } from 'app/modulos/logistica-vehicular/detalle/detalle-api.service';
import {
  IIngresos,
  IngresoResponse
} from 'app/modulos/logistica-vehicular/detalle/@models/ingresos.model';
import { ValidationService } from 'app/@compartidos/utils/validation.service';
import { IProp } from 'app/@compartidos/models/prop.interface';
import { normalizarTildes, actualizarUppercaseForm } from 'app/@compartidos/utils/helpers';
import { APIError } from 'app/@compartidos/models/api-error.model';
import { EMPTY } from 'app/@compartidos/utils/consts';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { ConfiguracionEvaluacionCrediticia } from 'app/modulos/portal/@models/configuracion.model';
import { TITULAR, INGRESO_PRINCIPAL } from 'app/modulos/logistica-vehicular/detalle/detalle.enum';
import { SIMBOLO_SOL } from 'app/@compartidos/compartidos.enum';
import { NotificationTypeEnum } from 'app/@compartidos/services/notification-type.enum';

@Component({
  selector: 'ginni-ingresos',
  templateUrl: './ingresos.component.html',
  styleUrls: ['./ingresos.component.scss']
})
export class IngresosComponent implements OnInit, OnDestroy {
  @Input() configuracion;
  @Input() configuracionEvaluacionCrediticia: ConfiguracionEvaluacionCrediticia;
  @Input() seEdita: boolean;
  @Input() idPersona;
  @Input() garanteORespaldo: IProp;
  @Input()
  public accesoEditar: boolean;

  // Observadores
  public ingresos$ = this.appState$.select(getIngresos);
  public ingresosFailed$ = this.appState$.select(getIngresosFailed);
  public personasRelacionadas$ = this.appState$.select(getPersonasRelacionadas);
  public subscriptions: Subscription[] = [];

  // Formulario
  public formIngresos: FormArray;

  private clavePareja: string;
  private changeTimeout;
  public disabled: boolean;
  public guardadoMensaje: string;
  public guardadoType: string;
  private idOrigenIngresoTitular: string;
  private idIngresoPrincipal: string;
  public indexIngresoEliminar: number = null;
  public indexIngresoForm: number;
  public ingresos: IIngresos[] = [];
  public ingresosDolares: number[] = [];
  public listaOrigen: IProp[] = [];
  public tipoRelacion: string;
  public sinIngresoTitular = false;
  private _garanteORespaldo: string;
  private _valorPareja: string;
  public totalIngreso: any = 0;

  constructor(
    public portalSandbox: PortalSandbox,
    private appState$: Store<store.State>,
    private asociadoApiService: DetalleApiService,
    private fb: FormBuilder,
    private validations: ValidationService
  ) {}

  ngOnInit() {
    this.idIngresoPrincipal = this.configuracion.ingresoEconomico.getClave(INGRESO_PRINCIPAL);
    if (this.garanteORespaldo) {
      this.idOrigenIngresoTitular = this.garanteORespaldo.clave;
      this._garanteORespaldo = this.garanteORespaldo.valor;
    } else {
      this._garanteORespaldo = EMPTY;
      this.idOrigenIngresoTitular = this.configuracion.origenIngreso.getClave(TITULAR);
    }
    this.obtenerIngresos();
    this.registrarEventos();
    this.actualizarFormulario();
  }

  ngOnDestroy() {
    this.desregistrarEventos();
  }

  public obtenerIngresos() {
    const payload = {
      idPersona: this.idPersona,
      garanteORespaldo: this._garanteORespaldo
    };
    this.appState$.dispatch(new ingresosAction.LoadAction(payload));
  }

  private registrarEventos() {
    this.subscriptions.push(
      this.asociadoApiService.garanteEsSoltero.subscribe(esSoltero => {
        if (esSoltero) {
          this._valorPareja = null;
          this.clavePareja = null;
          this.obtenerIngresos();
          this.actualizarFormulario();
        }
      }),
      this.ingresos$.subscribe(ingresos => {
        if (ingresos) {
          if (ingresos.length) {
            this.ingresos = ingresos;
            const titular = ingresos.filter(ingreso => {
              return ingreso.idOrigen.toString() === this.idOrigenIngresoTitular;
            });
            if (!titular || titular.length === 0) {
              this.sinIngresoTitular = true;
              this.nuevoIngresoObjeto(this.idOrigenIngresoTitular, this.idIngresoPrincipal, true);
            } else {
              this.sinIngresoTitular = false;
            }
            this.actualizarFormulario();
            this.calculoTotalIngresos();
          } else {
            this.ingresos = [];
            this.nuevoIngresoObjeto(this.idOrigenIngresoTitular, this.idIngresoPrincipal, true);
            // Para otros usuarios mostrar 0.00 solo por un tema visual
            if (!this.accesoEditar) {
              this.ingresos[0].ingresoMensualNeto.monto = '0.00';
            }
            this.actualizarFormulario();
          }
        }
      }),
      this.ingresosFailed$.subscribe((error: APIError) => {
        if (error) {
          this.guardadoMensaje = error.mensaje;
          this.guardadoType = NotificationTypeEnum.Danger;
          this.disabled = true;
        }
      }),
      this.personasRelacionadas$.subscribe(personaRelacionada => {
        if (personaRelacionada) {
          if (personaRelacionada.length > 0) {
            this.tipoRelacion = personaRelacionada[0].tipoRelacion;
            const idRelacion = personaRelacionada[0].idRelacion;
            this.asociadoApiService
              .obtenerPersonasRelacionadaPorIdRelacion(idRelacion)
              .subscribe(relacionado => {
                if (relacionado) {
                  if (relacionado.aportaIngresos) {
                    this._valorPareja = this.configuracion.tipoRelacion.getValor(
                      relacionado.idTipoRelacion.toString()
                    );
                    this.clavePareja = this._valorPareja;
                    this.obtenerIngresos();
                    this.actualizarFormulario();
                  } else {
                    this._valorPareja = null;
                    this.clavePareja = null;
                    this.obtenerIngresos();
                    this.actualizarFormulario();
                  }
                }
              });
          } else {
            if (this.accesoEditar) {
              this._valorPareja = null;
              this.clavePareja = null;
              this.obtenerIngresos();
              this.actualizarFormulario();
            }
          }
        }
      })
    );
  }

  public actualizarFormulario() {
    this.listaOrigen = [];
    if (this._valorPareja) {
      if (this.garanteORespaldo) {
        this.listaOrigen = this.configuracion.origenIngreso.filter(origen => {
          return origen.valor === this.clavePareja.toUpperCase();
        });
        this.listaOrigen.push(this.garanteORespaldo);
      } else {
        this.listaOrigen = this.configuracion.origenIngreso.filter(origen => {
          return origen.valor === this.clavePareja.toUpperCase() || origen.valor === TITULAR;
        });
      }
    } else {
      if (this.garanteORespaldo) {
        this.listaOrigen = this.configuracionEvaluacionCrediticia.tipoRespaldoNatural.filter(
          origen => {
            return origen.valor === this.garanteORespaldo.valor;
          }
        );
      } else {
        this.listaOrigen = this.configuracion.origenIngreso.filter(origen => {
          return origen.valor === TITULAR;
        });
      }
    }

    this.formIngresos = this.fb.array(
      this.ingresos.map(ingresoResponse => {
        const ingreso = new IngresoResponse(ingresoResponse);

        const ingresoMensualNeto = ingreso.ingresoMensualNeto;
        const controls = {
          idOrigen: [ingreso.idOrigen, [Validators.required]],
          idTipoIngreso: [ingreso.idTipoIngreso, [Validators.required]],
          fuente: [ingreso.fuente, [Validators.minLength(1), Validators.maxLength(255)]],
          ingresoMensualNeto: this.fb.group({
            idMoneda: [ingresoMensualNeto.idMoneda, [Validators.required]],
            monto: [
              ingresoMensualNeto.monto,
              [Validators.required, this.validations.validateNumber, this.validations.validateMonto]
            ]
          })
        };

        // Cuando se llama al get y existe el ingreso
        if (ingreso.idIngreso) {
          controls['idIngreso'] = [ingreso.idIngreso];
        }

        return this.fb.group(controls);
      })
    );

    if (this.formIngresos.valid) {
      this.disabled = false;
    } else {
      this.disabled = true;
    }
  }

  public attrDisabled(ingresos) {
    const { idIngreso } = ingresos.value;
    if (idIngreso || this.sinIngresoTitular) {
      return idIngreso || this.sinIngresoTitular;
    }
  }

  public changeForm(index, tipoMoneda = null) {
    this.indexIngresoForm = index;
    this.controlsValueChange(index);
    if (!tipoMoneda) {
      this.mensajeErrorIngreso(index);
    }
    this.ejecutarServicio(index);
  }

  public keyupForm(index: number, esMonto: boolean, event) {
    const actualFormIngreso = this.formIngresos.controls[index];

    if (esMonto) {
      const valor = event.target.value;
      if (!valor) {
        actualFormIngreso
          .get('ingresoMensualNeto')
          .get('monto')
          .setValue('');
      }
    }

    this.indexIngresoForm = index;
    this.ejecutarServicio(index);
  }

  private controlsValueChange(index) {
    const actualFormIngreso = this.formIngresos.controls[index];
    actualFormIngreso.get('idOrigen').valueChanges.subscribe(() => {
      actualFormIngreso.get('idTipoIngreso').setValue(EMPTY);
    });
  }

  private mensajeErrorIngreso(index) {
    const idOrigenSeleccionado = this.formIngresos.value[index].idOrigen;
    const idTipoIngresoSeleccionado = this.formIngresos.value[index].idTipoIngreso;
    this.mensajeErrorMaximoIngresos(index);
    if (idOrigenSeleccionado && idTipoIngresoSeleccionado) {
      this.formIngresos.value.map(ingreso => {
        if (
          ingreso.idIngreso &&
          idOrigenSeleccionado === ingreso.idOrigen &&
          idTipoIngresoSeleccionado === ingreso.idTipoIngreso
        ) {
          this.formIngresos.controls[index]
            .get('idTipoIngreso')
            .setErrors({ ingresoRepetido: true });
        }
      });
    }
  }

  private mensajeErrorMaximoIngresos(index) {
    let titular = 0;
    let pareja = 0;
    this.formIngresos.value.map(ingreso => {
      if (ingreso.idOrigen === this.idOrigenIngresoTitular) {
        titular++;
      } else {
        pareja++;
      }
    });

    if (titular > 3 || pareja > 3) {
      this.formIngresos.controls[index].get('idOrigen').setErrors({ origenMaximo: true });
    }
  }

  public ejecutarServicio(index) {
    clearTimeout(this.changeTimeout);
    if (this.formIngresos) {
      this.changeTimeout = setTimeout(() => {
        this.serviciosPUTyPOST(index);
      }, 1000);
    }
  }

  public serviciosPUTyPOST(index) {
    if (this.accesoEditar) {
      const ingresoForm = this.formIngresos.controls[index];
      if (ingresoForm) {
        const { valid, value } = ingresoForm;
        if (valid) {
          value['idOrigen'] = Number(value['idOrigen']);
          value['idTipoIngreso'] = Number(value['idTipoIngreso']);
          const ingresoMensualNeto = value['ingresoMensualNeto'];
          ingresoMensualNeto.idMoneda = Number(ingresoMensualNeto.idMoneda);
          ingresoMensualNeto.monto = Number(value['ingresoMensualNeto'].monto).toFixed(2);

          if (value.idIngreso) {
            this.actualizarIngreso(actualizarUppercaseForm(value));
          } else {
            this.registrarIngreso(actualizarUppercaseForm(value));
          }
        }
      }
    }
  }

  private registrarIngreso(value) {
    this.asociadoApiService.registrarIngreso(this.idPersona, value).subscribe(
      () => {
        this.obtenerIngresos();
      },
      (error: APIError) => {
        if (error) {
          this.guardadoMensaje = error.mensaje;
          this.guardadoType = NotificationTypeEnum.Danger;
          this.disabled = true;
        }
      }
    );
  }

  private actualizarIngreso(idIngreso) {
    this.asociadoApiService.actualizarIngreso(this.idPersona, idIngreso).subscribe(
      res => {
        this.obtenerIngresos();
        return res;
      },
      (error: APIError) => {
        if (error) {
          this.guardadoMensaje = error.mensaje;
          this.guardadoType = NotificationTypeEnum.Danger;
        }
      }
    );
  }

  public nuevoIngresoObjeto(idOrigen, idTipoIngreso, readOnly = false) {
    const newObj = {
      idIngreso: null,
      idOrigen,
      readOnly,
      idTipoIngreso,
      fuente: '',
      ingresoMensualNeto: {
        idMoneda: 2,
        monto: ''
      }
    };

    if (!this.accesoEditar) {
      newObj.ingresoMensualNeto.monto = '0.00';
    }

    this.ingresos.push(new IngresoResponse(newObj));
  }

  public nuevoIngreso(idOrigen = null) {
    if (this.accesoEditar) {
      if (idOrigen) {
        idOrigen = this.configuracion.origenIngreso.find(
          origen =>
            normalizarTildes(origen.valor).toUpperCase() ===
            normalizarTildes(idOrigen.valor).toUpperCase()
        ).clave;
      }
      if (this.formIngresos.valid) {
        this.nuevoIngresoObjeto(idOrigen, null, null);
        this.actualizarFormulario();
      }
    }
  }

  public filaAEliminar() {
    const eliminarIngresoForm = this.formIngresos.controls[this.indexIngresoEliminar];
    const idIngreso = eliminarIngresoForm.value.idIngreso;

    if (idIngreso) {
      const payload = {
        idPersona: this.idPersona,
        idIngreso: idIngreso
      };
      this.ingresosDolares.splice(this.indexIngresoEliminar, 1);

      this.eliminarIngreso(payload);
    } else {
      this.ingresos.splice(this.indexIngresoEliminar, 1);
      this.actualizarFormulario();
    }
  }

  public mostrarMensajeAlerta(index) {
    if (this.accesoEditar) {
      if (index >= 0) {
        this.indexIngresoEliminar = index;
      }
    }
  }

  public obtenerIngresoDolar(index, control) {
    const { idMoneda, monto } = control;
    this.changeForm(index, idMoneda);
    if (idMoneda.value && monto.value) {
      const valorMoneda = this.obtenerValorTipoMoneda(idMoneda.value.toString());
      const tipoCambio = new Big(this.configuracion.tipoCambio);
      const montoMoneda = new Big(monto.value);
      const montoDolares = montoMoneda.div(tipoCambio).toFixed(2);
      this.ingresosDolares[index] = valorMoneda === SIMBOLO_SOL ? montoDolares : montoMoneda;

      this.calculoTotalIngresos();
    }
    return 0;
  }

  private obtenerValorTipoMoneda(moneda) {
    return this.configuracion.tipoMoneda.getValor(moneda);
  }

  public calculoTotalIngresos = () => {
    const ingresosForm = this.formIngresos.controls;
    if (ingresosForm.length !== 0) {
      this.totalIngreso = ingresosForm
        .map((ingresoGroup: FormGroup, index) => {
          const controls = ingresoGroup.controls;

          const montoOrigen = controls.ingresoMensualNeto['controls']['monto'].value.toString();

          if (montoOrigen.split('.').length > 2) {
            const nuevoMonto = montoOrigen.slice(0, -1) + '';
            controls.ingresoMensualNeto['controls']['monto'].setValue(nuevoMonto);
          }

          const { monto, idMoneda } = controls.ingresoMensualNeto['controls'];
          const tipoCambio = new Big(this.configuracion.tipoCambio);
          if (monto.value && monto.value.toString().length > 0 && monto.value[0] !== '.') {
            const montoIngresos = new Big(monto.value);
            const valorMoneda = this.obtenerValorTipoMoneda(idMoneda.value.toString());

            this.ingresosDolares[index] =
              valorMoneda === SIMBOLO_SOL
                ? montoIngresos.div(tipoCambio).toFixed(2)
                : montoIngresos.toFixed(2);

            return Number(this.ingresosDolares[index]);
          }

          return (this.ingresosDolares[index] = 0);
        })
        .reduce(function(previous, current) {
          return previous + current;
        });

      this.totalIngreso = this.totalIngreso.toFixed(2);
    }
  };

  private eliminarIngreso(payload) {
    this.asociadoApiService.eliminarIngreso(payload).subscribe(
      () => {
        this.obtenerIngresos();
      },
      (error: APIError) => {
        this.guardadoMensaje = error.mensaje;
        this.guardadoType = NotificationTypeEnum.Danger;
      }
    );
  }

  public desregistrarEventos() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
