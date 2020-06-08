import {
  IListaAprobados,
  IListarAprobadosResponse
} from '../@interfaces/listar-aprobados.interface';

export class ListaAprobadosItem implements IListaAprobados {
  bloqueContratoID: number;
  categoria: string;
  contratos: string[];
  diasAdjudicacion: string;
  diasEvaluacion: string;
  fechaIngreso: string;
  funcionario: string;
  nombres: string[];

  constructor(item) {
    this.bloqueContratoID = item.bloqueContratoID;
    this.categoria = item.categoria;
    this.contratos = item.contratos;
    this.diasAdjudicacion = item.diasAdjudicacion;
    this.diasEvaluacion = item.diasEvaluacion;
    this.fechaIngreso = item.fechaIngreso;
    this.funcionario = item.funcionario;
    this.nombres = item.nombres;
  }
}

export class ListarAprobados {
  lista: IListarAprobadosResponse[];
  numeroPaginas: number;
  totalRegistros: number;

  constructor(listas) {
    this.lista = listas.lista.map(item => new ListaAprobadosItem(item));
    this.numeroPaginas = listas.numeroPaginas || 0;
    this.totalRegistros = listas.totalRegistros;
  }
}
