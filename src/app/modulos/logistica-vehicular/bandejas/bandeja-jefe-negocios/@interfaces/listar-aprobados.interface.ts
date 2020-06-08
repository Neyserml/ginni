export interface IListarAprobadosResponse {
  lista: IListaAprobados[];
  numeroPaginas: number;
  totalRegistros: number;
}

export interface IListaAprobados {
  bloqueContratoID: number;
  categoria: string;
  contratos: string[];
  diasAdjudicacion: string;
  diasEvaluacion: string;
  fechaIngreso: string;
  funcionario: string;
  nombres: string[];
}
