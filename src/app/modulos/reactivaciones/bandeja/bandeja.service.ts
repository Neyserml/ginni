import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {
  CarteraGeneralRequest,
  CarteraGeneralResponse,
  IReactivacionItemResponsive
} from './@models/bandeja.interface';
import { BloqueosEnBandeja } from './bandeja.interface';
import { dateFormat } from 'app/@compartidos/utils/helpers';
import { environment } from 'environments/environment';

@Injectable()
export class BandejaService {
  private apiUrl = environment.apiUrl;
  private url = this.apiUrl + '/fondoColectivo/reactivacioncontrato/';

  constructor(private http: HttpClient) {}

  private _contratoActual: IReactivacionItemResponsive = null;
  private _personaIds: string[] = [];

  public get contratoActual(): IReactivacionItemResponsive {
    return this._contratoActual;
  }

  public set contratoActual(contrato: IReactivacionItemResponsive) {
    this._contratoActual = contrato;
  }

  public get personaIds(): string[] {
    return this._personaIds;
  }

  public set personaIds(personaIds: string[]) {
    this._personaIds = personaIds;
  }

  public getContratoActual() {
    return this._contratoActual;
  }

  public getPersonaIds() {
    return this._personaIds;
  }

  public enCarteraGeneral(
    carteraGeneralRequest: CarteraGeneralRequest
  ): Observable<CarteraGeneralResponse> {
    const endpoint = this.url + 'bandejaCartera';
    if (carteraGeneralRequest) {
      const params = new HttpParams()
        .set('buscar', carteraGeneralRequest.buscar ? carteraGeneralRequest.buscar.toString() : '')
        .set('pagina', carteraGeneralRequest.pagina ? carteraGeneralRequest.pagina.toString() : '');
      const options = { params };

      return this.http.get<CarteraGeneralResponse>(endpoint, options);
    } else {
      return this.http.get<CarteraGeneralResponse>(endpoint);
    }
  }

  public enReactivacion(reactivacionRequest: any): Observable<any> {
    const endpoint = this.url + 'bandeja';

    return this.http.get(endpoint, {
      params: reactivacionRequest
    });
  }

  public reactivacionSummary(): Observable<any> {
    const endpoint = this.url + 'tooltipBandejaResueltos';

    return this.http.get(endpoint);
  }

  public descargarExcel(buscar: string = null): Observable<any> {
    const endpoint = this.url + 'reportes/cartera/excel';
    const params = {};
    if (buscar !== null) {
      params['buscar'] = buscar;
    }

    return this.http
      .get(endpoint, {
        responseType: 'blob',
        params
      })
      .map(response => {
        const date = dateFormat(String(new Date()));
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(response);
        a.download = `Bandeja de Resueltos al ${date}.xls`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        return response;
      });
  }

  public ingresaAlCaso(reactivacionContratoID: number): Observable<BloqueosEnBandeja> {
    const endpoint = `${this.apiUrl}/fondoColectivo/reactivacionpago/detalleContrato/bloqueosEnBandeja/${reactivacionContratoID}`;

    return this.http.get<BloqueosEnBandeja>(endpoint);
  }
}
