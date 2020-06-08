import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PedidoApiService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public obtenerIngresos(payload): Observable<any> {
    const endpoint = `${this.url}/administracion/persona/${payload.idPersona}/ingresos?nombreOrigenPrincipal=${payload.garanteORespaldo}`;

    return this.http.get(endpoint);
  }
}
