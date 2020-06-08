import { dateFormat } from 'app/@compartidos/utils/helpers';
import { EstadoBandejaType } from '../bandeja.enum';

export interface IReactivacionItem {
  contratoId: string;
  cia: number;
  cuotasPagadas: number;
  numeroDocumentos: string[];
  fechaLiquidacion: string;
  fechaResolucion: string;
  hasAssociated: boolean;
  nombres: string[];
  estadoBandeja: EstadoBandejaType;
  contratos: string[];
  personaIds: string[];
  programa: string;
  reactivacionContratoID: number;
  tipoBien: string;
  tipoDocumentos: string[];
}

export class ReactivacionItem implements IReactivacionItem {
  contratoId: string;
  cia: number;
  cuotasPagadas: number;
  numeroDocumentos: string[];
  fechaLiquidacion: string;
  fechaResolucion: string;
  hasAssociated: boolean;
  estadoBandeja: EstadoBandejaType;
  nombres: string[];
  contratos: string[];
  personaIds: string[];
  programa: string;
  reactivacionContratoID: number;
  tipoBien: string;
  tipoDocumentos: string[];

  constructor(reactivacionItem) {
    this.contratoId = reactivacionItem.contratoId;
    this.cia = reactivacionItem.cia;
    this.cuotasPagadas = reactivacionItem.cuotasPagadas;
    this.numeroDocumentos = reactivacionItem.numeroDocumentos;
    this.fechaLiquidacion = dateFormat(reactivacionItem.fechaLiquidacion);
    this.fechaResolucion = dateFormat(reactivacionItem.fechaResolucion);
    this.hasAssociated = reactivacionItem.hasAssociated;
    this.estadoBandeja = reactivacionItem.estadoBandeja;
    this.nombres = reactivacionItem.nombres;
    this.contratos = reactivacionItem.contratos;
    this.personaIds = reactivacionItem.personaIds;
    this.programa = reactivacionItem.programa;
    this.reactivacionContratoID = reactivacionItem.reactivacionContratoID;
    this.tipoBien = reactivacionItem.tipoBien;
    this.tipoDocumentos = reactivacionItem.tipoDocumentos;
  }
}

export class BandejaModel {
  contratosResueltos: IReactivacionItem[];
  numeroPaginas: number;
  numeroRegistros: number;

  constructor(reactivacionModal) {
    this.contratosResueltos = reactivacionModal.contratosResueltos.map(
      item => new ReactivacionItem(item)
    );
    this.numeroPaginas = Number(reactivacionModal.numeroPaginas);
    this.numeroRegistros = Number(reactivacionModal.numeroRegistros);
  }
}
