export interface IListarEnTramitesResponse {
  lista: IListaEnTramite[];
  numeroPaginas: number;
  totalRegistros: number;
}

export interface IListaEnTramite {
  bloqueContratoID: number;
  personaId: string;
  nombres: string[];
  contratoId: number;
  fechaSituacionActual: string;
  nombreCliente: string;
  numeroContrato: string;
  segmento: string;
  modalidad: string;
  dias: number;
  ecAprobada: boolean;
  contratos: string[];
  modalidades: string[];
}
