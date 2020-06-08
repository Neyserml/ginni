import { Component, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';
import { cloneArray, dateFormat } from 'app/@compartidos/utils/helpers';
import { COLUMNAS_SEGUIMIENTO } from './seguimiento.enum';
import { Store } from '@ngrx/store';
import * as store from 'app/@compartidos/store';
import * as seguimientoAction from 'app/modulos/logistica-vehicular/detalle/evaluacion/@store/seguimiento.action';
import { Subscription } from 'rxjs/Subscription';
import {
  getSeguimiento,
  getSeguimientoLoading,
  getSeguimientoFailed
} from 'app/modulos/logistica-vehicular/detalle/evaluacion/@store';
import {
  ISeguimientoResponse,
  IListarSeguimiento,
  ISeguimientoRequest
} from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/seguimiento.interface';
import { EvaluacionApiService } from '../../evaluacion-api.service';

@Component({
  selector: 'ginni-seguimiento-evaluacion',
  templateUrl: './seguimiento.component.html',
  styleUrls: ['./seguimiento.component.scss']
})
export class SeguimientoEvaluacionComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  public idBloqueContrato: string;

  public columnas = cloneArray(COLUMNAS_SEGUIMIENTO);
  public _dateFormat = dateFormat;
  public paginaActual = 1;
  public listarSeguimiento: IListarSeguimiento[];
  public loading: boolean;
  public subscriptions: Subscription[] = [];
  public totalRegistros: number;
  public numeroPaginas: number;
  public tamanioPaginador = 6;

  public seguimiento$ = this.appState$.select(getSeguimiento);
  public seguimientoLoading$ = this.appState$.select(getSeguimientoLoading);
  public seguimientoFailed$ = this.appState$.select(getSeguimientoFailed);

  constructor(
    public appState$: Store<store.State>,
    public evaluacionApiService: EvaluacionApiService
  ) {}

  public ngOnInit(): void {
    this.listarSeguimientos();
    this.registrarEventos();
  }

  public ngOnChanges() {}

  public ngOnDestroy() {
    this.desregistrarEventos();
  }

  private desregistrarEventos() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public listarSeguimientos() {
    const payload: ISeguimientoRequest = {
      codigoContrato: this.idBloqueContrato,
      pagina: this.paginaActual,
      cantidad: 10
    };

    this.appState$.dispatch(new seguimientoAction.LoadAction(payload));
  }

  public registrarEventos() {
    this.subscriptions.push(
      this.seguimiento$.subscribe((seguimiento: ISeguimientoResponse) => {
        if (seguimiento) {
          this.listarSeguimiento = seguimiento.listBandejaHistorial;
          this.totalRegistros = seguimiento.totalRegistros;
          this.numeroPaginas = seguimiento.numeroPaginas;
        }
      })
    );
  }

  public get actividades() {
    return `${this.totalRegistros} actividades`;
  }

  public pagina() {}

  public descargarPDF() {
    this.loading = true;
    this.evaluacionApiService
      .descargarSeguimientoPDF({ codigoContrato: this.idBloqueContrato })
      .subscribe((blob: Blob) => {
        if (blob) {
          this.loading = false;
          const date = this._dateFormat(String(new Date()));

          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = `Seguimiento ${date}.pdf`;
          link.click();
        }
      });
  }
}
