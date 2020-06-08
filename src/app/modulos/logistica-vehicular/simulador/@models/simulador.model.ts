import {
  IListaConceptos,
  ISimuladorCalcularResponse
} from 'app/@compartidos/interfaces/simulador-financiamiento.interface';
import { ISimuladorIniciarDatos } from '../@interfaces/simulador.interface';

export class SimuladorIniciarDatosModel implements ISimuladorIniciarDatos {
  cantidadVehiculos: number;
  diferenciaPrecio: string;
  esPedido: boolean;
  lineaMaxima: string;
  listCodigoContrato: number[];
  nuevaCategoria: string;
  soloGps: boolean;
  valorCertificado: string;
  valorExcedente: string;
  valorVehiculos: string;
  fechaFinanciamiento?: string;
  listaConceptos?: Array<IListaConceptos>;
  totalFinanciamiento?: string;
  tieneSimulacion?: false;
  contratos?: Array<string>;
  fondoRemate?: string;

  constructor(contrato: ISimuladorIniciarDatos) {
    this.fechaFinanciamiento = '';
    this.lineaMaxima = contrato.lineaMaxima;
    this.soloGps = contrato.soloGps;
    this.nuevaCategoria = contrato.nuevaCategoria;
    this.totalFinanciamiento = '';
    this.listaConceptos = [];
    this.contratos = [];
    this.esPedido = contrato.esPedido;
    this.tieneSimulacion = false;
    this.valorCertificado = contrato.valorCertificado;
    this.valorExcedente = contrato.valorExcedente;
    this.valorVehiculos = contrato.valorVehiculos;
    this.cantidadVehiculos = contrato.cantidadVehiculos;
    this.diferenciaPrecio = contrato.diferenciaPrecio;
    this.fondoRemate = contrato.fondoRemate || '0';
  }
}

export class SimuladorCalcularResponse implements ISimuladorCalcularResponse {
  listaConceptos: Array<IListaConceptos>;
  valorExcedente: string;

  constructor(conceptos: ISimuladorCalcularResponse) {
    const listaConceptoArr = conceptos.listaConceptos;

    this.listaConceptos = listaConceptoArr.map(concepto => {
      return {
        ...concepto,
        porDefecto: true
      };
    });
    this.valorExcedente = conceptos.valorExcedente;
  }
}

export class ListaConceptos {}
