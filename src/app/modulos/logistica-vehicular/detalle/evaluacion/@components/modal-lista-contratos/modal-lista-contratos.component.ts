import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnDestroy
} from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { APIError } from 'app/@compartidos/models/api-error.model';
import { formatoMoneda } from 'app/@compartidos/utils/helpers';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { EvaluacionApiService } from 'app/modulos/logistica-vehicular/detalle/evaluacion/evaluacion-api.service';
import { ModalContratos } from 'app/modulos/logistica-vehicular/detalle/evaluacion/@models/contratos.model';
import { isNullOrUndefined } from 'util';
import {
  IModalContrato,
  IMensajeAdvertencia
} from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/modal-lista-contratos.interface';

@Component({
  selector: 'ginni-modal-lista-contratos',
  templateUrl: './modal-lista-contratos.component.html',
  styleUrls: ['./modal-lista-contratos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalListaContratosComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  public accionModal: string;

  @Input()
  public show: boolean;

  @Input()
  public idBloqueContrato: string;

  @Output()
  public showChange = new EventEmitter();

  public failed: string;
  public _formatoMoneda = formatoMoneda;
  public errorMensajeAgregar: string;
  public idContratosAgregar: number[];
  public mostrarContratos: boolean;
  public mostrarMensajeAdvertencia: string;
  public listaContratos: ModalContratos;
  public loading = true;

  constructor(
    public fb: FormBuilder,
    public portalSandbox: PortalSandbox,
    private evaluacionApiService: EvaluacionApiService
  ) {}

  public ngOnInit(): void {}

  public ngOnChanges(): void {
    if (this.show) {
      this.errorMensajeAgregar = null;
      this.mostrarContratos = true;
      this.servicioModalContratos();
    } else {
      this.resetear();
    }
  }

  public get desabilitarAgregar() {
    const contratosSeleccionados = this.listaContratos.filter(
      (contrato: IModalContrato) => contrato.selected
    );
    return contratosSeleccionados.length;
  }

  private resetear() {
    this.errorMensajeAgregar = null;
    this.idContratosAgregar = [];
    this.listaContratos = [];
  }

  public isFechaAdjudicacion(value: any) {
    return !isNullOrUndefined(value) || value !== '' ? value : '-';
  }

  public ngOnDestroy() {
    this.show = false;
    this.resetear();
  }

  private servicioModalContratos() {
    this.loading = true;
    this.evaluacionApiService.modalContratos(this.idBloqueContrato).subscribe(
      (resp: IModalContrato[]) => {
        this.loading = false;
        this.listaContratos = new ModalContratos(resp);
      },
      (error: APIError) => {
        if (error) {
          this.loading = false;
          this.failed = error.mensaje;
        }
      }
    );
  }

  public agregarContratos() {
    this.loading = true;
    const numerosContratos = [];
    this.idContratosAgregar = [];

    this.listaContratos.forEach((contrato: IModalContrato) => {
      if (contrato.selected) {
        numerosContratos.push(contrato.nroContrato);
        this.idContratosAgregar.push(contrato.idContrato);
      }
    });
    this.servicioMostrarMensaje(numerosContratos);
  }

  private servicioMostrarMensaje(numerosContratos: string[]) {
    this.evaluacionApiService
      .modalContratosMensaje(numerosContratos)
      .subscribe((mensajeAdvertencia: IMensajeAdvertencia) => {
        this.loading = false;
        this.mostrarContratos = false;
        this.mostrarMensajeAdvertencia = mensajeAdvertencia.mensaje;
      });
  }

  public servicioAgregarContratos() {
    this.loading = true;
    this.evaluacionApiService
      .agregarContratos(this.idBloqueContrato, this.idContratosAgregar)
      .subscribe(
        () => {
          this.mostrarContratos = true;
          this.show = false;
          this.showChange.emit();
          this.errorMensajeAgregar = null;
          window.location.reload(true);
        },
        (error: APIError) => {
          if (error) {
            this.loading = false;
            this.errorMensajeAgregar = error.mensaje;
          }
        }
      );
  }

  public cancelarAgregar(): void {
    this.errorMensajeAgregar = null;
    this.mostrarContratos = true;
    this.setearSeleccionados();
  }

  private setearSeleccionados(): void {
    this.listaContratos.forEach((_contrato: IModalContrato, index: number) => {
      this.listaContratos[index].selected = false;
    });
  }
}
