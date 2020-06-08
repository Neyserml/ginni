import { IProp } from 'app/@compartidos/models/prop.interface';

export enum IdsEnum {
  ID_ADJUDICACION = 'fechaSituacionActual',
  ID_NOMBRE = 'nombres'
}

export const TIPOS_CATEGORIA: IProp[] = [
  {
    clave: 'A',
    valor: 'Exonerado'
  },
  {
    clave: 'B',
    valor: 'GPS subvencionado'
  },
  {
    clave: 'C',
    valor: 'GPS'
  },
  {
    clave: 'D',
    valor: 'GPS + Aval B'
  },
  {
    clave: 'E',
    valor: 'GPS + Aval A'
  },
  {
    clave: 'F',
    valor: 'GPS + comité Especial'
  },
  {
    clave: 'L',
    valor: 'Situación legal'
  }
];

export enum TIPO_MENSAJE_SEGUIMIENTO {
  Error = 'error',
  Success = 'success'
}

export enum TipoBandeja {
  EnTramite = 'en trámite',
  Aprobados = 'aprobados'
}
