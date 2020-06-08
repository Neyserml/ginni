import { filtrarRepetidos } from 'app/@compartidos/utils/helpers';
import {
  IDetallePersona,
  IBloqueContratoResponse,
  IDetalleCabeceraResponse
} from 'app/@compartidos/interfaces/detalle.interface';
import { DetallePersona } from 'app/@compartidos/models/detalle.model';

interface IDetalle {
  segmento: string;
  numeroDias: number;
  fechaActualizacion: string;
  personas: IDetallePersona[];
}

export class Detalle implements IDetalle {
  segmento: string;
  numeroDias: number;
  fechaActualizacion: string;
  personas: IDetallePersona[];

  constructor(
    bloqueContratoRes: IBloqueContratoResponse,
    asociadoCabeceraRes: IDetalleCabeceraResponse
  ) {
    this.segmento = bloqueContratoRes.segmento;
    this.numeroDias = Number(bloqueContratoRes.numeroDias);
    this.fechaActualizacion = asociadoCabeceraRes.fechaActualizacion;
    this.personas = asociadoCabeceraRes.personas.map(persona => new DetallePersona(persona));
    this.personas.forEach(persona => {
      persona.telefonos = persona.telefonos.filter(
        (telefono, index) => telefono !== '' && filtrarRepetidos(persona.telefonos)(telefono, index)
      );
      persona.telefonosMovil = persona.telefonosMovil.filter(
        (telefono, index) =>
          telefono !== '' && filtrarRepetidos(persona.telefonosMovil)(telefono, index)
      );
    });
  }
}
