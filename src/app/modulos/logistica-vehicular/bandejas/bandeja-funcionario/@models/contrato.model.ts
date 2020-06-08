import { IContratoItem } from './contrato-item.interface';
import { ContratoItem } from './contrato-item.model';
import { IMensajeSeguimiento } from 'app/modulos/logistica-vehicular/bandejas/bandejas.interface';

export class ContratoModel {
  contratos: IContratoItem[];
  numeroPaginas: number;
  totalRegistros: number;
  mensajeDocumentos: IMensajeSeguimiento;

  constructor(contratoModal) {
    this.contratos = contratoModal.lista.map(item => new ContratoItem(item));
    this.numeroPaginas = Number(contratoModal.numeroPaginas);
    this.totalRegistros = Number(contratoModal.totalRegistros);
    this.mensajeDocumentos = contratoModal.mensajeDocumentos;
  }
}
