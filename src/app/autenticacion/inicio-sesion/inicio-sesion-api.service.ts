import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';

@Injectable()
export class InicioSesionApiService {
  private apiUrl = environment.apiUrl;
  private url = this.apiUrl + `/administracion/autentificacion/`;

  constructor(private http: HttpClient) {}

  public login(data): Observable<any> {
    const endpoint = this.url + 'login';

    return this.http.post(endpoint, data);
  }

  public recuperarContrasenia(data): Observable<any> {
    const endpoint = this.url + 'validaReestablecerContrasenia';

    return this.http.post(endpoint, data);
  }

  public logout(): Observable<any> {
    const endpoint = this.url + 'salir';

    return this.http.post(endpoint, {});
  }
}
