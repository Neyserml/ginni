import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnDestroy,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { esImagen, desactivarControles } from 'app/@compartidos/utils/helpers';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { EvaluacionApiService } from 'app/modulos/logistica-vehicular/detalle/evaluacion/evaluacion-api.service';
import { IConfiguracionEvaluacionCrediticia } from 'app/modulos/portal/@models/configuracion.model';
import { APIError } from 'app/@compartidos/models';
import {
  IDatosVerificacionRequest,
  IArchivoAdjunto,
  IRadioButton,
  IListadoVerificaciones
} from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/datosVerificacion.interface';
import { ISubirArchivo } from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/garante.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalTipoVerificacion } from 'app/modulos/logistica-vehicular/detalle/evaluacion/evaluacion.enum';
import { EMPTY } from 'app/@compartidos/utils/consts';
import { IDocumentosPersonas } from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/documentos-personas.interface';

@Component({
  selector: 'ginni-modal-lista-verificaciones',
  templateUrl: './modal-lista-verificaciones.component.html',
  styleUrls: ['./modal-lista-verificaciones.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalListaVerificacionesComponent implements OnInit, OnChanges, OnDestroy {
  public archivoSubido;
  public archivoBlob: string | ArrayBuffer;
  public alertaDocumento = null;
  public cargandoArchivo = false;
  public comentarios = '';
  public errorGuardarArchivo: string;
  public errorGuardarVerificacion: string;
  public exitoGuardarVerificacion: boolean;
  public errorTipoVerificacion: boolean;
  public errorViaVerificacion: boolean;
  public failed: string;
  public formTabs: FormGroup;
  public habilitarVisor = false;
  public idVerificador: string;
  public idTipoVerificacion: string;
  public idViaVerificacion: string;
  public idVerificacion: number;
  public reemplazando = false;
  public radioViaVerificacion: Array<IRadioButton>;
  public radioTipoVerificacion: Array<IRadioButton>;
  public listaPersonasVerificaciones: Array<IDocumentosPersonas> = [];
  public loading: boolean;
  public showVisorMobile = false;
  private subscriptions: Subscription[] = [];
  private seGuarda: boolean;

  public state = {
    radiobuttonsTipoVerificacion: [],
    radiobuttonsViaVerificacion: []
  };

  @Input()
  public accionModal: string;

  @Input()
  public datosVerificacionSeleccionada: IListadoVerificaciones;

  @ViewChild('textarea')
  public textarea;

  get mensajeEliminarDocumento() {
    const mensajeAccion = this.reemplazando ? 'reemplazar' : 'eliminar';
    return `¿Estás seguro que deseas ${mensajeAccion} ?`;
  }

  get botonEliminarDocumento() {
    return this.reemplazando ? 'Reemplazar' : 'Eliminar';
  }

  @Input()
  public show: boolean;

  @Input()
  public idBloqueContrato: string;

  @Input()
  public configuracionEvaluacionCrediticia: IConfiguracionEvaluacionCrediticia;

  @Output()
  public showChange = new EventEmitter();

  constructor(
    private evaluacionApiService: EvaluacionApiService,
    private router: Router,
    public fb: FormBuilder,
    public portalSandbox: PortalSandbox
  ) {}

  public ngOnInit(): void {}

  public ngOnChanges() {
    if (this.show) {
      this.loading = true;
      this.textarea.nativeElement.value = EMPTY;
      this.radioViaVerificacion = this.configuracionEvaluacionCrediticia.viaVerificacion;
      this.radioViaVerificacion.map(() => {
        this.state.radiobuttonsViaVerificacion.push(false);
      });

      this.radioTipoVerificacion = this.configuracionEvaluacionCrediticia.tipoVerificacion;
      this.radioTipoVerificacion.map(() => {
        this.state.radiobuttonsTipoVerificacion.push(false);
      });

      this.mostrarModalAccion();

      setTimeout(() => {
        this.registrarEventos();
        this.router.navigate([
          this.router.url,
          {
            urlParamVerificacion: true
          }
        ]);
      }, 500);
    } else {
      if (this.seGuarda) {
        this.evaluacionApiService.actualizarListaVerificaciones(true);
      }
      this.reiniciarModal();
    }
  }

  public ngOnDestroy() {
    this.desregistrarEventos();
  }

  private mostrarModalAccion() {
    switch (this.accionModal) {
      case ModalTipoVerificacion.AGREGAR:
        this.construirForm();
        break;
      case ModalTipoVerificacion.EDITAR:
        const {
          id,
          persona,
          verificador,
          tipo,
          via,
          comentarios,
          urlDocumento
        }: IListadoVerificaciones = this.datosVerificacionSeleccionada;

        this.construirForm(persona.id.toString(), verificador.id.toString());
        desactivarControles(this.formTabs, ['persona']);

        const payload = {
          url: urlDocumento,
          tipo: 'blob'
        };

        this.servicioDescargarDocumento(payload);
        this.cargarRadioButtons(tipo, via);
        this.habilitarVisor = true;
        this.idVerificacion = id;
        this.comentarios = comentarios;
        this.seGuarda = true;
        break;
      default:
        break;
    }
  }

  private servicioDescargarDocumento(payload) {
    if (payload.url) {
      this.cargandoArchivo = true;
      this.evaluacionApiService.modalDescargarDocumento(payload).subscribe(
        blob => {
          if (blob) {
            this.cargandoArchivo = false;
            this.errorGuardarArchivo = null;
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              const result: any = reader.result;
              const indexPrefix = result.indexOf(',');
              const prefix = result.substr(0, indexPrefix);
              const base64Encoded = reader.result.slice(indexPrefix + 1, result.length);

              this.archivoSubido = {
                nombreArchivo: payload.url,
                url: `${prefix},${base64Encoded}`,
                tipoImagen: esImagen(payload.url)
              };
            };
          }
        },
        (error: APIError) => {
          if (error) {
            this.cargandoArchivo = false;
            this.errorGuardarArchivo = error.mensaje;
          }
        }
      );
    }
  }

  private registrarEventos() {
    this.subscriptions.push(
      this.evaluacionApiService.documentosPersonas(this.idBloqueContrato).subscribe(
        (documentos: Array<IDocumentosPersonas>) => {
          if (documentos) {
            this.loading = false;
            this.listaPersonasVerificaciones = documentos;
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

  public desregistrarEventos() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private construirForm(clavePersona = EMPTY, claveVerificador = EMPTY) {
    this.formTabs = this.fb.group({
      persona: [clavePersona, Validators.required],
      verificador: [claveVerificador, Validators.required]
    });
  }

  private cargarRadioButtons(tipo, via) {
    this.idTipoVerificacion = tipo.id.toString();
    this.idViaVerificacion = via.id.toString();
    this.radioTipoVerificacion.forEach((radio, index) => {
      this.state.radiobuttonsTipoVerificacion[index] = radio.clave === tipo.id.toString();
    });

    this.radioViaVerificacion.forEach((radio, index) => {
      this.state.radiobuttonsViaVerificacion[index] = radio.clave === via.id.toString();
    });
  }

  private reiniciarModal(): void {
    this.comentarios = EMPTY;
    this.alertaDocumento = null;
    this.archivoSubido = {};
    this.archivoBlob = null;
    this.cargandoArchivo = false;
    this.idVerificador = '';
    this.idVerificacion = null;
    this.idTipoVerificacion = '';
    this.idViaVerificacion = '';
    this.habilitarVisor = false;
    this.loading = false;
    this.radioTipoVerificacion = [];
    this.radioViaVerificacion = [];
    this.state.radiobuttonsTipoVerificacion = [];
    this.state.radiobuttonsViaVerificacion = [];
    this.seGuarda = false;
    this.setearMensajes();
    this.construirForm();
  }

  private setearMensajes() {
    this.errorTipoVerificacion = false;
    this.errorViaVerificacion = false;
    this.errorGuardarArchivo = null;
    this.errorGuardarVerificacion = null;
    this.exitoGuardarVerificacion = false;
  }

  public subirArchivo(event) {
    this.setearMensajes();
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const totalCaracteres = reader.result.toString().length;
      this.archivoBlob = reader.result;
      const prefix = `data:${file.type};base64,`;
      const base64Encoded = reader.result.slice(prefix.length, totalCaracteres);
      this.servicioSubirArchivo(base64Encoded, file.name, prefix);
    };
  }

  private servicioSubirArchivo(base64Encoded, nombreArchivo, prefix) {
    this.cargandoArchivo = true;
    const payload: IArchivoAdjunto = {
      nombreArchivo,
      base64Encoded
    };

    this.evaluacionApiService
      .subirArchivo(this.idBloqueContrato, this.idVerificacion, payload)
      .subscribe(
        (archivo: ISubirArchivo) => {
          if (archivo) {
            this.archivoSubido.url = null;

            this.cargandoArchivo = false;
            this.setearMensajes();
            this.errorGuardarArchivo = null;
            const tipoImagen = esImagen(nombreArchivo);
            this.archivoSubido = {
              filename: archivo.filename,
              size: archivo.sizeInMB,
              url: `${prefix}${base64Encoded}`,
              tipoImagen,
              nombreArchivo
            };
          }
        },
        (error: APIError) => {
          if (error) {
            this.cargandoArchivo = false;
            this.errorGuardarArchivo = error.mensaje;
          }
        }
      );
  }

  public accionAlertaDocumento() {
    this.setearMensajes();
    if (this.archivoSubido.url) {
      if (this.portalSandbox.esDesktop) {
        this.loading = true;
      } else {
        this.cargandoArchivo = true;
      }

      this.llamarServicioEliminar();
    }
  }

  private llamarServicioEliminar() {
    this.evaluacionApiService.eliminarArchivo(this.idBloqueContrato, this.idVerificacion).subscribe(
      () => {
        if (this.portalSandbox.esDesktop) {
          this.loading = false;
        } else {
          this.cargandoArchivo = false;
        }
        this.errorGuardarArchivo = null;
        this.archivoSubido.url = null;
      },
      (error: APIError) => {
        if (error) {
          if (this.portalSandbox.esDesktop) {
            this.loading = false;
          } else {
            this.cargandoArchivo = false;
          }
          this.errorGuardarArchivo = error.mensaje;
        }
      }
    );
  }

  private radioButtonAccion(actualIndex, stateRadiobutton) {
    stateRadiobutton.forEach((_rad, i) => {
      if (i === actualIndex) {
        stateRadiobutton[i] = true;
      } else {
        stateRadiobutton[i] = false;
      }
    });
  }

  public clickTipoVerificacion(radio, index) {
    this.radioButtonAccion(index, this.state.radiobuttonsTipoVerificacion);

    this.radioTipoVerificacion[index].clave = radio.clave;
    this.idTipoVerificacion = radio.clave;

    if (!this.idTipoVerificacion && this.seGuarda) {
      this.errorTipoVerificacion = true;
    } else {
      this.errorTipoVerificacion = false;
    }
  }

  public clickViaVerificacion(radio, index) {
    this.radioButtonAccion(index, this.state.radiobuttonsViaVerificacion);
    this.radioViaVerificacion[index].clave = radio.clave;
    this.idViaVerificacion = radio.clave;
    if (!this.idViaVerificacion && this.seGuarda) {
      this.errorViaVerificacion = true;
    } else {
      this.errorViaVerificacion = false;
    }
  }

  public abrirAlertaDocumento(estaReemplazando = false) {
    this.reemplazando = estaReemplazando;
    this.alertaDocumento = 0;
  }

  public descargarDocumento() {
    /*
    const nombreArchivo = this.archivoSubido.nombreArchivo;
    const indexExtension = nombreArchivo.lastIndexOf('.');
    const extension = nombreArchivo.slice(indexExtension, nombreArchivo.length);
    saveAs(this.archivoSubido.url, `Documento de verificación${extension}`);
    */
  }

  public guardar(obtenerComentarios) {
    const comentarios = obtenerComentarios.value.toUpperCase();
    this.seGuarda = true;

    const { valid, value } = this.formTabs;

    this.idTipoVerificacion
      ? (this.errorTipoVerificacion = false)
      : (this.errorTipoVerificacion = true);

    this.idViaVerificacion
      ? (this.errorViaVerificacion = false)
      : (this.errorViaVerificacion = true);

    if (valid && !this.errorTipoVerificacion && !this.errorViaVerificacion) {
      const payloadCrear: IDatosVerificacionRequest = {
        idPersona: value.persona,
        idVerificador: value.verificador,
        idTipoVerificacion: Number(this.idTipoVerificacion),
        idViaVerificacion: Number(this.idViaVerificacion),
        comentarios
      };
      const payloadActualizar = {
        idVerificador: value.verificador,
        idTipoVerificacion: Number(this.idTipoVerificacion),
        idViaVerificacion: Number(this.idViaVerificacion),
        comentarios
      };
      if (this.idVerificacion) {
        this.servicioActualizarVerificacion(payloadActualizar);
      } else {
        this.servicioCrearVerificacion(payloadCrear);
      }
    }
  }

  public servicioCrearVerificacion(payload) {
    this.loading = true;
    this.evaluacionApiService.guardarVerificacion(this.idBloqueContrato, payload).subscribe(
      ({ personaVerificacion }) => {
        desactivarControles(this.formTabs, ['persona']);
        this.loading = false;
        this.seGuardoExito(personaVerificacion);
      },
      (error: APIError) => {
        if (error) {
          this.habilitarVisor = false;
          this.loading = false;
          this.exitoGuardarVerificacion = false;
          this.errorGuardarVerificacion = error.mensaje;
        }
      }
    );
  }

  public servicioActualizarVerificacion(payload) {
    this.loading = true;
    this.evaluacionApiService
      .actualizarVerificacion(this.idBloqueContrato, this.idVerificacion, payload)
      .subscribe(
        ({ personaVerificacion }) => {
          this.loading = false;
          this.seGuardoExito(personaVerificacion);
        },
        (error: APIError) => {
          if (error) {
            this.habilitarVisor = false;
            this.loading = false;
            this.exitoGuardarVerificacion = false;
            this.errorGuardarVerificacion = error.mensaje;
          }
        }
      );
  }

  private seGuardoExito = personaVerificacion => {
    if (personaVerificacion) {
      if (this.portalSandbox.esMobile) {
        this.showVisorMobile = true;
      }
      this.setearMensajes();
      this.habilitarVisor = true;
      this.idVerificacion = personaVerificacion.id;
      this.comentarios = personaVerificacion.comentarios;
      this.idVerificador = personaVerificacion.verificador.id.toString();
      this.idTipoVerificacion = personaVerificacion.tipo.id.toString();
      this.idViaVerificacion = personaVerificacion.via.id.toString();
      this.exitoGuardarVerificacion = true;
      this.errorGuardarVerificacion = null;
    }
  };
}
