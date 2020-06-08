import { Component, OnDestroy, OnInit, OnChanges, ViewEncapsulation } from '@angular/core';
import { ValidationService } from 'app/@compartidos/utils/validation.service';
import { DetalleResueltosService } from 'app/modulos/reactivaciones/detalle-resueltos/detalle-resueltos.service';
import { IPersonaSeleccionada } from 'app/modulos/reactivaciones/detalle-resueltos/@interfaces/persona-seleccionada.interface';
import { ActivatedRoute } from '@angular/router';
import { IObtenerDatosPersona } from './@interfaces/datos-persona.interface';
import { Configuracion } from 'app/modulos/portal/@models/configuracion.model';

@Component({
  selector: 'ginni-validacion-datos',
  templateUrl: './validacion-datos.component.html',
  styleUrls: ['./validacion-datos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ValidacionDatosComponent implements OnInit, OnChanges, OnDestroy {
  public configuracion: Configuracion;
  public idPersona: number;
  public datosPersona: IObtenerDatosPersona;
  public mostrarInformacionPersonal: boolean;

  constructor(
    protected detalleResueltosService: DetalleResueltosService,
    private route: ActivatedRoute,
    public validations: ValidationService
  ) {}

  ngOnChanges() {}

  ngOnInit() {
    this.mostrarInformacionPersonal = false;
    const data = this.route.snapshot.data;
    this.configuracion = data.configuracion;
    const datosCabecera: IPersonaSeleccionada = data.datosCabecera;
    this.idPersona = datosCabecera.idPersona;
  }

  ngOnDestroy() {
    this.datosPersona = null;
  }
}
