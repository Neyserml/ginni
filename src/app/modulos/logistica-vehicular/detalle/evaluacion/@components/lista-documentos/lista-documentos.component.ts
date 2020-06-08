import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnDestroy,
  ViewEncapsulation,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Store } from '@ngrx/store';
import * as store from 'app/@compartidos/store';
import { APIError } from 'app/@compartidos/models';
import {
  IDocumentosPersonas,
  IBotonAccionRequest,
  IMensaje,
  ICheckboxesRequest
} from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/documentos-personas.interface';
import { Configuracion } from 'app/modulos/portal/@models/configuracion.model';
import { EvaluacionApiService } from 'app/modulos/logistica-vehicular/detalle/evaluacion/evaluacion-api.service';
import {
  EDITAR,
  AGREGAR,
  DocumentosBotonesServicio,
  RESPALDO
} from 'app/modulos/logistica-vehicular/detalle/evaluacion/evaluacion.enum';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { DetalleApiService } from 'app/modulos/logistica-vehicular/detalle/detalle-api.service';
import { FormBuilder, FormArray, Validators } from '@angular/forms';
import { ValidationService } from 'app/@compartidos/utils/validation.service';
import { DocumentosBotones } from 'app/modulos/portal/portal.enum';
import { NotificationTypeEnum } from 'app/@compartidos/services/notification-type.enum';
import { TIPO_MENSAJE_SEGUIMIENTO } from 'app/modulos/logistica-vehicular/bandejas/bandejas.enum';
import { PortalApiService } from 'app/modulos/portal/portal.api.service';
import * as seguimientoAction from 'app/modulos/logistica-vehicular/detalle/evaluacion/@store/seguimiento.action';
import { ISeguimientoRequest } from '../../@interface/seguimiento.interface';

@Component({
  selector: 'ginni-lista-documentos',
  templateUrl: './lista-documentos.component.html',
  styleUrls: ['./lista-documentos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListaDocumentosComponent implements OnInit, OnDestroy {
  @Input()
  public actualizarListaDocumentos: boolean;

  @Input()
  public configuracion: Configuracion;

  @Input()
  public evaluacionAprobada = false;

  @Input()
  public idBloqueContrato: string;

  @Input()
  public restriccionTotal: boolean;

  @Input()
  public tipoPersona: string;

  @Input()
  public puedeEditar: boolean;

  @Output()
  public idCreditoPersona = new EventEmitter<number>();

  @Output()
  public abrirModalVisor = new EventEmitter();

  @Output()
  public agregarGarante = new EventEmitter<boolean>();

  @Output()
  public editarGarante = new EventEmitter<IDocumentosPersonas>();

  @Output()
  public listaDocumentosPersonas = new EventEmitter<any>();

  @ViewChild('observacion')
  public observacion: ElementRef;

  public accesoEditar: boolean;
  public botones: string[];
  public botonAccionEstado = {
    tipo: '',
    observacion: '',
    mensaje: '',
    servicio: ''
  };
  public documentos: IDocumentosPersonas[];
  public errorMensaje: string;
  public errorType: string;
  public failed: string;
  public formCheckbox: FormArray;
  public guardadoError: string;
  public indexContratoVinculadoSelected = null;
  public modal = false;
  public mensajeServicio: string;
  public loading: boolean;
  public loadingModal: boolean;
  public subscriptions: Subscription[] = [];
  public showAlert: boolean;
  public showAlertButton: boolean;
  public successMensaje: string;
  public successType: string;
  public mostrarIconEditar: Boolean;
  public modalModificarEvaluacion: Boolean;
  public tipoRelacion: string;

  constructor(
    public asociadoApiService: DetalleApiService,
    private portalApiService: PortalApiService,
    private evaluacionApiService: EvaluacionApiService,
    private fb: FormBuilder,
    private router: Router,
    private portalSandbox: PortalSandbox,
    public appState$: Store<store.State>,
    private validations: ValidationService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.errorType = NotificationTypeEnum.Danger;
    this.successType = NotificationTypeEnum.Success;
    const { accesoEditar, botonesDocumentos } = this.portalSandbox.getRestriccion();
    this.botones = botonesDocumentos;
    this.accesoEditar = accesoEditar;
    this.evaluacionApiService.actualizarListaDocumentos(false);
    this.registrarEventos();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.scrollToTop();
    this.botonAccionEstado = null;
    this.loadingModal = false;
    this.showAlertButton = false;
  }

  public registrarEventos() {
    this.subscriptions.push(
      this.evaluacionApiService.actualizarListaDocumentos$.subscribe((actualizar: boolean) => {
        if (actualizar) {
          this.servicioListarDocumentos();
        }
      }),
      this.evaluacionApiService.documentosPersonas(this.idBloqueContrato).subscribe(
        (documentos: Array<IDocumentosPersonas>) => {
          if (documentos) {
            this.actualizarDocumentos(documentos);
          }
        },
        (error: APIError) => {
          if (error) {
            this.failed = error.mensaje;
          }
        }
      )
    );
  }

  public actualizarCheckboxes(documentos: IDocumentosPersonas[]) {
    this.formCheckbox = this.fb.array(
      documentos.map((documento: IDocumentosPersonas) => {
        return this.fb.group({
          verificacionesDomiciliario: [
            { value: documento.verificaciones[0].estado, disabled: !this.puedeEditar }
          ],
          verificacionesLaboral: [
            { value: documento.verificaciones[1].estado, disabled: !this.puedeEditar }
          ],
          documentosEnviados: [
            { value: documento.documentos[0].archivoCargado, disabled: !this.puedeEditar },
            [Validators.required, this.validations.esTrue]
          ],
          garantiasReales: [{ value: documento.garantiaReal, disabled: !this.puedeEditar }]
        });
      })
    );
  }

  public cambioCheckbox(nombreControl: string, id: number, index: number) {
    this.loading = true;
    const valorCheckbox = this.formCheckbox.controls[index].get(nombreControl).value;
    let nombreServicio: string;
    switch (nombreControl) {
      case 'verificacionesDomiciliario':
      case 'verificacionesLaboral':
        nombreServicio = 'actualizarVerificaciones';
        break;
      case 'documentosEnviados':
        nombreServicio = 'actualizarDocumentos';
        break;
      case 'garantiasReales':
        nombreServicio = 'actualizarGarantias';
        break;
      default:
        nombreServicio = '';
        this.loading = false;
        break;
    }

    const payload: ICheckboxesRequest = {
      id,
      valorCheckbox: valorCheckbox
    };

    const datosCheckbox = {
      indexForm: index,
      nombreControl
    };

    this.servicioCheckboxes(nombreServicio, payload, datosCheckbox);
  }

  private servicioCheckboxes(nombreServicio: string, payload: ICheckboxesRequest, datosCheckbox) {
    this.evaluacionApiService[nombreServicio](payload).subscribe(
      () => (this.loading = false),
      (error: APIError) => {
        if (error) {
          this.loading = false;
          this.errorMensaje = error.mensaje;
          const formCheckboxActual = this.formCheckbox.controls[datosCheckbox.indexForm];
          formCheckboxActual.get(datosCheckbox.nombreControl).setValue(!payload.valorCheckbox);
        }
      }
    );
  }

  private servicioListarDocumentos() {
    this.evaluacionApiService.documentosPersonas(this.idBloqueContrato).subscribe(
      (documentos: Array<IDocumentosPersonas>) => {
        if (documentos) {
          this.actualizarDocumentos(documentos);
          this.evaluacionApiService.actualizarListaDocumentos(false);
        }
      },
      (error: APIError) => {
        if (error) {
          this.failed = error.mensaje;
        }
      }
    );
  }

  private actualizarDocumentos(documentos: IDocumentosPersonas[]) {
    this.loading = false;
    this.documentos = documentos;
    this.failed = null;
    this.actualizarCheckboxes(documentos);
    this.documentos.forEach((item: IDocumentosPersonas) => {
      if (!item.readOnly) {
        return (this.mostrarIconEditar = true);
      }
    });
  }

  public mostrarMensajeAlerta(index, readOnly: boolean) {
    if (readOnly) {
      this.indexContratoVinculadoSelected = index;
    }
  }

  private esRespaldo(valorTipoRelacion: string) {
    return valorTipoRelacion.toUpperCase() === RESPALDO;
  }

  public filaAEliminar = () => {
    this.loading = true;
    const idCreditoPersona = this.documentos[this.indexContratoVinculadoSelected].idCreditoPersona;
    this.tipoRelacion = this.documentos[this.indexContratoVinculadoSelected].tipo;
    const payload = {
      idBloqueContrato: this.idBloqueContrato,
      idCreditoPersona: idCreditoPersona
    };
    this.evaluacionApiService.eliminarDocumentos(payload).subscribe(
      () => {
        this.modalModificarEvaluacion = this.esRespaldo(this.tipoRelacion);
        this.servicioObtenerMensajesSistema();
        this.registrarEventos();
      },
      (error: APIError) => {
        this.loading = false;
        this.errorMensaje = error.mensaje;
      }
    );
  };

  private servicioObtenerMensajesSistema() {
    this.asociadoApiService
      .asociadoMensajesSistema(this.idBloqueContrato)
      .subscribe((mensajesSistema: Array<string>) => {
        if (mensajesSistema) {
          this.asociadoApiService.guardarMensajesSistema(mensajesSistema);
        }
      });
  }

  public abrirModal(idCreditoPersona) {
    this.idCreditoPersona.emit(idCreditoPersona);
    if (this.router.url !== this.portalSandbox.getUrlWithoutParams()) {
      this.router.navigateByUrl(this.portalSandbox.getUrlWithoutParams());
    }
    this.abrirModalVisor.emit();
  }

  public agregarGaranteORespaldo() {
    this.agregarGarante.emit();
    const payload = {
      documentos: this.documentos,
      seAgrega: true,
      accionGarante: AGREGAR
    };
    this.listaDocumentosPersonas.emit(payload);
  }

  public editarGaranteORespaldo(documentos: IDocumentosPersonas) {
    const payload = {
      ...documentos,
      accionGarante: EDITAR
    };
    this.editarGarante.emit(payload);
  }

  public envioComite() {
    if (this.formCheckbox.valid) {
      this.botonAccionEstado.servicio = DocumentosBotonesServicio.ENVIO_COMITE;
      this.botonAccionEstado.mensaje = '¿Estás seguro que deseas enviar a comité?';
      this.showAlertButton = true;
    } else {
      this.showAlert = true;
    }
  }

  public botonAccion(tipoBoton: string, observacion: string): void {
    if (!this.evaluacionAprobada || tipoBoton === DocumentosBotones.Anular) {
      this.botonAccionEstado.tipo = tipoBoton;
      this.botonAccionEstado.observacion = observacion.toUpperCase();
      if (tipoBoton === DocumentosBotones.EnvioComite) {
        this.envioComite();
      } else {
        this.aceptarAccionBoton();
      }
    }
  }

  public aceptarAccionBoton() {
    switch (this.botonAccionEstado.tipo) {
      case DocumentosBotones.Anular:
        this.botonAccionEstado.mensaje = '¿Estás seguro que deseas anular?';
        this.botonAccionEstado.servicio = DocumentosBotonesServicio.ANULAR;
        break;
      case DocumentosBotones.Aprobado:
        this.botonAccionEstado.mensaje = '¿Estás seguro que deseas aprobar?';
        this.botonAccionEstado.servicio = DocumentosBotonesServicio.APROBADO;
        break;
      case DocumentosBotones.Observado:
        this.botonAccionEstado.mensaje = '¿Estás seguro que deseas observar?';
        this.botonAccionEstado.servicio = DocumentosBotonesServicio.OBSERVADO;
        break;
      case DocumentosBotones.Siguiente:
        this.botonAccionEstado.mensaje = '¿Estás seguro que deseas pasar a la siguiente instancia?';
        this.botonAccionEstado.servicio = DocumentosBotonesServicio.SIGUIENTE;
        break;
      default:
        break;
    }
    this.showAlertButton = true;
  }

  public servicioboton() {
    this.loadingModal = true;
    const comentario = this.botonAccionEstado.observacion.trim();
    const payload: IBotonAccionRequest = {
      comentario,
      bloqueContratoId: Number(this.idBloqueContrato)
    };

    this.evaluacionApiService[this.botonAccionEstado.servicio](payload).subscribe(
      (res: IMensaje) => {
        if (this.botonAccionEstado.servicio !== DocumentosBotonesServicio.OBSERVADO) {
          this.portalApiService.guardarMensajeDocumentos({
            mensaje: res.mensaje,
            tipo: TIPO_MENSAJE_SEGUIMIENTO.Success
          });
          this.regresarBandeja();
        } else {
          this.loadingModal = false;
          this.showAlertButton = false;
          const seguimientoRequest: ISeguimientoRequest = {
            codigoContrato: this.idBloqueContrato,
            pagina: 1,
            cantidad: 10
          };
          this.observacion.nativeElement.value = '';
          this.appState$.dispatch(new seguimientoAction.LoadAction(seguimientoRequest));
          this.successMensaje = res.mensaje;
        }
      },
      this.errorServiciosBoton
    );
  }

  private errorServiciosBoton = (error: APIError) => {
    if (error) {
      this.showAlertButton = false;
      this.loadingModal = false;
      this.errorMensaje = error.mensaje;
    }
  };

  public regresarBandeja() {
    this.router.navigateByUrl('/portal');
  }

  private scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
}
