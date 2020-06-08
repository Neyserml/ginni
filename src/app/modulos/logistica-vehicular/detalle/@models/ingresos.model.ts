import { EMPTY } from 'app/@compartidos/utils/consts';

export interface IIngresos {
  idIngreso?: number;
  idOrigen: string;
  readOnly?: boolean;
  idTipoIngreso: string;
  fuente: string;
  ingresoMensualNeto: IIngresoMensualNeto;
}

export interface IIngresosRequest {
  idPersona: number;
  idIngreso: number;
}
export interface IIngresoMensualNeto {
  idMoneda?: any;
  monto?: any;
}

export class IngresoResponse implements IIngresos {
  idIngreso?: number;
  idOrigen: string;
  readOnly?: boolean;
  idTipoIngreso: string;
  fuente: string;
  ingresoMensualNeto: IIngresoMensualNeto;

  constructor(ingreso: IIngresos) {
    this.idIngreso = ingreso.idIngreso;
    this.idOrigen = ingreso.idOrigen ? ingreso.idOrigen.toString() : EMPTY;
    this.readOnly = ingreso.readOnly;
    this.idTipoIngreso = ingreso.idTipoIngreso ? ingreso.idTipoIngreso.toString() : EMPTY;
    this.fuente = ingreso.fuente ? ingreso.fuente.toString() : EMPTY;
    const ingresoMensualNeto = ingreso.ingresoMensualNeto || {};

    this.ingresoMensualNeto = {
      idMoneda: ingresoMensualNeto.idMoneda || '1',
      monto: ingresoMensualNeto.monto || ''
    };
  }
}
