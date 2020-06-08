import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as store from 'app/@compartidos/store';
import { getLaboral } from 'app/modulos/logistica-vehicular/detalle/@store';
import * as laboralAction from 'app/modulos/logistica-vehicular/detalle/@store/laboral.action';

@Injectable()
export class PedidoFacadeService {
  constructor(public appState$: Store<store.State>) {}

  public laboral$ = this.appState$.select(getLaboral);

  public cargarDatosLaboral(idPersona: string) {
    this.appState$.dispatch(new laboralAction.LoadAction(idPersona));
  }
}
