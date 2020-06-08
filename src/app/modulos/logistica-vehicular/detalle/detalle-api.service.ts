import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ConfiguracionEvaluacionCrediticia } from 'app/modulos/portal/@models/configuracion.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from 'environments/environment';
import { IDetalle } from 'app/@compartidos/interfaces/detalle.interface';

@Injectable()
export class DetalleApiService {
  private url = environment.apiUrl;

  private asociadoPersonaDatos = new BehaviorSubject<IDetalle>(null);
  public asociadoPersonaDatos$ = this.asociadoPersonaDatos.asObservable();

  public personaActual = new BehaviorSubject<number>(0);
  public personaIndexSeleccionado = this.personaActual.asObservable();

  public estadoCivilGarante = new BehaviorSubject<boolean>(false);
  public garanteEsSoltero = this.estadoCivilGarante.asObservable();

  private mensajesSistema = new BehaviorSubject<string[]>([]);
  public obtenerMensajesSistema$ = this.mensajesSistema.asObservable();

  constructor(private http: HttpClient) {}

  public actualizarAsociadoPersonaDatos(data: IDetalle) {
    this.asociadoPersonaDatos.next(data);
  }

  public personaActualIndex(id) {
    this.personaActual.next(id);
  }

  public esSoltero(valor) {
    this.estadoCivilGarante.next(valor);
  }

  public guardarMensajesSistema(valor) {
    this.mensajesSistema.next(valor);
  }

  public configuracionGeneralAdicional(): Observable<ConfiguracionEvaluacionCrediticia> {
    const endpoint = this.url + `/logistica/evaluacionCrediticia/lista/generales`;
    return this.http.get<ConfiguracionEvaluacionCrediticia>(endpoint);
  }

  public asociado(bloquecontrato: string): Observable<any> {
    const endpoint = this.url + `/logistica/evaluacionCrediticia/bloquecontrato/${bloquecontrato}`;
    return this.http.get(endpoint);
  }

  public asociadoCabecera(personasId: string[]): Observable<any> {
    const endpoint = this.url + '/administracion/persona/asociadosCabecera/';
    return this.http.post(endpoint, personasId);
  }

  public asociadoMensajesSistema(idBloqueContrato: string): Observable<Array<string>> {
    const endpoint =
      this.url + `/logistica/evaluacionCrediticia/mensaje/sistema/${idBloqueContrato}`;
    return this.http.get<Array<string>>(endpoint);
  }

  /**
   * TABS INFORMACION
   */

  public tipoPersona(idPersona: string): Observable<any> {
    const endpoint = `${this.url}/administracion/persona/${idPersona}/tipo`;

    return this.http.get(endpoint);
  }

  public informacionPersonal(idPersona: string): Observable<any> {
    const endpoint = `${this.url}/administracion/persona/${idPersona}/informacionPersonal`;

    return this.http.get(endpoint);
  }

  public actualizarInformacionPersonal(payload): Observable<any> {
    // : IPayloadPersonal
    const endpoint = `${this.url}/administracion/persona/${payload.idPersona}/informacionPersonal`;

    return this.http.put(endpoint, payload.body);
  }

  public informacionAsociado(idPersona: string): Observable<any> {
    const endpoint = `${this.url}/administracion/persona/${idPersona}/informacionAsociado`;

    return this.http.get(endpoint);
  }

  public actualizarInformacionAsociado(payload): Observable<any> {
    // : IPayloadPersonal
    const endpoint = `${this.url}/administracion/persona/${payload.idPersona}/informacionAsociado`;

    return this.http.put(endpoint, payload.body);
  }

  public informacionLaboral(idPersona: string): Observable<any> {
    const endpoint = `${this.url}/administracion/persona/${idPersona}/informacionLaboral`;

    return this.http.get(endpoint);
  }

  public obtenerCargoOcupacion(descripcion: string): Observable<any> {
    const endpoint = `${this.url}/administracion/configuraciongeneral/lista/ocupacion/${descripcion}`;

    return this.http.get(endpoint);
  }

  public obtenerActividadEconomica(descripcion: string): Observable<any> {
    const endpoint = `${this.url}/administracion/configuraciongeneral/lista/actividad/economica/${descripcion}`;

    return this.http.get(endpoint);
  }

  public actualizarInformacionLaboral(payload): Observable<any> {
    // : GuardarFormLaboral
    const endpoint = `${this.url}/administracion/persona/${payload.idPersona}/informacionLaboral`;

    return this.http.put(endpoint, payload.body);
  }

  public obtenerVinculacion(descripcion: string): Observable<any> {
    const endpoint = `${this.url}/administracion/persona/vinculadosNatural/${descripcion}`;

    return this.http.get(endpoint);
  }

  /**Personas relacionadas */
  public personasRelacionadas(payload): Observable<any> {
    const endpoint = `${this.url}/administracion/persona/personaRelacionada/${payload.tipoPersona}/${payload.idPersona}`;
    return this.http.get(endpoint);
  }

  public eliminarPersonaRelacionada(idRelacion): Observable<any> {
    const endpoint = `${this.url}/administracion/persona/personaRelacionada/${idRelacion}`;

    return this.http.delete(endpoint);
  }

  public obtenerPersonasRelacionadas({ tipoDocumento, numeroDocumento }): Observable<any> {
    // : IDocumento
    const endpoint = `${this.url}/administracion/persona/buscarPersona/tipoDocumento/${tipoDocumento}/numeroDocumento/${numeroDocumento}`;

    return this.http.get(endpoint);
  }

  public agregarPersonasRelacionadas(payload): Observable<any> {
    // : IPersonaRelacionada
    const endpoint = `${this.url}/administracion/persona/personaRelacionada/${payload.tipoPersona}`;

    return this.http.post(endpoint, payload);
  }

  public obtenerPersonasRelacionadaPorIdRelacion(idRelacion: number): Observable<any> {
    const endpoint = `${this.url}/administracion/persona/personaRelacionada/${idRelacion}`;

    return this.http.get(endpoint);
  }

  public actualizarPersonasRelacionadas(payload): Observable<any> {
    // : IPersonaRelacionada
    const endpoint = `${this.url}/administracion/persona/personaRelacionada/${payload.tipoPersona}/${payload.idRelacion}`;

    return this.http.put(endpoint, payload);
  }

  public obtenerIngresos(payload): Observable<any> {
    const endpoint = `${this.url}/administracion/persona/${payload.idPersona}/ingresos?nombreOrigenPrincipal=${payload.garanteORespaldo}`;

    return this.http.get(endpoint);
  }

  public registrarIngreso(idPersona: string, payload): Observable<any> {
    // : IIngresos
    const endpoint = `${this.url}/administracion/persona/${idPersona}/ingresos`;

    return this.http.post(endpoint, payload);
  }

  public actualizarIngreso(idPersona: string, payload): Observable<any> {
    // : IIngresos
    const endpoint = `${this.url}/administracion/persona/${idPersona}/ingresos`;

    return this.http.put(endpoint, payload);
  }

  public eliminarIngreso(payload) {
    const endpoint = `${this.url}/administracion/persona/${payload.idPersona}/ingresos/${payload.idIngreso}`;

    return this.http.delete(endpoint);
  }
}
