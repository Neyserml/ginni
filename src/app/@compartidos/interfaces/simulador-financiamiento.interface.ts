export interface ISimuladorCategoria {
  categoria: ICategoria;
  mensajeAlerta: string;
  mensajeConfirmacion: string;
  nuevaCategoria: boolean;
}

export interface ICategoria {
  codigo: string;
  descripcion: string;
}

export interface ISimuladorConceptos {
  valor?: string;
  monto: string | number;
  montoInicial?: string;
  clave: string;
  readonly?: boolean;
  porDefecto?: boolean;
  nombreConcepto?: string;
  tipoConcepto: string;
  formControlName?: string;
  forEach?: (prop) => any;
  push?: (prop) => any;
}

export interface ISimuladorConceptosRequest {
  limpiar?: boolean;
  cantidadVehiculos: number;
  valorVehiculos: number;
  idBloqueContrato: string;
}

export interface ISimuladorIniciarDatos {
  categoriaActual?: ISimuladorCategoria;
  fechaFinanciamiento?: string;
  lineaMaxima?: string;
  soloGps?: boolean;
  nuevaCategoria?: string;
  totalFinanciamiento?: string;
  listaConceptos?: Array<IListaConceptos>;
  contratos?: string;
  esPedido?: boolean;
  tieneSimulacion?: boolean;
  valorCertificado?: string;
  valorExcedente?: string;
  valorVehiculos?: string;
  cantidadVehiculos?: number;
  diferenciaPrecio?: string;
  fondoRemate?: string;
}

export interface ISimuladorCalcularResponse {
  listaConceptos: Array<IListaConceptos>;
  valorExcedente: string;
}

export interface IListaConceptos {
  clave: string;
  formControlName: string;
  monto: string;
  montoInicial: string;
  nombreConcepto: string;
  porDefecto: boolean;
  readonly: boolean;
  tipoConcepto: string;
  valor: string;
}

export interface IConsultarRequest {
  cantidadVehiculos: number;
  listaConceptos: Array<IListaConceptos>;
  valorVehiculos: string;
  fondoRemate?: string;
}

export interface ISimuladorCalcularDiferenciaResponse {
  resultado: number;
}

export interface ISimuladorCalcularDiferenciaRequest {
  montoFinanciado: string;
  montoInicial: string;
}
