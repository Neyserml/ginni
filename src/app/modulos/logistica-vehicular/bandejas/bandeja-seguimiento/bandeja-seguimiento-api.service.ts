import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import { IListarBandejaRequest } from './@interfaces/bandeja-seguimiento.interface';
import { IListarBandeja } from 'app/modulos/logistica-vehicular/bandejas/bandejas.interface';

@Injectable()
export class BandejaSeguimientoApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public listar(payload: IListarBandejaRequest): Observable<IListarBandeja> {
    let endpoint: string;
    const params: any = {
      pagina: payload.paginaActual
    };

    if (payload.contrato) {
      params['numeroContrato'] = payload.contrato;
    }

    endpoint = `${this.apiUrl}/fondoColectivo/contrato/bandeja/${payload.estadoBandeja}`;

    return this.http.get<IListarBandeja>(endpoint, { params });
  }
}
