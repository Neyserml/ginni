import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { environment } from 'environments/environment';

@Injectable()
export class MiEspacioApiService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public miEspacio(): Observable<any> {
    const endpoint = this.url + '/mi-espacio';

    return this.http.post(endpoint, {});
  }
}
