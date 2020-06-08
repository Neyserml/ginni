import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';

@Injectable()
export class ValidacionDatosService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getDatosPersona(idPersona: number): Observable<any> {
    const endpoint = `${this.url}/administracion/persona/reactivaciones/${idPersona}/informacionPersonal`;
    return this.http.get(endpoint);
  }

  /*
  public asociadoCabecera(personasId: string[]): Observable<IDetalleCabeceraResponse> {
    const endpoint = `${this.url}/administracion/persona/reactivaciones/asociadosCabecera`;

    return this.http.post<IDetalleCabeceraResponse>(endpoint, personasId);
  }*/
}
