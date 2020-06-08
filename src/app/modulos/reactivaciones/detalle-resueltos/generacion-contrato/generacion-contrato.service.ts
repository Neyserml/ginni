// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
// import { environment } from 'environments/environment';
// import { Store } from '@ngrx/store';

@Injectable()
export class GeneracionContratoService {
  // private url = environment.apiUrl;
  // constructor(private http: HttpClient, private store: Store<any>) {}
  /*
  public obtenerEstado(): Observable<any> {
    console.log(this.url)
    console.log(this.http)
    return this.store.select('bandejaReactivaciones').switchMap(d => {
      const observable: Observable<any> = new Observable(observer => {
        console.log(d);
        observer.next(d.reactivacion)
      })
      return observable;
    })
  }*/
  /*
  public asociadoCabecera(personasId: string[]): Observable<IDetalleCabeceraResponse> {
    const endpoint = `${this.url}/administracion/persona/reactivaciones/asociadosCabecera`;

    return this.http.post<IDetalleCabeceraResponse>(endpoint, personasId);
  }*/
}
