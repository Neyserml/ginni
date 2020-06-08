import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';

@Injectable()
export class RecuperarContraseniaApiService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public restore(data: any): Observable<any> {
    const endpoint = this.url + '/administracion/autentificacion/restablecercontrasenia';
    return this.http.post(endpoint, data);
  }
}
