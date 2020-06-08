import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {
  IAgregarGarante,
  IGaranteDetalle,
  IBuscarGarante
} from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/garante.interface';
import { environment } from 'environments/environment';
import {
  IDatosVerificacionRequest,
  IDatosVerificacionResponse,
  IArchivoAdjunto,
  IListadoVerificaciones,
  IActualizarVerificacionRequest
} from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/datosVerificacion.interface';
import { Store } from '@ngrx/store';
import {
  ISimuladorConceptosRequest,
  ISimuladorCalcularResponse,
  ISimuladorCategoria
} from 'app/@compartidos/interfaces/simulador-financiamiento.interface';
import { IBloqueContrato } from 'app/@compartidos/interfaces/detalle.interface';
import {
  ISimuladorDatosInformativos,
  ISimuladorIniciar
} from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/simulador.interface';
import {
  IModalContrato,
  IMensajeAdvertencia
} from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/modal-lista-contratos.interface';
import {
  IBotonAccionRequest,
  IMensaje,
  ICheckboxesRequest
} from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/documentos-personas.interface';
import {
  ISeguimientoRequest,
  ISeguimientoResponse,
  ISeguimientoDescargarRequest
} from 'app/modulos/logistica-vehicular/detalle/evaluacion/@interface/seguimiento.interface';

@Injectable()
export class EvaluacionApiService {
  /**
   * Mensaje de cabecera cuando se graba información garante
   */
  private _mensajesSistema: string[];

  public get mensajesSistemas(): string[] {
    return this._mensajesSistema;
  }

  public set mensajesSistemas(personaIds: string[]) {
    this._mensajesSistema = personaIds;
  }

  private estadoModalDocumentos = new BehaviorSubject<boolean>(false);
  public actualizarListaDocumentos$ = this.estadoModalDocumentos.asObservable();

  private estadoModalVerificaciones = new BehaviorSubject<boolean>(false);
  public seCerroModalVerificaciones$ = this.estadoModalVerificaciones.asObservable();

  private url = environment.apiUrl;

  constructor(private http: HttpClient, private store: Store<any>) {}

  public actualizarListaDocumentos(value: boolean) {
    this.estadoModalDocumentos.next(value);
  }

  public actualizarListaVerificaciones(id) {
    this.estadoModalVerificaciones.next(id);
  }

  public obtenerEstado() {
    return this.store.select('evaluacion');
  }

  public enviarNotificaciones(idBloqueContrato: IBloqueContrato) {
    const endpoint = this.url + `/logistica/evaluacionCrediticia/enviarNotificaciones/requisitos`;
    return this.http.post(endpoint, idBloqueContrato);
  }

  public validarInicioEvaluacion(bloqueContrato: string): Observable<any> {
    const endpoint =
      this.url +
      `/logistica/evaluacionCrediticia/bloquecontrato/${bloqueContrato}/evaluacion/crediticia/validarInicio`;

    return this.http.get(endpoint);
  }

  public iniciar(bloqueContrato: string): Observable<any> {
    const endpoint =
      this.url +
      `/logistica/evaluacionCrediticia/bloquecontrato/${bloqueContrato}/evaluacion/crediticia/iniciar`;

    return this.http.get(endpoint);
  }

  /**
   * Lista Contratos
   */
  public contratos(idBloqueContrato: string): Observable<any> {
    const endpoint =
      this.url +
      `/logistica/evaluacionCrediticia/bloquecontrato/${idBloqueContrato}/evaluacion/crediticia/contratos`;

    return this.http.get(endpoint);
  }

  public modalContratos(idbloquecontrato: string): Observable<IModalContrato[]> {
    const endpoint = `${this.url}/fondoColectivo/contrato/vinculacion/${idbloquecontrato}/listar`;
    return this.http.get<IModalContrato[]>(endpoint);
  }

  public modalContratosMensaje(numeroContratos: string[]): Observable<IMensajeAdvertencia> {
    const endpoint = `${this.url}/fondoColectivo/contrato/vinculacion/mensajeConfirmacion`;
    return this.http.post<IMensajeAdvertencia>(endpoint, numeroContratos);
  }

  public agregarContratos(idbloquecontrato: string, contratos: number[]): Observable<number[]> {
    const endpoint = `${this.url}/fondoColectivo/contrato/vinculacion/${idbloquecontrato}/vincularContratos`;
    return this.http.post<number[]>(endpoint, contratos);
  }

  public desvincularContratos(creditoContratoId: number): Observable<any> {
    const endpoint = `${this.url}/logistica/financiamiento/credito/${creditoContratoId}`;
    return this.http.delete(endpoint);
  }

  /**
   * Lista Documentos
   */
  public documentosPersonas(idBloqueContrato: string): Observable<any> {
    const endpoint =
      this.url +
      `/logistica/evaluacionCrediticia/bloquecontrato/${idBloqueContrato}/evaluacion/crediticia/personas`;

    return this.http.get(endpoint);
  }

  public eliminarDocumentos(payload): Observable<any> {
    const endpoint =
      this.url +
      `/logistica/evaluacionCrediticia/persona/${payload.idBloqueContrato}/garanteRespaldo/${payload.idCreditoPersona}/eliminar`;
    return this.http.delete(endpoint);
  }

  public modalListaDocumentos(idCreditoPersona: number): Observable<any> {
    const endpoint =
      this.url + `/logistica/evaluacionCrediticia/persona/${idCreditoPersona}/documentos`;
    return this.http.get(endpoint);
  }

  public modalAgregarOpcionales(payload): Observable<any> {
    const endpoint =
      this.url +
      `/logistica/evaluacionCrediticia/persona/${payload.idCreditoPersona}/agregardocumentos`;
    return this.http.post(endpoint, payload.documentoId);
  }

  public modalAgregarDocumento(idCreditoPersona: number, file): Observable<any> {
    const endpoint =
      this.url + `/logistica/evaluacionCrediticia/persona/${idCreditoPersona}/documentos`;
    return this.http.post(endpoint, file);
  }

  public modalEliminarArchivo(payload): Observable<any> {
    const endpoint =
      this.url +
      `/logistica/evaluacionCrediticia/persona/${payload.idCreditoPersona}/documentos/${payload.creditoPersonaDocumentoId}/archivo`;
    return this.http.delete(endpoint);
  }

  public modalEliminarDocumento(payload): Observable<any> {
    const endpoint =
      this.url +
      `/logistica/evaluacionCrediticia/persona/${payload.idCreditoPersona}/documentos/${payload.creditoPersonaDocumentoId}`;
    return this.http.delete(endpoint);
  }

  public modalListaDocumentosAdicionales(idCreditoPersona: number): Observable<any> {
    const endpoint =
      this.url +
      `/logistica/evaluacionCrediticia/persona/${idCreditoPersona}/documentosAdicionales`;
    return this.http.get(endpoint);
  }

  public modalObservacion(idCreditoPersona: number, creditoObservacion: string): Observable<any> {
    const endpoint =
      this.url + `/logistica/evaluacionCrediticia/persona/${idCreditoPersona}/documentos`;
    return this.http.put(endpoint, creditoObservacion);
  }

  public buscarRespaldo(payload: IBuscarGarante): Observable<IGaranteDetalle> {
    const endpoint =
      this.url +
      `/logistica/evaluacionCrediticia/buscarPersona/tipoDocumento/${payload.tipoDocumento}/numeroDocumento/${payload.numeroDocumento}?bloqueContratoID=${payload.idBloqueContrato}`;

    return this.http.get<IGaranteDetalle>(endpoint);
  }

  public agregarRespaldo(payload: IAgregarGarante, idBloqueContrato: string): Observable<number> {
    const endpoint =
      this.url +
      `/logistica/evaluacionCrediticia/bloqueContrato/${idBloqueContrato}/persona/natural`;

    return this.http.post<number>(endpoint, payload);
  }

  public actualizarRespaldo(payload: IAgregarGarante): Observable<any> {
    const endpoint = this.url + `/administracion/persona/natural/editarPersona`;
    return this.http.put(endpoint, payload);
  }

  public modalSubirArchivoYComentario(payload, idCreditoPersona): Observable<any> {
    const endpoint =
      this.url + `/logistica/evaluacionCrediticia/persona/${idCreditoPersona}/documentos`;
    return this.http.post(endpoint, payload);
  }

  public modalDescargarDocumento(payload) {
    const endpoint = this.url + `/integracion/aws/documento/descargar`;
    return this.http.post(endpoint, payload, { responseType: 'blob' });
  }

  public modalValidarExtensionyTamanio(
    idCreditoPersona: number,
    tamanio: number,
    extension: string
  ) {
    const endpoint =
      this.url +
      `/logistica/evaluacionCrediticia/persona/${idCreditoPersona}/documentos/validar?tamanio=${tamanio}&extension=${extension}`;
    return this.http.get(endpoint);
  }

  public aprobarEvaluacion(payload: IBotonAccionRequest): Observable<IMensaje> {
    const endpoint = `${this.url}/logistica/financiamiento/seguimiento/aprobado`;
    return this.http.post<IMensaje>(endpoint, payload);
  }

  public enviarComite(payload: IBotonAccionRequest): Observable<IMensaje> {
    const endpoint = `${this.url}/logistica/financiamiento/seguimiento/envioComite`;
    return this.http.post<IMensaje>(endpoint, payload);
  }

  public observarEvaluacion(payload: IBotonAccionRequest): Observable<IMensaje> {
    const endpoint = `${this.url}/logistica/financiamiento/seguimiento/observado`;
    return this.http.post<IMensaje>(endpoint, payload);
  }

  public siguienteBloque(payload: IBotonAccionRequest): Observable<IMensaje> {
    const endpoint = `${this.url}/logistica/financiamiento/seguimiento/siguiente`;
    return this.http.post<IMensaje>(endpoint, payload);
  }

  public anularEvaluacion(payload: IBotonAccionRequest): Observable<IMensaje> {
    const endpoint = `${this.url}/logistica/evaluacionCrediticia/bloquecontrato/${payload.bloqueContratoId}/evaluacion/crediticia/anular`;
    return this.http.delete<IMensaje>(endpoint);
  }

  // Actualizar checkboxes

  public actualizarVerificaciones(payload: ICheckboxesRequest) {
    const endpoint = `${this.url}/logistica/evaluacionCrediticia/bloqueContrato/verificaciones/${payload.id}/estado/${payload.valorCheckbox}`;
    return this.http.put(endpoint, {});
  }

  public actualizarDocumentos(payload: ICheckboxesRequest) {
    const endpoint = `${this.url}/logistica/evaluacionCrediticia/documentos/${payload.id}/${payload.valorCheckbox}`;
    return this.http.put(endpoint, {});
  }

  public actualizarGarantias(payload: ICheckboxesRequest) {
    const endpoint = `${this.url}/logistica/evaluacionCrediticia/bloqueContrato/creditoPersona/${payload.id}/${payload.valorCheckbox}`;
    return this.http.put(endpoint, {});
  }

  /**
   * Lista de Verificación
   */

  public listarVerificacion(idBloqueContrato: string): Observable<IListadoVerificaciones[]> {
    const endpoint =
      this.url +
      `/logistica/evaluacionCrediticia/bloqueContrato/${idBloqueContrato}/verificaciones`;
    return this.http.get<IListadoVerificaciones[]>(endpoint);
  }

  public guardarVerificacion(
    idBloqueContrato: string,
    payload: IDatosVerificacionRequest
  ): Observable<IDatosVerificacionResponse> {
    const endpoint =
      this.url +
      `/logistica/evaluacionCrediticia/bloqueContrato/${idBloqueContrato}/verificaciones`;
    return this.http.post<IDatosVerificacionResponse>(endpoint, payload);
  }

  public actualizarVerificacion(
    idBloqueContrato: string,
    idVerificacion: number,
    payload: IActualizarVerificacionRequest
  ): Observable<IDatosVerificacionResponse> {
    const endpoint = `${this.url}/logistica/evaluacionCrediticia/bloqueContrato/${idBloqueContrato}/verificaciones/${idVerificacion}`;
    return this.http.put<IDatosVerificacionResponse>(endpoint, payload);
  }

  public subirArchivo(idBloqueContrato: string, idVerificacion: number, archivo: IArchivoAdjunto) {
    const endpoint =
      this.url +
      `/logistica/evaluacionCrediticia/bloqueContrato/${idBloqueContrato}/verificaciones/${idVerificacion}/adjunto`;
    return this.http.post(endpoint, archivo);
  }

  public eliminarArchivo(idBloqueContrato: string, idVerificacion: number) {
    const endpoint =
      this.url +
      `/logistica/evaluacionCrediticia/bloqueContrato/${idBloqueContrato}/verificaciones/${idVerificacion}/adjunto`;
    return this.http.delete(endpoint);
  }

  public eliminarVerificacion(idVerificacion: number) {
    const endpoint =
      this.url + `/logistica/evaluacionCrediticia/bloqueContrato/verificaciones/${idVerificacion}`;
    return this.http.delete(endpoint);
  }

  /**
   * Simulador
   */

  public simuladorIniciar(idBloqueContrato: string): Observable<ISimuladorIniciar> {
    const endpoint =
      this.url + `/logistica/financiamiento/simulador/bloquecontrato/${idBloqueContrato}/iniciar`;
    return this.http.get<ISimuladorIniciar>(endpoint);
  }

  public simuladorDatos(idBloqueContrato: string): Observable<ISimuladorDatosInformativos> {
    const endpoint =
      this.url + `/logistica/financiamiento/bloquecontrato/${idBloqueContrato}/obtener`;
    return this.http.get<ISimuladorDatosInformativos>(endpoint);
  }

  public conceptosSimulador(
    idBloqueContrato: string,
    payload: ISimuladorConceptosRequest
  ): Observable<ISimuladorCalcularResponse> {
    const endpoint =
      this.url + `/logistica/financiamiento/simulador/bloquecontrato/${idBloqueContrato}/conceptos`;
    return this.http.post<ISimuladorCalcularResponse>(endpoint, payload);
  }

  public calcularDiferencia(idbloquecontrato: string, montos): Observable<any> {
    const endpoint =
      this.url +
      `/logistica/financiamiento/simulador/bloquecontrato/${idbloquecontrato}/calculardiferencia `;
    return this.http.post(endpoint, montos);
  }

  public aceptarCambiofinanciamiento(idBloqueContrato: string): Observable<any> {
    const endpoint =
      this.url +
      `/logistica/financiamiento/bloquecontrato/${idBloqueContrato}/confirmarFinanciamiento`;
    return this.http.post(endpoint, {});
  }

  public categoriaSimularFinanciamiento(payload): Observable<ISimuladorCategoria> {
    const endpoint = this.url + `/logistica/financiamiento/simulador`;
    return this.http.post<ISimuladorCategoria>(endpoint, payload);
  }

  public valoresInicialesSimulador(idBloqueContrato: string): Observable<any> {
    const endpoint = `${this.url}/logistica/financiamiento/bloquecontrato/${idBloqueContrato}/valorinicial`;
    return this.http.get(endpoint);
  }

  /**
   * Seguimiento
   */
  public listarSeguimiento(payload: ISeguimientoRequest): Observable<ISeguimientoResponse> {
    const endpoint = `${this.url}/logistica/financiamiento/seguimiento/historial`;
    return this.http.post<ISeguimientoResponse>(endpoint, payload);
  }

  public descargarSeguimientoPDF(payload: ISeguimientoDescargarRequest): Observable<Blob> {
    const endpoint = `${this.url}/logistica/financiamiento/seguimiento/descargar`;
    return this.http.post(endpoint, payload, { responseType: 'blob' });
  }
}
