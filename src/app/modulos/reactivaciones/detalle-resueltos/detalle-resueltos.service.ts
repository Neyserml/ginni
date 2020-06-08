import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';
import {
  AdjudicadosTipo,
  CargarSimulacionResponse,
  CiaTipo,
  CodigoNumero,
  CodigoValor,
  ContratoResueltoInfoSimulacion,
  ContratoResueltoRelacionadosSimulacion,
  ContratosYTipoDeBien,
  FondoDeRemateResponse,
  GenerarObligacionACuentaResponse,
  GenerarSimulacionRequest,
  GruposSimulacionResponse,
  GuardarSimulacionRequest,
  GuardarSimulacionResponse,
  HistorialDePagoResponse,
  InformacionContratoResueltoResponse,
  ListaDeGruposRequest,
  ListaDeGruposResponse,
  ListasSimulacionResponse,
  MovimientosAdministrativosResponse,
  PagarObligacionACuentaResponse,
  PagoGeneradoResponse,
  ProximasAsambleasTipo,
  SimulacionResponse,
  SimuladorPutRequest,
  SimuladorRequest,
  SimuladorResponse,
  TiposDeBien
} from './detalle-resueltos.interface';
import {
  IDetalleCabeceraResponse,
  IGetDetalleCabeceraResponse
} from 'app/@compartidos/interfaces/detalle.interface';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IPersonaSeleccionada } from 'app/modulos/reactivaciones/detalle-resueltos/@interfaces/persona-seleccionada.interface';

@Injectable()
export class DetalleResueltosService {
  private url = environment.apiUrl;

  private _personaActual = new BehaviorSubject<IPersonaSeleccionada>(null);
  public getPersonaActual$ = this._personaActual.asObservable();

  constructor(private http: HttpClient) {}

  public setPersonaActual(persona: IPersonaSeleccionada) {
    this._personaActual.next(persona);
  }

  public asociadoCabecera(personasId: string[]): Observable<IDetalleCabeceraResponse> {
    const endpoint = `${this.url}/administracion/persona/reactivaciones/asociadosCabecera`;

    return this.http.post<IDetalleCabeceraResponse>(endpoint, personasId);
  }

  public getAsociadoCabecera(contratoId: string): Observable<IGetDetalleCabeceraResponse> {
    const endpoint = `${this.url}/fondoColectivo/reactivacioncontrato/asociados/${contratoId}`;

    return this.http.get<IGetDetalleCabeceraResponse>(endpoint);
  }

  public getInformacionContratoResuelto(
    contratoId: number
  ): Observable<InformacionContratoResueltoResponse> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/contratoResueltoInfo/${contratoId}`;

    return this.http.get<InformacionContratoResueltoResponse>(endpoint);
  }

  public getFondoDeRemate(contratoId: number): Observable<FondoDeRemateResponse> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/fondoRemateInfo/${contratoId}`;

    return this.http.get<FondoDeRemateResponse>(endpoint);
  }

  public getMovimientosAdministrativos(
    reactivacionContratoId: number
  ): Observable<MovimientosAdministrativosResponse> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/movimientoadministrativo/${reactivacionContratoId}/detalle`;

    return this.http.get<MovimientosAdministrativosResponse>(endpoint);
  }

  public getCiaDetalle(reactivacionContratoId: number): Observable<CiaTipo[]> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/ci/detalle?reactivacionContratoId=${reactivacionContratoId}`;

    return this.http.get<CiaTipo[]>(endpoint);
  }

  public getProximasAsambleas(reactivacionContratoId: number): Observable<ProximasAsambleasTipo[]> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/proximasAsambleas/${reactivacionContratoId}`;

    return this.http.get<ProximasAsambleasTipo[]>(endpoint);
  }

  public getContratoResueltoInfoSimulacion(
    reactivacionContratoId: number
  ): Observable<ContratoResueltoInfoSimulacion> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/contratoResueltoInfoSimulacion/${reactivacionContratoId}`;

    return this.http.get<ContratoResueltoInfoSimulacion>(endpoint);
  }

  public getContratoResueltoRelacionadosSimulacion(
    contratoId: number
  ): Observable<ContratoResueltoRelacionadosSimulacion[]> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/contratoResueltoRelacionadosSimulacion/${contratoId}`;

    return this.http.get<ContratoResueltoRelacionadosSimulacion[]>(endpoint);
  }

  public getTiposDeBien(): Observable<TiposDeBien[]> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/tipoBien`;

    return this.http.get<TiposDeBien[]>(endpoint);
  }

  public getProductosPorContratosYTipoDeBien(
    programasYTipoDeBien: ContratosYTipoDeBien
  ): Observable<CodigoValor[]> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/contratoResueltoSimulacion/productos`;

    return this.http.post<CodigoValor[]>(endpoint, programasYTipoDeBien);
  }

  public getListaDeGrupos(
    listaDeGrupos: ListaDeGruposRequest
  ): Observable<ListaDeGruposResponse[]> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/contratoResueltoSimulacion/grupos`;

    return this.http.post<ListaDeGruposResponse[]>(endpoint, listaDeGrupos);
  }

  public getAsambleasAdjudicadas(grupoId: number): Observable<AdjudicadosTipo[]> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/detalleContrato/asambleasAdjudicadas/${grupoId}`;

    return this.http.get<AdjudicadosTipo[]>(endpoint);
  }

  public getInversionInmobiliaria(tipoDeBien: number): Observable<CodigoValor[]> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/inversionInmobiliaria/${tipoDeBien}`;

    return this.http.get<CodigoValor[]>(endpoint);
  }

  public getCertificados(grupoId: number): Observable<CodigoNumero[]> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/certificados/${grupoId}`;

    return this.http.get<CodigoNumero[]>(endpoint);
  }

  public getMarcasByProductoId(productoId: number): Observable<CodigoValor[]> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/marcas/${productoId}`;

    return this.http.get<CodigoValor[]>(endpoint);
  }

  public getModelosByMarcaId(marcaId: number): Observable<CodigoValor[]> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/modelos/${marcaId}`;

    return this.http.get<CodigoValor[]>(endpoint);
  }

  public getSimulation(simulacionRequest: SimuladorRequest): Observable<SimuladorResponse> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/simular`;

    return this.http.post<SimuladorResponse>(endpoint, simulacionRequest);
  }

  public putSimulation(updateSimulacion: SimuladorPutRequest): Observable<SimuladorResponse> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/simular`;

    return this.http.put<SimuladorResponse>(endpoint, updateSimulacion);
  }

  public getMetodos(grupoId: number): Observable<CodigoValor[]> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/simular/metodos?grupoId=${grupoId}`;

    return this.http.get<CodigoValor[]>(endpoint);
  }

  public guardarSimulacion(
    guardarSimulacion: GuardarSimulacionRequest
  ): Observable<GuardarSimulacionResponse> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/guardarSimulacion`;

    return this.http.post<GuardarSimulacionResponse>(endpoint, guardarSimulacion);
  }

  public consultarValidacion(contratoId: number): Observable<CargarSimulacionResponse> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/validarSimulacion/${contratoId}`;

    return this.http.get<CargarSimulacionResponse>(endpoint);
  }

  public cargarSimulacionGrupos(contratoId: number): Observable<GruposSimulacionResponse> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/cargaListaContratosInfoSimulacion/${contratoId}`;

    return this.http.get<GruposSimulacionResponse>(endpoint);
  }

  public cargarSimulacionListas(contratoId: number): Observable<ListasSimulacionResponse> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/cargarListasSimulacion/${contratoId}`;

    return this.http.get<ListasSimulacionResponse>(endpoint);
  }

  public cargarSimulacion(contratoId: number): Observable<SimulacionResponse> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/cargarSimulacion/${contratoId}`;

    return this.http.get<SimulacionResponse>(endpoint);
  }

  public generarObligacionACuenta(
    payload: GuardarSimulacionRequest
  ): Observable<GenerarObligacionACuentaResponse> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/contrato/generar`;

    return this.http.post<GenerarObligacionACuentaResponse>(endpoint, payload);
  }

  public pagarObligacionACuenta(
    payload: GenerarSimulacionRequest
  ): Observable<PagarObligacionACuentaResponse> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/pagarObligacionaCuenta`;

    return this.http.post<PagarObligacionACuentaResponse>(endpoint, payload);
  }

  public getHistorialDePago(contratoId: number): Observable<HistorialDePagoResponse> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/historial/${contratoId}`;

    return this.http.get<HistorialDePagoResponse>(endpoint);
  }

  public deleteHistorialDePago(solicitudIdSaf: number): Observable<HistorialDePagoResponse> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/eliminarPago/${solicitudIdSaf}`;

    return this.http.get<HistorialDePagoResponse>(endpoint);
  }

  public validarPagoGenerado(contratoId: number): Observable<PagoGeneradoResponse> {
    const endpoint = `${this.url}/fondoColectivo/reactivacionpago/validarPagoGenerado/${contratoId}`;

    return this.http.get<PagoGeneradoResponse>(endpoint);
  }
}
