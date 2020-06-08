import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Observable';
import { IDocumento } from 'app/modulos/portal/@interface/generales.interface';
import {
  IListaContratosSimulador,
  IListarContratosRequest,
  ISimuladorIniciarDatos,
  ISimuladorCalcularRequest,
  ISimuladorConsultarRequest
} from './@interfaces/simulador.interface';
import {
  ISimuladorCalcularResponse,
  ISimuladorCategoria,
  ISimuladorCalcularDiferenciaResponse,
  ISimuladorCalcularDiferenciaRequest
} from 'app/@compartidos/interfaces/simulador-financiamiento.interface';
import { ConfiguracionEvaluacionCrediticia } from 'app/modulos/portal/@models/configuracion.model';

@Injectable()
export class SimuladorApiService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private _servicioPayload = null;

  public get listarServiciosPayload(): IListarContratosRequest {
    return this._servicioPayload;
  }

  public set listarServiciosPayload(value: IListarContratosRequest) {
    this._servicioPayload = value;
  }

  public buscarPorDocumento(payload: IDocumento) {
    const endpoint = `${this.url}/administracion/persona/${payload.tipoDocumento}/${payload.numeroDocumento}`;
    return this.http.get(endpoint);
  }

  public listarPorPersona(idPersona: number): Observable<IListaContratosSimulador[]> {
    const endpoint = `${this.url}/fondoColectivo/contrato/persona/${idPersona}`;
    return this.http.get<IListaContratosSimulador[]>(endpoint);
  }

  public listarPorContrato(numeroContrato: number): Observable<IListaContratosSimulador[]> {
    const endpoint = `${this.url}/fondoColectivo/contrato/numeroContrato/${numeroContrato}`;
    return this.http.get<IListaContratosSimulador[]>(endpoint);
  }

  public seleccionarContrato(contratoID: number): Observable<IListaContratosSimulador[]> {
    const endpoint = `${this.url}/fondoColectivo/contrato/${contratoID}/seleccionar`;
    return this.http.get<IListaContratosSimulador[]>(endpoint);
  }

  // simulador

  public simuladorIniciarDatos(idContratos: number[]): Observable<ISimuladorIniciarDatos> {
    const endpoint = `${this.url}/logistica/financiamiento/simulador/open/iniciar`;
    return this.http.post<ISimuladorIniciarDatos>(endpoint, idContratos);
  }

  public simuladorCalcular(
    payload: ISimuladorCalcularRequest
  ): Observable<ISimuladorCalcularResponse> {
    const endpoint = `${this.url}/logistica/financiamiento/simulador/open/conceptos`;
    return this.http.post<ISimuladorCalcularResponse>(endpoint, payload);
  }

  public categoriaSimularFinanciamiento(
    payload: ISimuladorConsultarRequest
  ): Observable<ISimuladorCategoria> {
    const endpoint = `${this.url}/logistica/financiamiento/simulador/open/simularFinanciamiento`;
    return this.http.post<ISimuladorCategoria>(endpoint, payload);
  }

  public calcularDiferencia(
    idbloquecontrato: string,
    montos: ISimuladorCalcularDiferenciaRequest
  ): Observable<ISimuladorCalcularDiferenciaResponse> {
    const endpoint =
      this.url +
      `/logistica/financiamiento/simulador/bloquecontrato/${idbloquecontrato}/calculardiferencia`;
    return this.http.post<ISimuladorCalcularDiferenciaResponse>(endpoint, montos);
  }

  public enviarPDF(idContratos: number[]) {
    const endpoint = `${this.url}/logistica/financiamiento/open/descargar`;
    return this.http.post(endpoint, idContratos, { responseType: 'blob' });
  }

  public configuracionGeneralAdicional(): Observable<ConfiguracionEvaluacionCrediticia> {
    const endpoint = this.url + `/logistica/evaluacionCrediticia/lista/generales`;
    return this.http.get<ConfiguracionEvaluacionCrediticia>(endpoint);
  }
}
