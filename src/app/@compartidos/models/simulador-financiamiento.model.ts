import { ISimuladorConceptos } from '../interfaces/simulador-financiamiento.interface';

export class SimuladorConceptosModel implements ISimuladorConceptos {
  valor?: string;
  monto: string | number;
  montoInicial?: string;
  clave: string;
  readonly?: boolean;
  porDefecto?: boolean;
  nombreConcepto?: string;
  tipoConcepto: string;
  formControlName?: string;
  push?: (prop) => any;
  map?: (prop) => any;
  forEach?: (prop) => any;
  filter?: (prop) => any;

  constructor(simulador) {
    this.valor = simulador.valor ? simulador.valor.toUpperCase() : simulador.valor;
    this.monto = Number(simulador.monto) === 0 ? 0 : simulador.monto;
    this.montoInicial = simulador.montoInicial;
    this.clave = simulador.clave;
    this.readonly = simulador.readonly ? simulador.readonly : false;
    this.porDefecto = simulador.porDefecto;
    this.nombreConcepto = simulador.nombreConcepto;
    this.tipoConcepto = simulador.tipoConcepto;
    this.formControlName = `${this.valor}-${this.tipoConcepto}`;
    if (simulador.valor === 'GPS' || simulador.valor === 'CIB') {
      this.valor = simulador.valor.toUpperCase();
    } else {
      this.valor = `${simulador.valor[0]}${simulador.valor.substr(1).toLowerCase()}`;
    }
  }
}
