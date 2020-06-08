import { IColumna } from 'app/modulos/portal/@interface/bandejas.interface';
import { IdsEnum } from '../bandejas.enum';

export enum BandejaFuncionarioEnum {
  EnProgramacion = 'En programación',
  EnProgramacionDeEntrega = 'En programación de entrega',
  EnTramite = 'En trámite',
  Url = '/portal/bandeja-de-trabajo'
}

export enum TiposEnum {
  TIPO_PROGRAMACION = 'programacion',
  TIPO_TRAMITE = 'tramite'
}

export const COLUMNAS_PROGRAMACION: IColumna[] = [
  {
    name: 'Adjudicación',
    id: IdsEnum.ID_ADJUDICACION,
    focus: true,
    asc: false
  },
  {
    name: 'Nombre',
    id: IdsEnum.ID_NOMBRE,
    focus: false,
    className: 'th-width-30',
    asc: null
  },
  {
    name: 'Contrato',
    id: 'numeroContrato',
    focus: false,
    asc: null
  },
  {
    name: 'Proveedor',
    id: 'proveedor',
    focus: false,
    className: 'th-center',
    asc: null
  },
  {
    name: 'Entrega',
    id: 'entrega',
    focus: false,
    asc: null
  },
  {
    name: 'Días',
    id: 'dias',
    focus: false,
    className: 'th-center',
    asc: null
  }
];

export const COLUMNAS_TRAMITE: IColumna[] = [
  {
    name: 'Adjudicación',
    id: IdsEnum.ID_ADJUDICACION,
    focus: true,
    asc: false
  },
  {
    name: 'Nombre',
    id: IdsEnum.ID_NOMBRE,
    focus: false,
    className: 'th-width-30',
    asc: null
  },
  {
    name: 'Contrato',
    id: 'contratos',
    focus: false,
    asc: null
  },
  {
    name: 'Categoría',
    id: 'segmento',
    focus: false,
    className: 'th-center',
    asc: null
  },
  {
    name: 'Modalidad',
    id: 'modalidades',
    focus: false,
    asc: null
  },
  {
    name: 'Días',
    id: 'dias',
    focus: false,
    className: 'th-center',
    asc: null
  }
];
