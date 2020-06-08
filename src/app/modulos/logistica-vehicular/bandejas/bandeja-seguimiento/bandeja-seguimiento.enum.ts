import { IColumna } from 'app/modulos/portal/@interface/bandejas.interface';

export enum TipoEstado {
  Pendientes = 'pendiente',
  Aprobados = 'aprobado'
}

const INGRESO = 'ingreso';
const ID_NOMBRE = 'nombres';

export const COLUMNAS: IColumna[] = [
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
    name: 'Días de adjudicación',
    className: 'th-center',
    id: 'dias',
    focus: false,
    asc: null
  }
];
