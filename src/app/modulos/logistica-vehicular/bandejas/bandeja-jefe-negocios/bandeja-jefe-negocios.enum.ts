import { IColumna } from 'app/modulos/portal/@interface/bandejas.interface';
import { IProp } from 'app/@compartidos/models';
import { IdsEnum } from '../bandejas.enum';

export enum BandejaJefeNegociosEnum {
  Url = '/portal/bandeja-de-trabajo-negocios'
}

export const LEYENDA: IProp[] = [
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

const INGRESO = 'ingreso';
const ID_NOMBRE = 'nombres';

export const COLUMNAS_APROBADOS: IColumna[] = [
  {
    name: 'Ingreso',
    id: INGRESO,
    focus: true,
    asc: false
  },
  {
    name: 'Contrato',
    id: 'numeroContrato',
    focus: false,
    asc: null
  },
  {
    name: 'Nombre',
    id: ID_NOMBRE,
    focus: false,
    className: 'th-width-20',
    asc: null
  },
  {
    name: 'Funcionario',
    id: 'funcionario',
    focus: false,
    asc: null
  },
  {
    name: 'Categoría',
    className: 'th-center',
    id: 'entrega',
    focus: false,
    asc: null
  },
  {
    name: 'Días en evaluación',
    className: 'th-center',
    id: 'dias',
    focus: false,
    asc: null
  },
  {
    name: 'Días en adjudicación',
    className: 'th-center',
    id: 'dias',
    focus: false,
    asc: null
  }
];
