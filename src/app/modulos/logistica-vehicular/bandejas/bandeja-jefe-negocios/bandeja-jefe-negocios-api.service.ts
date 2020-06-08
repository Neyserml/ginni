import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import { dateFormat } from 'app/@compartidos/utils/helpers';
import { IListarBandeja } from 'app/modulos/logistica-vehicular/bandejas/bandejas.interface';
import { IBandejaAprobadoRequest, IDescargaExcelRequest } from './@interfaces/bandeja.interface';
import { APIError } from 'app/@compartidos/models';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TipoBandeja } from '../bandejas.enum';

@Injectable()
export class BandejaJefeNegociosApiService {
  private apiUrl = environment.apiUrl;

  private celulaSeleccionada = new BehaviorSubject<string>('');
  public celulaSeleccionada$ = this.celulaSeleccionada.asObservable();

  private bandejaSeleccionada = new BehaviorSubject<string>(TipoBandeja.EnTramite);
  public bandejaSeleccionada$ = this.bandejaSeleccionada.asObservable();

  constructor(private http: HttpClient) {}

  public seleccionarCelula(valor: string) {
    this.celulaSeleccionada.next(valor);
  }

  public seleccionarBandeja(valor: string) {
    this.bandejaSeleccionada.next(valor);
  }

  public todoCelulas() {
    const endpoint = `${this.apiUrl}/administracion/configuraciongeneral/celula/todos`;
    return this.http.get(endpoint);
  }

  public busqueda(payload: any) {
    const endpoint = `${this.apiUrl}/fondoColectivo/contrato/bandeja`;
    return this.http.get(endpoint, { params: payload });
  }

  public bandejaAprobados(payload: IBandejaAprobadoRequest): Observable<IListarBandeja> {
    const endpoint = `${this.apiUrl}/fondoColectivo/contrato/bandeja/aprobado`;

    const params: any = {
      pagina: payload.pagina
    };

    if (payload.numeroContrato) {
      params.numeroContrato = payload.numeroContrato;
    }

    return this.http.get<IListarBandeja>(endpoint, { params });
  }

  public descargarExcel(payload: IDescargaExcelRequest): Observable<any> {
    const endpoint = `${this.apiUrl}/fondoColectivo/contrato/bandeja/export/excel`;
    const params = {};
    if (payload.filtro !== null) {
      params['filtro'] = payload.filtro;
      params['celula'] = payload.celula;
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

  public validarEntrarAlCaso(validarCasoRequest: String[]): Observable<APIError> {
    const endpoint = `${this.apiUrl}/logistica/evaluacionCrediticia/bloquecontrato/entrarCaso`;
    return this.http.post<APIError>(endpoint, validarCasoRequest);
  }
}
