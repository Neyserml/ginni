import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import * as encabezado from '../@store/detalle.action';
import { getAsociadosState } from '../@store/index';
import * as store from 'app/@compartidos/store';
import { HASH } from 'app/@compartidos/utils/consts';

@Injectable()
export class EditarResolve implements Resolve<string> {
  public encabezado$: Subscription;
  constructor(private appState$: Store<store.State>) {}

  resolve(route: ActivatedRouteSnapshot): Observable<string> {
    const idPersona = route.params['idPersona'];
    const regexIdBloqueContrato = /\d+/g;

    const rutaInicioPosicion = window.location.href.indexOf(HASH);
    const ruta = window.location.href.slice(rutaInicioPosicion);
    if (ruta) {
      const idBloqueContrato = regexIdBloqueContrato.exec(ruta)[0];
      this.appState$.dispatch(new encabezado.LoadAction(idBloqueContrato));
    }

    return new Observable(observer => {
      this.encabezado$ = this.appState$
        .select(getAsociadosState)
        .delay(100)
        .subscribe(state => {
          if ((state.data && state.loading === false) || state.failed) {
            let tipoPersona;
            if (state.data) {
              const personas = state.data.personas;
              tipoPersona = personas.filter(persona => persona.idPersona === idPersona)[0]
                .tipoPersona;
            }
            observer.next(tipoPersona);
            observer.complete();
            this.encabezado$.unsubscribe();
          }
        });
    });
  }
}
