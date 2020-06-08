import { IProp } from 'app/@compartidos/models';
import { ArrayProp } from 'app/@compartidos/models/prop.interface';

export interface IConfiguracion {
  estadoCivil: IProp[];
  ingresoEconomico: IProp[];
  origenIngreso: IProp[];
  sexo: IProp[];
  tipoCambio: number;
  tipoDocumentos: IProp[];
  tipoMoneda: IProp[];
  tipoRelacion: IProp[];
  tipoRelacionJuridico: IProp[];
  tipoRelacionVinculado: IProp[];
  tipoTrabajador: IProp[];
  tipoZona: IProp[];
  tipoVia: IProp[];
}

export interface IConfiguracionEvaluacionCrediticia {
  tipoRespaldoJuridico: IProp[];
  tipoRespaldoNatural: IProp[];
  simuladorFinanciamiento: IProp[];
  tipoVerificacion: IProp[];
  viaVerificacion: IProp[];
  verificador: IProp[];
}

export class Configuracion {
  estadoCivil: ArrayProp;
  ingresoEconomico: ArrayProp;
  origenIngreso: ArrayProp;
  sexo: ArrayProp;
  tipoCambio: number;
  tipoDocumento: ArrayProp;
  tipoMoneda: ArrayProp;
  tipoRelacion: ArrayProp;
  tipoRelacionJuridico: ArrayProp;
  tipoRelacionVinculado: ArrayProp;
  tipoTrabajador: ArrayProp;
  tipoZona: ArrayProp;
  tipoVia: ArrayProp;
  tipoRespaldo: ArrayProp;
  tipoRespaldoJuridico: ArrayProp;

  constructor(config: IConfiguracion) {
    this.estadoCivil = ArrayProp.create(config.estadoCivil);
    this.ingresoEconomico = ArrayProp.create(config.ingresoEconomico);
    this.origenIngreso = ArrayProp.create(config.origenIngreso);
    this.sexo = ArrayProp.create(config.sexo);
    this.tipoCambio = config.tipoCambio;
    this.tipoDocumento = ArrayProp.create(config.tipoDocumentos);
    this.tipoMoneda = ArrayProp.create(config.tipoMoneda);
    this.tipoRelacion = ArrayProp.create(config.tipoRelacion);
    this.tipoRelacionJuridico = ArrayProp.create(config.tipoRelacionJuridico);
    this.tipoRelacionVinculado = ArrayProp.create(config.tipoRelacionVinculado);
    this.tipoTrabajador = ArrayProp.create(config.tipoTrabajador);
    this.tipoZona = ArrayProp.create(config.tipoZona);
    this.tipoVia = ArrayProp.create(config.tipoVia);
  }
}

export class ConfiguracionEvaluacionCrediticia {
  tipoRespaldoJuridico: ArrayProp;
  tipoRespaldoNatural: ArrayProp;
  simuladorFinanciamiento: ArrayProp;
  tipoVerificacion: ArrayProp;
  viaVerificacion: ArrayProp;
  verificador: ArrayProp;

  constructor(config) {
    this.tipoRespaldoJuridico = ArrayProp.create(config.tipoRespaldoJuridico);
    this.tipoRespaldoNatural = ArrayProp.create(config.tipoRespaldoNatural);
    this.simuladorFinanciamiento = ArrayProp.create(config.simuladorFinanciamiento);
    this.tipoVerificacion = ArrayProp.create(config.tipoVerificacion);
    this.viaVerificacion = ArrayProp.create(config.viaVerificacion);
    this.verificador = ArrayProp.create(config.verificador);
  }
}
