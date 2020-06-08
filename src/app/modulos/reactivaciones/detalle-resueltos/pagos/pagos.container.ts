import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { BandejaEnum } from '../../bandeja/bandeja.enum';
import { AsociadoDetalleEnum } from '../detalle-resueltos.enum';
import { HistorialDePagoResponse, HistorialPagos } from '../detalle-resueltos.interface';
import { DetalleResueltosService } from '../detalle-resueltos.service';
import { collapseInDownAnimation } from 'app/@compartidos/animations/collapseInDown.animation';
import { APIError } from 'app/@compartidos/models';
import { dateFormat, formatoMoneda } from 'app/@compartidos/utils/helpers';
import { OptionalValidator } from 'app/@compartidos/validators/optional.validator';
import { BandejaService } from 'app/modulos/reactivaciones/bandeja/bandeja.service';
import { PagosModel } from '../@models/pagos.model';

@Component({
  selector: 'ginni-pagos',
  animations: [collapseInDownAnimation],
  styleUrls: ['./pagos.container.scss'],
  templateUrl: './pagos.container.html',
  encapsulation: ViewEncapsulation.None
})
export class PagosComponent implements OnInit {
  public confirmDeleted = false;
  public confirmSave = false;
  public disableSubmit = false;
  public errorDeletePayment = false;
  public errorPayment = false;
  public failedDeletePago: string;
  public failedHistorialDePagos: string;
  public form: FormGroup;
  public formErrors = {
    montoControl: ''
  };
  public historialDePagos: HistorialDePagoResponse;
  public indexPago = null;
  public loadingDeletePago = false;
  public loadingHistorialDePagos = false;
  public paymentSuccess = false;
  public personaIds: string[];
  public showHistorial = true;
  public pago: HistorialPagos;
  public state = {
    accordeon: [],
    item: {}
  };
  public validationMessages = {
    montoControl: {
      required: 'Este campo es obligatorio',
      pattern: 'Este valor es inválido',
      min: 'Este valor es inválido'
    }
  };

  public _dateFormat = dateFormat;
  public _formatoMoneda = formatoMoneda;

  get montoControl() {
    return this.form.get('montoControl') as FormControl;
  }

  constructor(
    private bandejaService: BandejaService,
    private detalleService: DetalleResueltosService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.personaIds = this.bandejaService.personaIds;
    if (this.bandejaService.contratoActual) {
      this.buildForm('');
      this.getHistorialDePago();
    } else {
      this.router.navigate([`${BandejaEnum.Url}`]);
    }
  }

  public buildForm(formValues): void {
    const values = new PagosModel(formValues);
    const controls = {
      montoControl: [values.montoControl, OptionalValidator([Validators.required])]
    };
    this.form = this.formBuilder.group(controls);
    this.form.valueChanges.subscribe(() => this.onValueChanged());
    this.onValueChanges();
  }

  public closeConfirmDeleted() {
    this.confirmDeleted = false;
  }

  public closeConfirmSave() {
    this.confirmSave = false;
  }

  public closeErrorPayment() {
    this.errorPayment = false;
  }

  public closeErrorDeletePayment() {
    this.errorDeletePayment = false;
  }

  public closePaymentSuccess() {
    this.paymentSuccess = false;
    this.loadingHistorialDePagos = true;
    this.getHistorialDePago();
  }

  public delete() {
    this.deleteHistorialDePago();
    this.confirmSave = false;
  }

  public eliminarPago(index: number, estado: boolean, item: HistorialPagos): void {
    if (estado) {
      this.indexPago = index;
      this.pago = item;
      this.confirmSave = true;
    }
  }

  private generateAccordeonState(items: HistorialPagos[]): void {
    items.forEach((item, index) => {
      this.state.item = item;
      this.state.accordeon[index] = false;
    });
  }

  public getHistorialDePago() {
    this.loadingHistorialDePagos = true;
    this.detalleService
      .getHistorialDePago(this.bandejaService.contratoActual.reactivacionContratoID)
      .subscribe(
        historialDePagos => {
          this.loadingHistorialDePagos = false;
          this.historialDePagos = historialDePagos;
          this.generateAccordeonState(this.historialDePagos.historialPagos);
        },
        (error: APIError) => {
          this.loadingHistorialDePagos = false;
          this.failedHistorialDePagos = error.mensaje;
        }
      );
  }

  public deleteHistorialDePago() {
    this.confirmDeleted = true;
    if (this.pago && this.pago.solicitudIdSaf) {
      this.loadingDeletePago = true;
      this.detalleService.deleteHistorialDePago(this.pago.solicitudIdSaf).subscribe(
        () => {
          this.confirmDeleted = !!this.pago.contratoNumero;
          setTimeout(() => {
            this.loadingDeletePago = false;
            this.state.accordeon.splice(this.indexPago, 1);
            this.historialDePagos.historialPagos.splice(this.indexPago, 1);
          }, 1000);
        },
        (error: APIError) => {
          this.confirmDeleted = false;
          setTimeout(() => {
            this.failedDeletePago = error.mensaje;
            this.errorDeletePayment = true;
          }, 1000);
        }
      );
    } else {
      this.errorDeletePayment = true;
    }
  }

  public isPending(estado: string) {
    return estado.toUpperCase() === AsociadoDetalleEnum.Pendiente.toUpperCase();
  }

  public onValueChanged(): void {
    if (!this.form) {
      return;
    }
    const form = this.form;
    Object.keys(this.formErrors).forEach(field => {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && !control.valid && (!control.disabled && control.touched)) {
        const messages = this.validationMessages[field];
        const errors = Object.keys(control.errors).map(key => messages[key]);
        this.formErrors[field] = errors[0];
      }
    });
  }

  private onValueChanges() {
    this.montoControl.valueChanges.subscribe(() => {
      this.disableSubmit = false;
    });
    this.form.valueChanges.subscribe(() => this.onValueChanged());
  }

  public toggleCollapse(index: number): void {
    this.state.accordeon.forEach((item, i) => {
      this.state.item = item;
      this.state.accordeon[i] =
        index === i ? (this.state.accordeon[i] = !this.state.accordeon[i]) : false;
    });
  }

  public toggleHistorial() {
    this.showHistorial = !this.showHistorial;
    if (this.showHistorial) {
      this.getHistorialDePago();
    }
  }

  public submit() {
    this.addOptionalFields();
    this.form.controls.montoControl.markAsTouched();
    if (this.form.get('montoControl').value !== '' && !this.form.get('montoControl').invalid) {
      if (!this.form.valid) {
        return;
      }
      this.paymentSuccess = true;
      this.disableSubmit = true;
      const payload = {
        bdImporte: this.form.get('montoControl').value,
        reactivacionContratoId: this.bandejaService.contratoActual.reactivacionContratoID
      };
      this.detalleService.pagarObligacionACuenta(payload).subscribe(
        () => {
          this.form.get('montoControl').setValue('');
          this.removeOptionalFields();
          this.paymentSuccess = true;
        },
        (error: APIError) => {
          if (error.status !== 422) {
            this.errorPayment = true;
            this.paymentSuccess = false;
          } else {
            this.paymentSuccess = true;
          }
          setTimeout(() => {
            this.form.get('montoControl').setValue('');
            this.removeOptionalFields();
          }, 300);
        }
      );
    }
  }

  private addOptionalFields() {
    this.montoControl.setValidators([
      Validators.required,
      Validators.pattern(/^(\d{1,5}|\d{0,5}\.\d{1,2})$/),
      Validators.min(0.01)
    ]);
    this.montoControl.updateValueAndValidity({ onlySelf: true, emitEvent: false });
  }

  private removeOptionalFields() {
    this.montoControl.clearValidators();
    this.montoControl.updateValueAndValidity();
  }
}
