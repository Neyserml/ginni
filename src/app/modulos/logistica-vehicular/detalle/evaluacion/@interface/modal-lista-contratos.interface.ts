export interface IModalContrato {
  esAdjudicado: boolean;
  idContrato: number;
  nroContrato: string;
  fechaAdjudicacion: string;
  situacion: string;
  valorCertificado: string;
  celula: ICelula;
  tieneEvaluacionCrediticia: boolean;
  tienePedido: boolean;
  estaIncluido: boolean;
  nCuotasPagadas: number;
  selected?: boolean;
  map?: (prop) => any;
}

export interface ICelula {
  id: number;
  value: string;
}

export interface IMensajeAdvertencia {
  mensaje: string;
}
