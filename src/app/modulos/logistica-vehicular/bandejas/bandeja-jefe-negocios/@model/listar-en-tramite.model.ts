import { IListaEnTramite } from 'app/modulos/logistica-vehicular/bandejas/bandeja-jefe-negocios/@interfaces/listar-en-tramite.interface';
import { dateFormat } from 'app/@compartidos/utils/helpers';

export class ListaEnTramiteItem implements IListaEnTramite {
  personaId: string;
  bloqueContratoID: number;
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

  constructor(item) {
    this.bloqueContratoID = item.bloqueContratoID;
    this.personaId = item.personaId;
    this.nombres = item.nombres;
    this.contratoId = item.contratoId;
    this.fechaSituacionActual = dateFormat(item.fechaSituacionActual);
    this.nombreCliente = item.nombreCliente;
    this.numeroContrato = item.numeroContrato;
    this.segmento = item.segmento;
    this.modalidad = item.modalidad;
    this.dias = item.dias;
    this.ecAprobada = item.ecAprobada;
    this.contratos = item.contratos;
    this.modalidades = item.modalidades;
  }
}

export class ListarEnTramite {
  lista: IListaEnTramite[];
  numeroPaginas: number;
  totalRegistros: number;

  constructor(listas) {
    this.lista = listas.lista.map(item => new ListaEnTramiteItem(item));
    this.numeroPaginas = listas.numeroPaginas;
    this.totalRegistros = listas.totalRegistros;
  }
}
