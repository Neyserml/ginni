import { IContratoItem } from './contrato-item.interface';
import { dateFormat } from 'app/@compartidos/utils/helpers';

export class ContratoItem implements IContratoItem {
  fechaSituacionActual: string;
  nombres: string[];
  personaId: string;
  contratoId: string;
  numeroContrato: string;
  segmento: string;
  modalidades: string[];
  dias: string;
  contratos: string[];
  bloqueContratoID?: number;
  ecAprobada: boolean;

  constructor(contratoItem) {
    this.fechaSituacionActual = dateFormat(contratoItem.fechaSituacionActual);
    this.nombres = contratoItem.nombres;
    this.personaId = contratoItem.personaId;
    this.contratos = contratoItem.contratos;
    this.segmento = contratoItem.segmento;
    this.modalidades = contratoItem.modalidades;
    this.dias = contratoItem.dias === undefined ? '' : contratoItem.dias;
    this.bloqueContratoID = contratoItem.bloqueContratoID;
    this.ecAprobada = contratoItem.ecAprobada;
  }
}
