import { IReactivacionItem } from './bandeja.model';

export interface IReactivacionItemResponsive extends IReactivacionItem {
  active: boolean;
}

export interface CarteraGeneralContrato {
  contratos: string[];
  nombres: string[];
  tipoDocumentos: string[];
  numeroDocumentos: string[];
  ejecutivo: string;
  celularEjecutivo: string;
  anexoEjecutivo: string;
  correoEjecutivo: string;
}

export interface ICarteraGeneralItemResponsive extends CarteraGeneralContrato {
  active: boolean;
}

export interface CarteraGeneralRequest {
  buscar?: string;
  pagina?: number;
}

export interface CarteraGeneralResponse {
  contratosCartera: CarteraGeneralContrato[];
  numeroRegistros: number;
  numeroPaginas: number;
}

export interface IReactivacionRequest {
  pagina?: number;
  orden?: string;
  modoOrden?: 'asc' | 'desc';
  buscar?: string;
  programa?: string;
  cia?: string;
  cuotasPagadas?: string;
  filtroRojo?: number;
}

export interface ReactivacionSummary {
  total: number;
  productos: Productos[];
  programas: Programas[];
}

interface Productos {
  [key: string]: number;
}

interface Programas {
  [key: string]: number;
}

export interface IStringSearch {
  has: boolean;
  found: string;
}
