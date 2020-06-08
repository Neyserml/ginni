export interface IListarGrillasRecuperos {
  lista: ILista[];
  numeroPaginas: number;
  totalRegistros: number;
}

export interface ILista {
  bloqueContratoID: string;
  ingreso: string;
  contratos: string[];
  nombre: string;
  funcionario: string;
  categoria: string;
  diasEvaluacion: string;
  diasAdjudicacion: string;
}

export interface IMensajeSeguimiento {
  mensaje: string;
  tipo: string;
}

export interface IListarBandeja {
  lista: IListarItems[];
  numeroPaginas: number;
  totalRegistros: number;
  mensajeDocumentos: IMensajeSeguimiento;
}

export interface IListarItems {
  bloqueContratoID: number;
  categoria: string;
  contratos: string[];
  diasAdjudicacion: string;
  diasEvaluacion: string;
  fechaIngreso: string;
  funcionario: string;
  nombres: string[];
}
