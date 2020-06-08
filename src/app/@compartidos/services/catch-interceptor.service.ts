import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { APIError } from '../models';
import * as store from '../store';
import * as sesionAction from '../store/sesion.action';
import { URL_SESION_FINALIZADA } from '../utils/consts';
import { esUnSVG } from '../utils/helpers';
import { RefreshApiService } from './refresh-api.service';
import { TokenInterceptorService } from './token-interceptor.service';

@Injectable()
export class CatchInterceptorService implements HttpInterceptor {
  constructor(
    private refreshApi: RefreshApiService,
    private tokenInterceptor: TokenInterceptorService,
    private appState$: Store<store.State>,
    private router: Router
  ) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (esUnSVG(req.url)) {
      return next.handle(req);
    }

    return next.handle(req).catch((error: APIError) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401 && this.tokenInterceptor.token) {
          return this.catchUnauthorized(req, error);
        }

        return Observable.throw(new APIError(error.status, error.error));
      } else {
        return Observable.throw(new APIError());
      }
    });
  }

  private catchUnauthorized(req: HttpRequest<any>, err: HttpErrorResponse) {
    const json = err.error;

    if (req.url === this.refreshApi.url) {
      this.router.navigate(URL_SESION_FINALIZADA);

      return Observable.throw(new APIError(err.status, json));
    } else if (json.error === 'invalid_token') {
      this.appState$.dispatch(new sesionAction.ExpireAction());
      this.appState$.dispatch(new sesionAction.LogoutAction());
      this.router.navigate(URL_SESION_FINALIZADA);

      return Observable.throw(new APIError(err.status, json));
    } else {
      return Observable.throw(new APIError(err.status, json));
    }
  }
}
