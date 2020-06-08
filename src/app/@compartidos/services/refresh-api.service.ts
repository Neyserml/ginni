import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { IRefreshToken } from '../interfaces/autenticacion.interface';

@Injectable()
export class RefreshApiService {
  public url = environment.apiUrl + '/administracion/autentificacion/refresh-token';

  constructor(private http: HttpClient) {}

  public refresh(refreshToken: IRefreshToken): Observable<any> {
    const endpoint = this.url;
    return this.http.post(endpoint, refreshToken);
  }
}
