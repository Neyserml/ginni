import { Component, OnInit, Output, OnDestroy, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { Subscription } from 'rxjs/Subscription';
import { EvaluacionApiService } from 'app/modulos/logistica-vehicular/detalle/evaluacion/evaluacion-api.service';
import { IListadoVerificaciones } from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/datosVerificacion.interface';
import { APIError } from 'app/@compartidos/models';
import { ModalTipoVerificacion } from 'app/modulos/logistica-vehicular/detalle/evaluacion/evaluacion.enum';

@Component({
  selector: 'ginni-lista-verificaciones',
  templateUrl: './lista-verificaciones.component.html',
  styleUrls: ['./lista-verificaciones.component.scss']
})
export class ListaVerificacionesComponent implements OnInit, OnDestroy {
  public agregar = ModalTipoVerificacion.AGREGAR;
  public editar = ModalTipoVerificacion.EDITAR;
  public failed: string;
  public indexVerificacionSelected = null;
  public mensajeError: string;
  public listaVerificaciones: IListadoVerificaciones[];
  public loading: boolean;
  private subscriptions: Subscription[] = [];
  private _idVerificacionAEliminar: number;

  @Input()
  public idBloqueContrato: string;

  @Output()
  public abrirModalVerificaciones: EventEmitter<boolean> = new EventEmitter(false);

  @Output()
  public accionModal: EventEmitter<string> = new EventEmitter();

  @Output()
  public datosVerificacionSeleccionada: EventEmitter<IListadoVerificaciones> = new EventEmitter();

  constructor(
    private router: Router,
    private portalSandbox: PortalSandbox,
    private evaluacionApiService: EvaluacionApiService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.registrarEventos();
  }

  ngOnDestroy() {
    this.desregistrarEventos();
  }

  public registrarEventos() {
    this.subscriptions.push(
      this.evaluacionApiService.seCerroModalVerificaciones$.subscribe(modalCerrado => {
        if (modalCerrado) {
          this.loading = true;
          this.evaluacionApiService.listarVerificacion(this.idBloqueContrato).subscribe(
            listaVerificaciones => {
              if (listaVerificaciones) {
                this.loading = false;
                this.failed = null;
                this.listaVerificaciones = listaVerificaciones;
              }
            },
            (error: APIError) => {
              if (error) {
                this.loading = false;
                this.failed = error.mensaje;
              }
            }
          );
        }
      }),
      this.evaluacionApiService.listarVerificacion(this.idBloqueContrato).subscribe(
        listaVerificaciones => {
          if (listaVerificaciones) {
            this.loading = false;
            this.failed = null;
            this.listaVerificaciones = listaVerificaciones;
          }
        },
        (error: APIError) => {
          if (error) {
            this.loading = false;
            this.failed = error.mensaje;
          }
        }
      )
    );
  }

  private desregistrarEventos() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private llamarServicioListarVerificaciones() {
    this.evaluacionApiService.listarVerificacion(this.idBloqueContrato).subscribe(
      listaVerificaciones => {
        if (listaVerificaciones) {
          this.loading = false;
          this.failed = null;
          this.listaVerificaciones = listaVerificaciones;
        }
      },
      (error: APIError) => {
        if (error) {
          this.loading = false;
          this.failed = error.mensaje;
        }
      }
    );
  }

  public mostrarModalVerificaciones(accion, datosVerificacionSeleccionada = null) {
    this.accionModal.emit(accion);
    if (this.datosVerificacionSeleccionada) {
      this.datosVerificacionSeleccionada.emit(datosVerificacionSeleccionada);
    }

    this.mensajeError = null;
    if (this.router.url !== this.portalSandbox.getUrlWithoutParams()) {
      this.router.navigateByUrl(this.portalSandbox.getUrlWithoutParams());
    }
    this.abrirModalVerificaciones.emit(true);
  }

  public mostrarMensajeAlerta(id, index) {
    this._idVerificacionAEliminar = id;
    this.indexVerificacionSelected = index;
  }

  public filaAEliminar() {
    this.loading = true;
    this.llamarServicioEliminar();
  }

  private llamarServicioEliminar() {
    this.evaluacionApiService.eliminarVerificacion(this._idVerificacionAEliminar).subscribe(
      () => {
        this.mensajeError = null;
        this.llamarServicioListarVerificaciones();
      },
      (error: APIError) => {
        if (error) {
          this.loading = false;
          this.mensajeError = error.mensaje;
        }
      }
    );
  }
}
