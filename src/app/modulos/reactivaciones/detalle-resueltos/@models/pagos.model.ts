import { PagoACuenta } from '../detalle-resueltos.interface';

export class PagosModel {
  montoControl: string;

  constructor(pago: PagoACuenta = null) {
    this.montoControl = pago.montoControl || '';
  }
}
