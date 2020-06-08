import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { DetalleResueltosService } from './detalle-resueltos.service';
import { BandejaService } from '../bandeja/bandeja.service';
import { BandejaEnum } from '../bandeja/bandeja.enum';
import { APIError } from 'app/@compartidos/models';
import { unique } from 'app/@compartidos/utils/helpers';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';
import { DetalleModel } from './@models/detalle.model';

@Component({
  selector: 'ginni-reactivaciones-detalle',
  templateUrl: './detalle-resueltos.component.html',
  styleUrls: ['./detalle-resueltos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DetalleComponent implements OnInit, OnDestroy {
  public failed;
  public fechaActualizacion;
  public datosAsociados: DetalleModel[];
  public loading = true;
  public personaIds: string[];
  public personaActualIndex = 0;
  public tabs = [
    {
      icon: 'info-tab',
      link: 'info',
      text: 'Información del contrato resuelto'
    },
    {
      icon: 'calculadora-tab',
      link: 'generar-contrato',
      text: 'Generación de contrato'
    },
    {
      icon: 'withdrawal',
      link: 'pagos',
      text: 'Pagos'
    }
  ];

  public _unique = unique;

  constructor(
    public portalSandbox: PortalSandbox,
    public router: Router,
    private detalleService: DetalleResueltosService,
    private bandejaService: BandejaService
  ) {}

  ngOnInit() {
    this.loading = true;
    if (this.bandejaService.contratoActual && this.bandejaService.contratoActual.contratoId) {
      this.getAsociadoCabecera();
    } else {
      this.router.navigate([`${BandejaEnum.Url}`]);
    }
  }

  private getAsociadoCabecera() {
    this.detalleService
      .getAsociadoCabecera(this.bandejaService.contratoActual.contratoId)
      .subscribe(
        res => {
          this.loading = false;
          this.datosAsociados = res.personas.map(
            persona =>
              new DetalleModel({
                ...persona,
                telefonos: this._unique(persona.telefonos),
                correos: this._unique(persona.correos)
              })
          );
          this.detalleService.setPersonaActual({
            index: this.personaActualIndex,
            idPersona: Number(this.datosAsociados[this.personaActualIndex].idPersona)
          });
        },
        (error: APIError) => {
          this.loading = false;
          this.failed = error.mensaje;
        }
      );
  }

  ngOnDestroy() {
    this.loading = false;
    this.detalleService.setPersonaActual(null);
  }

  public cambiarAsociado() {
    if (this.personaActualIndex < this.datosAsociados.length - 1) {
      this.personaActualIndex += 1;
      this.detalleService.setPersonaActual({
        index: this.personaActualIndex,
        idPersona: Number(this.datosAsociados[this.personaActualIndex].idPersona)
      });
    } else {
      this.personaActualIndex = 0;
    }
  }
}
