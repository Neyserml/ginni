import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { getLocalidadesState } from 'app/modulos/portal/@store/index';
import * as localidadesAction from 'app/modulos/portal/@store/localidades.action';
import * as store from 'app/@compartidos/store';

@Injectable()
export class LocalidadesResolve implements Resolve<boolean> {
  public localidades$: Subscription;
  constructor(private appState$: Store<store.State>) {}

  resolve(): Observable<boolean> {
    this.appState$.dispatch(new localidadesAction.LoadPaisesAction());
    this.appState$.dispatch(new localidadesAction.LoadDepartametoAction());

    return new Observable(observer => {
      this.localidades$ = this.appState$
        .select(getLocalidadesState)
        .delay(100)
        .subscribe(state => {
          if (state.data || state.failed) {
            observer.next(true);
            observer.complete();
            this.localidades$.unsubscribe();
          }
        });
    });
  }
}
