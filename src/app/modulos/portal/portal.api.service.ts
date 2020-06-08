import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IProp } from 'app/@compartidos/models';
import { IListaProps } from './@interface/bandejas.interface';
import { environment } from 'environments/environment';
import { IListaBusquedaAsociados } from './@interface/asociado.interface';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IMensajeSeguimiento } from '../logistica-vehicular/bandejas/bandejas.interface';

@Injectable()
export class PortalApiService {
  private apiUrl = environment.apiUrl;
  private url = this.apiUrl + `/administracion/`;
  /**
   * lista documentos mensaje de seguimiento
   */
  public listaDocumentoMensaje = new BehaviorSubject<IMensajeSeguimiento>(null);
  public obtenerMensajeDocumentos$ = this.listaDocumentoMensaje.asObservable();

  public guardarMensajeDocumentos(mensaje: IMensajeSeguimiento) {
    this.listaDocumentoMensaje.next(mensaje);
  }

  private listaProvincias: IListaProps = {};
  private listaDistritos: { [key: string]: IListaProps } = {};

  constructor(private http: HttpClient) {}

  public perfiles(): Observable<any> {
    const endpoint = this.url + 'acceso/perfiles/';

    return this.http.get(endpoint);
  }

  public usuario(): Observable<any> {
    const endpoint = this.url + 'persona/usuario/';

    return this.http.get(endpoint);
  }

  public paises(): Observable<any> {
    const endpoint = this.url + 'configuraciongeneral/paises';

    return this.http.get(endpoint);
  }

  public departamentos(): Observable<any> {
    const endpoint = this.url + 'configuraciongeneral/departamentos';

    return this.http.get(endpoint);
  }

  public provincias(idDepartamento: string): Observable<any> {
    if (this.listaProvincias[idDepartamento]) {
      return new Observable(observer => {
        observer.next(this.listaProvincias[idDepartamento]);
      });
    }

    const endpoint = this.url + `configuraciongeneral/departamentos/${idDepartamento}/provincias`;

    return this.http.get(endpoint).do((res: IProp[]) => {
      this.listaProvincias[idDepartamento] = res;
    });
  }

  public distritos(idDepartamento: string, idProvincia: string): Observable<any> {
    if (this.listaDistritos[idDepartamento] && this.listaDistritos[idDepartamento][idProvincia]) {
      return new Observable(observer => {
        observer.next(this.listaDistritos[idDepartamento][idProvincia]);
      });
    }

    const endpoint =
      this.url +
      `configuraciongeneral/departamentos/${idDepartamento}/provincias/${idProvincia}/distritos`;

    return this.http.get(endpoint).do((res: IProp[]) => {
      if (!this.listaDistritos[idDepartamento]) {
        this.listaDistritos[idDepartamento] = {};
      }
      this.listaDistritos[idDepartamento][idProvincia] = res;
    });
  }

  public configuracionGeneral(): Observable<any> {
    const endpoint = this.url + 'configuraciongeneral/lista/generales';

    return this.http.get(endpoint);
  }

  public getComboProvincias = (idDepartamento): Observable<IProp[]> => {
    return new Observable(observer => {
      if (idDepartamento) {
        const provincias$ = this.provincias(idDepartamento).subscribe(provincias => {
          observer.next(provincias);
          observer.complete();
          if (provincias$) {
            provincias$.unsubscribe();
          }
        });
      }
    });
  };

  public getComboDistritos = (idDepartamento, idProvincia): Observable<IProp[]> => {
    return new Observable(observer => {
      if (idProvincia) {
        const distritos$ = this.distritos(idDepartamento, idProvincia).subscribe(distritos => {
          observer.next(distritos);
          observer.complete();
          if (distritos$) {
            distritos$.unsubscribe();
          }
        });
      }
    });
  };

  public buscarAsociado(nombres): Observable<IListaBusquedaAsociados[]> {
    const endpoint = `${this.url}persona/datos/`;
    return this.http.post<IListaBusquedaAsociados[]>(endpoint, nombres);
  }
}
