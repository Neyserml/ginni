import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { DetalleResueltosService } from '../../../../detalle-resueltos.service';
import { BandejaEnum } from 'app/modulos/reactivaciones/bandeja/bandeja.enum';

@Injectable()
export class ValidarDatosResolve implements Resolve<string> {
  public datosPersona$: Subscription;

  constructor(private detalleResueltosService: DetalleResueltosService, private router: Router) {}

  resolve(): Observable<any> {
    return new Observable(observer => {
      this.datosPersona$ = this.detalleResueltosService.getPersonaActual$.subscribe(res => {
        if (res) {
          observer.next(res);
          observer.complete();
          // this.datosPersona$.unsubscribe();
        } else {
          observer.next(true);
          observer.complete();
          this.router.navigate([`${BandejaEnum.Url}`]);
        }
      });
    });
  }
}
