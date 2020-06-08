import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import { dateFormat } from 'app/@compartidos/utils/helpers';
import { APIError } from 'app/@compartidos/models/api-error.model';

@Injectable()
export class BandejaFuncionarioApiService {
  private apiUrl = environment.apiUrl;
  private urlContrato = this.apiUrl + `/fondoColectivo/`;
  private urlEvalCred = this.apiUrl + '/logistica/evaluacionCrediticia/';

  constructor(private http: HttpClient) {}

  public enTramite(tramiteRequest: any): Observable<any> {
    const endpoint = this.urlContrato + 'contrato/bandeja';

    return this.http.get(endpoint, {
      params: tramiteRequest
    });
  }

  public validarEntrarAlCaso(validarCasoRequest: String[]): Observable<APIError> {
    const endpoint = this.urlEvalCred + 'bloquecontrato/entrarCaso';
    return this.http.post<APIError>(endpoint, validarCasoRequest);
  }

  public _dateFormat = dateFormat;

  public descargarExcel(filtro: string = null): Observable<any> {
    const endpoint = this.urlContrato + 'contrato/bandeja/export/excel';
    const params = {};
    if (filtro !== null) {
      params['filtro'] = filtro;
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
        a.download = `Bandeja de Trabajo al ${date}.xls`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        return response;
      });
  }
}
