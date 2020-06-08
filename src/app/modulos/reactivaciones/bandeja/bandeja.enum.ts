import { IProp } from 'app/@compartidos/models';
import { IColumna } from 'app/modulos/portal/@interface/bandejas.interface';

export enum IdsEnum {
  ID_NOMBRE = 'nombres',
  ID_REACTIVACION = 'fechaResolucion'
}

export enum BandejaEnum {
  EnReactivacion = 'Resueltos',
  TituloCarteraGeneral = 'Cartera general',
  Url = '/portal/bandeja-de-reactivaciones'
}

export const COLUMNAS_REACTIVACIONES: IColumna[] = [
  {
    name: 'Fecha de resolución',
    id: IdsEnum.ID_REACTIVACION,
    focus: true,
    asc: false
  },
  {
    name: 'Contrato',
    id: 'contratos',
    focus: false,
    asc: null
  },
  {
    name: 'Nombre',
    id: 'nombres',
    className: 'th-width-30',
    focus: false,
    asc: null
  },
  {
    name: 'Tipo',
    id: 'tipoDocumentos',
    className: 'th-center',
    focus: false,
    asc: null
  },
  {
    name: 'Documento',
    id: 'numeroDocumentos',
    focus: false,
    asc: null
  },
  {
    name: 'Cuotas pagadas',
    id: 'cuotasPagadas',
    focus: false,
    asc: null
  },
  {
    name: '%CIA',
    id: 'cia',
    focus: false,
    asc: null
  },
  {
    name: 'Programa',
    id: 'programa',
    className: 'th-center',
    focus: false,
    asc: null
  },
  {
    name: 'Tipo de bien',
    id: 'tipoBien',
    className: 'nowrap',
    focus: false,
    asc: null
  },
  {
    name: 'Fecha de liquidación',
    id: 'fechaLiquidacion',
    focus: false,
    asc: null
  }
];

export const COLUMNAS_CARTERA_GENERAL: IColumna[] = [
  {
    name: 'Contrato',
    id: 'contratos',
    focus: true,
    asc: false
  },
  {
    name: 'Nombre',
    id: 'nombres',
    className: 'th-width-30',
    focus: false,
    asc: null
  },
  {
    name: 'Tipo',
    id: 'tipoDocumentos',
    className: 'th-center',
    focus: false,
    asc: null
  },
  {
    name: 'Documento',
    id: 'numeroDocumentos',
    focus: false,
    asc: null
  },
  {
    name: 'Ejecutivo',
    id: 'ejecutivo',
    className: 'th-width-30',
    focus: false,
    asc: null
  },
  {
    name: 'Anexo',
    id: 'anexoEjecutivoia',
    focus: false,
    asc: null
  },
  {
    name: 'Celular',
    id: 'celularEjecutivo',
    className: 'th-center',
    focus: false,
    asc: null
  },
  {
    name: 'Correo',
    id: 'correoEjecutivo',
    className: 'nowrap',
    focus: false,
    asc: null
  }
];

export const TIPOS_CATEGORIA: IProp[] = [
  {
    clave: 'A',
    valor: 'Exonerado'
  },
  {
    clave: 'B',
    valor: 'GPS Subvencionado'
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
    valor: 'GPS + Comité Especial'
  },
  {
    clave: 'L',
    valor: 'Situación Legal'
  }
];

export enum EstadoBandejaEnum {
  CON_SIMULACION = 'CON_SIMULACION',
  CON_SIMULACION_CONTRATO_GEN = 'CON_SIMULACION_CONTRATO_GEN',
  PAGO_A_CUENTA = 'PAGO_A_CUENTA',
  SIN_SIMULACION = 'SIN_SIMULACION'
}

export type EstadoBandejaType =
  | EstadoBandejaEnum.CON_SIMULACION
  | EstadoBandejaEnum.CON_SIMULACION_CONTRATO_GEN
  | EstadoBandejaEnum.PAGO_A_CUENTA
  | EstadoBandejaEnum.SIN_SIMULACION;
