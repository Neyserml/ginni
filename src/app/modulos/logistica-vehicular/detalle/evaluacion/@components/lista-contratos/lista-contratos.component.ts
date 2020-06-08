import { Component, Output, OnInit, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { IListaContratos } from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/contratos.interface';
import {
  getContratos,
  getContratosFailed,
  getContratosLoading
} from 'app/modulos/logistica-vehicular/detalle/evaluacion/@store';
import * as contratosAction from 'app/modulos/logistica-vehicular/detalle/evaluacion/@store/contratos.action';
import * as store from 'app/@compartidos/store';
import { EvaluacionApiService } from 'app/modulos/logistica-vehicular/detalle/evaluacion/evaluacion-api.service';
import { APIError } from 'app/@compartidos/models';
import { formatoMoneda } from 'app/@compartidos/utils/helpers';

@Component({
  selector: 'ginni-lista-contratos',
  templateUrl: './lista-contratos.component.html',
  styleUrls: []
})
export class ListaContratosComponent implements OnInit, OnDestroy {
  @Input()
  public idBloqueContrato: string;

  @Input()
  public puedeEditar: boolean;

  @Output()
  public abrirModalListaContratos = new EventEmitter();

  public contratos: IListaContratos[];
  public indexContratoVinculadoSelected = null;
  public _formatoMoneda = formatoMoneda;
  public loading: boolean;
  public guardadoError: string;
  public subscriptions: Subscription[] = [];

  private contratos$ = this.appState$.select(getContratos);
  public contratoLoading$ = this.appState$.select(getContratosLoading);
  public contratosFailed$ = this.appState$.select(getContratosFailed);

  constructor(
    private appState$: Store<store.State>,
    private evaluacionApiService: EvaluacionApiService
  ) {}

  ngOnInit() {
    this.appState$.dispatch(new contratosAction.LoadAction(this.idBloqueContrato));
    this.registrarEventos();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private registrarEventos() {
    this.subscriptions.push(
      this.contratos$.subscribe(contratos => {
        if (contratos) {
          this.contratos = contratos;
          this.guardadoError = null;
        }
      })
    );
  }

  public mostrarMensajeAlerta(index) {
    this.guardadoError = null;
    this.indexContratoVinculadoSelected = index;
  }

  public filaAEliminar() {
    this.loading = true;
    const contratoSelected = this.contratos[this.indexContratoVinculadoSelected];
    if (contratoSelected.creditoContratoId) {
      this.evaluacionApiService.desvincularContratos(contratoSelected.creditoContratoId).subscribe(
        () => {
          window.location.reload(true);
        },
        (error: APIError) => {
          if (error) {
            this.loading = false;
            this.guardadoError = error.mensaje;
          }
        }
      );
    }
  }
}
