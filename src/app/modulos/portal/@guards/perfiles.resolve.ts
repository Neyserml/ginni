import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { getPerfilesState } from '../@store';
import * as perfilesAction from '../@store/perfiles.action';
import * as store from 'app/@compartidos/store';

@Injectable()
export class PerfilesResolve implements Resolve<Boolean> {
  public perfilesState$: Subscription;
  public usuarioLoaded$: Subscription;
  public usuarioFailed$: Subscription;

  constructor(private appState$: Store<store.State>) {}

  resolve(): Observable<boolean> {
    this.appState$.dispatch(new perfilesAction.LoadAction());

    return new Observable(observer => {
      this.perfilesState$ = this.appState$.select(getPerfilesState).subscribe(state => {
        if (state.data || state.failed) {
          observer.complete();
          this.perfilesState$.unsubscribe();
        }
      });
    });
  }
}
