import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { State, getSesionToken } from '../store';
import { Sesion } from '../models';
import { esUnSVG } from '../utils/helpers';
import { RefreshApiService } from './refresh-api.service';

@Injectable()
export class TokenInterceptorService implements HttpInterceptor {
  public token;
  public refreshToken;
  private sesion: Sesion;
  private _esUnSVG = esUnSVG;

  constructor(private store: Store<State>, private refreshApi: RefreshApiService) {
    this.subscribeToTokenChanges();
  }

  private subscribeToTokenChanges() {
    this.store.select(getSesionToken).subscribe(this.setToken);
  }

  private setToken = sesion => {
    if (sesion && sesion.data && sesion.token) {
      this.sesion = sesion.data;
      this.refreshToken = sesion.data.refreshToken;
      this.token = sesion.token;
    } else {
      this.sesion = new Sesion();
      this.refreshToken = null;
      this.token = null;
    }
  };

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this._esUnSVG(req.url)) {
      return next.handle(req);
    }
    const authorizedReq = this.setAuthHeader(req);
    const handledRequest = next.handle(authorizedReq);
    return handledRequest;
  }

  public setAuthHeader(req: HttpRequest<any>): HttpRequest<any> {
    if (this.token && req.url !== this.refreshApi.url) {
      // Actualizar el tiempo de vida de Token
      this.sesion.actualizarTiempo();

      // Agregar token en header
      const authToken = `Bearer ${this.token}`;
      const headers = req.headers.set('Authorization', authToken);
      const authorizedReq = req.clone({ headers });
      return authorizedReq;
    }
    return req;
  }
}
