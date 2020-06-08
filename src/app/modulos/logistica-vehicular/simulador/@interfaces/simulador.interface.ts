export interface IListarContratosRequest {
  servicio: string;
  payload: string | number;
}

interface IClaveValor {
  id: number;
  value: string;
}

export interface IListaContratosSimulador {
  contratoId?: number;
  numeroContrato?: string;
  situacionId?: number;
  situacion?: string;
  valorCertificado?: string;
  cuotasPagadas?: number;
  celula?: IClaveValor[];
  evaluacionCrediticia?: boolean;
  incluido: boolean;
  seleccionado: boolean;
  readOnly?: boolean;
  propietarios?: IClaveValor[];
  pedido?: boolean;
}

export interface ISimuladorIniciarDatos {
  cantidadVehiculos: number;
  diferenciaPrecio: string;
  esPedido: boolean;
  lineaMaxima: string;
  listCodigoContrato: number[];
  nuevaCategoria: string;
  soloGps: boolean;
  valorCertificado: string;
  valorExcedente: string;
  valorVehiculos: string;
  fondoRemate?: string;
}

export interface ISimuladorCalcularRequest {
  listCodigoContrato: number[];
  valorVehiculos: number;
  cantidadVehiculos: number;
  idBloqueContrato?: string;
  limpiar?: boolean;
}

export interface ISimuladorConsultarRequest {
  listCodigoContrato: number[];
  listaConceptos: IListaConceptos[];
}

interface IListaConceptos {
  clave: string;
  valor: string;
  monto: string;
  montoInicial: string;
  nombreConcepto: string;
  porDefecto: boolean;
  readonly: boolean;
  tipoConcepto: string;
}
