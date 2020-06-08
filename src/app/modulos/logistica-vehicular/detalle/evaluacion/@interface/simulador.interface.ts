import {
  IListaConceptos,
  ISimuladorCategoria
} from 'app/@compartidos/interfaces/simulador-financiamiento.interface';

export interface ISimuladorDatosInformativos {
  fechaFinanciamiento: string;
  lineaMaxima: string;
  soloGps: boolean;
  nuevaCategoria: string;
  totalFinanciamiento: string;
  listaConceptos: Array<IListaConceptos>;
}

export interface ISimuladorIniciar {
  contratos: Array<string>;
  esPedido: boolean;
  tieneSimulacion: boolean;
  valorCertificado: string;
  valorExcedente: string;
  valorVehiculos: number | string;
  cantidadVehiculos: number;
  fechaFinanciamiento: string;
  categoriaActual: ISimuladorCategoria;
}

export interface IValoresIniciales {
  valorVehiculos: string;
  cantidadVehiculos: number;
}
