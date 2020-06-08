import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  OnDestroy,
  EventEmitter
} from '@angular/core';
import { Router } from '@angular/router';
import * as Dropzone from 'dropzone';
import { Subscription } from 'rxjs/Subscription';

import { APIError } from 'app/@compartidos/models';
import { DROPZONE_OPCIONES, DROPZONE_ID } from 'app/@compartidos/utils/helpers';
import { EvaluacionApiService } from 'app/modulos/logistica-vehicular/detalle/evaluacion/evaluacion-api.service';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import {
  IListaDocumentosAdicionales,
  IListaDocumentos
} from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/modal-documentos-personas.interface';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'ginni-modal-lista-documentos',
  templateUrl: './modal-lista-documentos.component.html',
  styleUrls: ['./modal-lista-documentos.component.scss']
})
export class ModalListaDocumentosComponent implements OnChanges, OnInit, OnDestroy {
  @Input()
  public show: boolean;

  @Input()
  idCreditoPersona: number;

  @Input()
  value: number;

  @Output()
  public showChange = new EventEmitter<boolean>();

  public showVisorMobile = false;

  public documentoSeleccionado = null;
  public documentoSeleccionadoEliminar = null;

  public alertaDocumento = null;
  public reemplazando = false;

  public loadingFailed = '';
  public loading: boolean;
  public guardadoError = '';
  public guardadoExitoso: boolean;
  public guardadoArchivoError = '';
  public masDocumentos = false;

  public listaDocumentos: IListaDocumentos[];
  public listaDocumentosAdicionales: IListaDocumentosAdicionales[];
  public listaDocumentosASubir: Array<IListaDocumentosAdicionales> = [];
  public documentoActual: IListaDocumentos;
  public modalIniciado: boolean;
  public fileSize: number;

  private subscriptions: Subscription[] = [];

  get mensajeEliminarDocumento() {
    const mensajeAccion = this.reemplazando ? 'reemplazar' : 'eliminar';
    return '¿Estás seguro que deseas ' + mensajeAccion + '?';
  }

  get botonEliminarDocumento() {
    return this.reemplazando ? 'Reemplazar' : 'Eliminar';
  }

  get activarSeleccion() {
    this.listaDocumentosASubir = this.listaDocumentosAdicionales.filter(
      documentos => documentos.value
    );

    return !!this.listaDocumentosASubir.length;
  }
  constructor(
    public portalSandbox: PortalSandbox,
    private evaluacionApiService: EvaluacionApiService,
    private router: Router
  ) {}

  public ngOnInit(): void {}

  public ngOnDestroy(): void {
    this.desregistrarEventos();
  }

  public ngOnChanges() {
    if (this.idCreditoPersona && this.show) {
      this.loading = true;
      this.modalIniciado = true;
      this.setearMensajes();
      this.registrarEventos();
      setTimeout(() => {
        this.router.navigate([
          this.router.url,
          {
            urlParamDocumentos: true
          }
        ]);
      }, 500);
    } else {
      this.reiniciarModal();
    }
  }

  public onChangeVisorMobile() {
    if (!this.showVisorMobile) {
      this.documentoSeleccionado = null;
    }
  }

  public agregarOtrosDocumentos() {
    this.masDocumentos = !this.masDocumentos;
  }

  private registrarEventos(eliminando?: boolean) {
    this.subscriptions.push(
      this.evaluacionApiService
        .modalListaDocumentos(this.idCreditoPersona)
        .subscribe(documentos => {
          if (documentos) {
            if (eliminando && this.portalSandbox.esDesktop) {
              this.documentoSeleccionado = 0;
            }
            this.listaDocumentos = documentos.listaDocumentos;
            this.documentoActual = this.listaDocumentos[this.documentoSeleccionado];

            if (this.modalIniciado) {
              this.documentoSeleccionado = 0;
              this.documentoActual = this.listaDocumentos[this.documentoSeleccionado];
            } else {
              this.mostrarDropzone();
              this.loading = false;
            }
            if (this.modalIniciado || eliminando) {
              this.modalIniciado = false;
              if (this.documentoActual.url) {
                const payload = {
                  url: this.documentoActual.url,
                  tipo: 'blob'
                };
                this.servicioDescargarDocumento(payload);
              } else {
                this.loading = false;
                this.mostrarDropzone();
              }
            }
            this.loading = false;
          }
        }, this.servicioError),
      this.evaluacionApiService
        .modalListaDocumentosAdicionales(this.idCreditoPersona)
        .subscribe(documentosAdicionales => {
          if (documentosAdicionales) {
            this.listaDocumentosAdicionales = documentosAdicionales.listaDocumentos;
          }
        }, this.servicioError)
    );
  }

  private desregistrarEventos(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private reiniciarModal(): void {
    this.evaluacionApiService.actualizarListaDocumentos(true);
    this.documentoSeleccionado = null;
    this.documentoSeleccionadoEliminar = null;
    this.alertaDocumento = null;
    this.loading = false;
    this.loadingFailed = null;
    this.masDocumentos = false;
    this.listaDocumentos = [];
  }

  public clickEliminarDocumentoLista(index: number, item: IListaDocumentos): void {
    this.documentoActual = item;
    if (item && item.adicional) {
      this.setearMensajes();
      this.documentoSeleccionadoEliminar = index;
      this.documentoSeleccionado = null;
      this.documentoSeleccionado = index;
    }
  }

  private servicioAgregarDocumento(documentoId) {
    this.loading = true;
    const payload = {
      idCreditoPersona: this.idCreditoPersona,
      documentoId
    };
    this.evaluacionApiService.modalAgregarOpcionales(payload).subscribe(
      documentosResponse => {
        if (documentosResponse) {
          this.listaDocumentos = documentosResponse.listaDocumentos;
        }
      },
      this.servicioError,
      () => this.registrarEventos()
    );
  }

  public seleccionarDocumento(index: number, item) {
    this.documentoActual = item;
    this.documentoSeleccionado = index;
    this.setearMensajes();
    if (this.portalSandbox.esMobile) {
      this.showVisorMobile = true;
    }
    if (index !== this.documentoSeleccionado) {
      this.documentoActual = this.listaDocumentos[this.documentoSeleccionado];

      this.alertaDocumento = null;
    }
    if (this.documentoActual.archivoCargado) {
      this.loading = true;
      const payload = {
        url: this.documentoActual.url,
        tipo: 'blob'
      };
      this.servicioDescargarDocumento(payload);
    } else {
      this.mostrarDropzone();
    }
  }

  private servicioDescargarDocumento(payload) {
    this.evaluacionApiService.modalDescargarDocumento(payload).subscribe(
      blob => {
        if (blob) {
          this.convertirABytes(blob);
          this.guardadoArchivoError = null;
        }
      },
      (error: APIError) => {
        if (error) {
          this.guardadoArchivoError = error.mensaje;
          this.loading = false;
        }
      }
    );
  }

  public agregarExtras() {
    this.setearMensajes();
    const arrayDocumentoId = this.listaDocumentosASubir.map(documento => documento.id);
    this.servicioAgregarDocumento(arrayDocumentoId);
  }

  private setearMensajes() {
    this.guardadoError = null;
    this.guardadoExitoso = false;
    this.guardadoArchivoError = null;
  }

  private mostrarDropzone() {
    this.loading = false;
    if (this.documentoActual) {
      const documento: IListaDocumentos = this.documentoActual;

      if (!documento.url) {
        this.alertaDocumento = null;
        setTimeout(() => {
          const component = this;
          const dropzoneElement: any = document.querySelector(DROPZONE_ID);
          if (dropzoneElement && !dropzoneElement.dropzone) {
            return new Dropzone(DROPZONE_ID, {
              ...DROPZONE_OPCIONES,
              init: function() {
                this.on('addedfile', function(fileObject: File) {
                  component.loading = true;
                  component.loadingFailed = null;
                  const file = new FormData();
                  file.append('file', fileObject, fileObject.name);
                  file.append('observacion', '');
                  file.append(
                    'creditoPersonaDocumentoId',
                    component.documentoActual.creditoPersonaDocumentoId.toString()
                  );
                  const extension = fileObject.name.substring(fileObject.name.lastIndexOf('.') + 1);
                  const tamanio = Math.round(fileObject.size / 1024);
                  component.validarExtensionTamanioArchivo(component, file, tamanio, extension);
                });
              }
            });
          }
        }, 500);
      }
    } else {
      this.documentoActual = this.listaDocumentos[0];
    }
  }

  private servicioSubirArchivoYComentario(that, file) {
    this.setearMensajes();
    const payload = {};
    this.loading = true;
    that.evaluacionApiService.modalSubirArchivoYComentario(file, that.idCreditoPersona).subscribe(
      archivo => {
        if (archivo) {
          this.registrarEventos();
          this.guardadoExitoso = false;
          payload['url'] = archivo.url;
          payload['tipo'] = 'blob';
          this.servicioDescargarDocumento(payload);
        }
      },
      (error: APIError) => {
        if (error) {
          this.guardadoExitoso = false;
          this.guardadoArchivoError = error.mensaje;
          this.loading = false;
        }
      }
    );
  }

  private validarExtensionTamanioArchivo(
    that,
    files: FormData,
    tamanio: number,
    extension: string
  ) {
    this.loading = true;
    this.evaluacionApiService
      .modalValidarExtensionyTamanio(this.idCreditoPersona, tamanio, extension)
      .subscribe(
        () => {
          this.servicioSubirArchivoYComentario(that, files);
        },
        (error: APIError) => {
          if (error) {
            this.guardadoExitoso = false;
            this.guardadoArchivoError = error.mensaje;
            this.loading = false;
          }
        }
      );
  }

  private convertirABytes(blob: Blob) {
    const blobDescargado = URL.createObjectURL(blob);
    this.documentoActual.archivoBlob = blob;
    if (this.documentoActual.tipoArchivo === 'imagen') {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        this.documentoActual.archivo = base64data;
      };
    } else {
      this.documentoActual.archivo = blobDescargado;
    }
    this.loading = false;
  }

  public servicioGuardarObservacion(observacion: FormData) {
    this.evaluacionApiService
      .modalSubirArchivoYComentario(observacion, this.idCreditoPersona)
      .subscribe(
        observacionRes => {
          if (observacionRes) {
            this.loading = false;
            this.guardadoError = null;
            this.guardadoExitoso = true;
            this.listaDocumentos[this.documentoSeleccionado].observacion = observacion
              .get('observacion')
              .toString();
          }
        },
        (error: APIError) => {
          if (error) {
            this.loading = false;
            this.guardadoExitoso = false;
            this.guardadoError = error.mensaje;
          }
        }
      );
  }

  public reemplazarArchivo(event) {
    this.setearMensajes();
    setTimeout(() => {
      const fileObject: File = event.target.files[0];
      if (fileObject && this.documentoActual) {
        const files = new FormData();
        this.loading = true;
        const creditoPersonaDocumentoId = this.documentoActual.creditoPersonaDocumentoId;
        files.append('file', fileObject, fileObject.name);
        files.append('creditoPersonaDocumentoId', creditoPersonaDocumentoId.toString());
        files.append('observacion', '');
        const extension = fileObject.name.substring(fileObject.name.lastIndexOf('.') + 1);
        const tamanio = Math.round(fileObject.size / 1024);
        this.fileSize = tamanio;
        this.validarExtensionTamanioArchivo(this, files, tamanio, extension);
      }
    }, 300);
  }

  public abrirAlertaDocumento(estaReemplazando = false) {
    this.setearMensajes();
    this.reemplazando = estaReemplazando;
    this.alertaDocumento = 0;
  }

  public accionEliminarArchivo() {
    this.setearMensajes();
    if (this.documentoActual) {
      this.loading = true;
      const payload = {
        creditoPersonaDocumentoId: this.documentoActual.creditoPersonaDocumentoId,
        idCreditoPersona: this.idCreditoPersona
      };
      this.evaluacionApiService
        .modalEliminarArchivo(payload)
        .subscribe(() => {}, this.servicioError, () => this.registrarEventos());
    }
  }

  public accionEliminarDocumento() {
    this.setearMensajes();
    if (this.documentoActual) {
      this.loading = true;
      this.masDocumentos = false;
      if (this.idCreditoPersona) {
        const payload = {
          creditoPersonaDocumentoId: this.documentoActual.creditoPersonaDocumentoId,
          idCreditoPersona: this.idCreditoPersona
        };
        this.evaluacionApiService.modalEliminarDocumento(payload).subscribe(documentos => {
          if (documentos) {
            this.registrarEventos(true);
          }
        }, this.servicioError);
      }
    }
  }

  public guardarObservacion(event) {
    this.setearMensajes();
    const observacion = event.value.trim();
    if (observacion.length <= 255 && this.documentoActual) {
      const file = new FormData();
      file.append('observacion', observacion.toUpperCase());
      file.append(
        'creditoPersonaDocumentoId',
        String(this.documentoActual.creditoPersonaDocumentoId)
      );
      this.servicioGuardarObservacion(file);
    } else {
      this.guardadoError = 'Se debe ingresar mínimo 255 caracteres';
    }
  }

  private servicioError = (error: APIError) => {
    if (error) {
      this.loadingFailed = error.mensaje;
    }
  };

  NullOrUndefined(value: any) {
    return isNullOrUndefined(value);
  }

  public descargar_documento() {
    // blob: Blob, nombre: string
    // saveAs(blob, nombre + '.' + blob.type.split('/')[1]);
  }
}
