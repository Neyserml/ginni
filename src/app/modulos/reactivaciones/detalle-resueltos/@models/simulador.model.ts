import { SimulationResponse } from '../detalle-resueltos.interface';

export class SimuladorDetalleContrato {
  tipoDeBienControl: number;
  programaProductosControl: number;
  grupoControl: number;
  valorCertificadoControl: number;
  marcaControl: number;
  modeloControl: number;
  numeroDeFormatoControl: string;
  inversionInmobiliariaControl: number;
  updateSimulacionControl: number;
  diferenciaCiaControl: string;

  constructor(simulador: SimulationResponse = null) {
    if (simulador) {
      this.tipoDeBienControl = simulador.tipoDeBienControl
        ? simulador.tipoDeBienControl.listaIdSelected
        : 0;
      this.programaProductosControl = simulador.programaProductosControl
        ? simulador.programaProductosControl.listaIdSelected
        : 0;
      this.grupoControl = simulador.grupo ? simulador.grupo.numeroGrupo : null;
      this.valorCertificadoControl = simulador.certificado
        ? simulador.certificado.listaIdSelected
        : null;
      this.marcaControl = simulador.marca ? simulador.marca.listaIdSelected : 0;
      this.modeloControl = simulador.modelo ? simulador.modelo.listaIdSelected : 0;
      this.numeroDeFormatoControl = simulador.numeroFormato || '';
      this.inversionInmobiliariaControl = simulador.inversionInmobiliaria
        ? simulador.inversionInmobiliaria.listaIdSelected
        : 0;
      this.updateSimulacionControl = simulador.updateSimulacionControl || 0;
      this.diferenciaCiaControl = simulador.diferenciaCiaControl || '0.00';
    } else {
      this.tipoDeBienControl = 0;
      this.programaProductosControl = 0;
      this.grupoControl = null;
      this.valorCertificadoControl = 0;
      this.marcaControl = 0;
      this.modeloControl = 0;
      this.numeroDeFormatoControl = '';
      this.inversionInmobiliariaControl = 0;
      this.updateSimulacionControl = 0;
      this.diferenciaCiaControl = '0.00';
    }
  }
}
