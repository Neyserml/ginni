import { EMPTY } from 'app/@compartidos/utils/consts';

export enum tipoTelefono {
  FIJO = 'F',
  MOVIL = 'M'
}

export interface ITelefono {
  tipo: tipoTelefono.FIJO | tipoTelefono.MOVIL;
  valor: string;
  id?: number;
  idAmbito?: number;
  anexo?: string;
  indice?: string;
}

interface IDireccionPersonal {
  idDepartamento: string;
  idProvincia: string;
  idDistrito: string;
  idTipoZona: any;
  nombreZona: string;
  idTipoVia: any;
  direccionTexto: string;
  referencia?: string;
}

interface ILugarNacimiento {
  idPais?: string;
  idDepartamento?: string;
  idProvincia?: string;
  idDistrito?: string;
}

export interface IVinculadoBusqueda {
  idPersona?: string;
  descripcion: string;
}

export interface IVinculado {
  idPersona?: string;
  descripcion: string;
  idTipoRelacion?: number;
}

interface IMonto {
  idMoneda: any;
  monto: number;
  idFacturacionMensual: number;
}

export interface IPayloadPersonal {
  idPersona: string;
  body: any;
}

export interface IActividadEconomica {
  identificador: string;
  descripcion: string;
}

export interface IInformacionPersonalResponse {
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  numeroPartida?: string;
  actividadEconomica?: IActividadEconomica;
  giroNegocio?: string;
  fechaConstitucion?: string;
  correo: string;
  ruc?: string;
  direccion: IDireccionPersonal;
  facturacionMensual?: IMonto;
  telefonos: ITelefono[];
  telefonosFijos: ITelefono[];
  celulares: ITelefono[];
  separacionBienes?: boolean;
  fechaNacimiento?: string;
  idEstadoCivil?: any;
  idSexo?: any;
  idPaisNacionalidad?: string;
  lugarNacimiento?: ILugarNacimiento;
  vinculados?: IVinculado[];
}

export interface IInformacionPersonalRequest {
  telefonos: ITelefono[];
  correo: string;
  ruc?: string;
  idSexo?: number;
  separacionBienes?: boolean;
  idEstadoCivil: any;
  idPaisNacionalidad: string;
  direccion: IDireccionPersonal;
  lugarNacimiento?: ILugarNacimiento;
  vinculados: IVinculado[];
}

export class PersonalModel implements IInformacionPersonalResponse {
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  numeroPartida?: string;
  actividadEconomica?: IActividadEconomica;
  giroNegocio?: string;
  fechaConstitucion?: string;
  correo: string;
  direccion: IDireccionPersonal;
  facturacionMensual?: IMonto;
  telefonos: ITelefono[];
  telefonosFijos: ITelefono[];
  celulares: ITelefono[];
  ruc?: string;
  separacionBienes?: boolean;
  fechaNacimiento?: string;
  idEstadoCivil?: any;
  idSexo?: string;
  idPaisNacionalidad?: string;
  lugarNacimiento?: ILugarNacimiento;
  vinculados?: IVinculado[];

  constructor(response: IInformacionPersonalResponse) {
    this.nombreCompleto = response.nombreCompleto;
    this.tipoDocumento = response.tipoDocumento;
    this.numeroDocumento = response.numeroDocumento;
    this.numeroPartida = response.numeroPartida;
    this.giroNegocio = response.giroNegocio;
    this.fechaConstitucion = response.fechaConstitucion;
    this.correo = response.correo || EMPTY;
    this.ruc = response.ruc || EMPTY;
    this.telefonos = response.telefonos;
    this.telefonosFijos = response.telefonos;
    this.celulares = response.telefonos;
    this.separacionBienes = response.separacionBienes;
    this.fechaNacimiento = response.fechaNacimiento;
    this.idEstadoCivil = response.idEstadoCivil ? response.idEstadoCivil.toString() : EMPTY;
    this.idSexo = response.idSexo ? response.idSexo.toString() : EMPTY;
    this.idPaisNacionalidad = response.idPaisNacionalidad || EMPTY;
    this.vinculados = response.vinculados || [];

    // pasando nulls o undefinded a string vacios en teléfonos
    this.telefonos.map(telefono => (telefono.valor ? null : (telefono.valor = '')));

    this.celulares = this.celulares.filter(tel => tel.tipo === 'M');
    this.telefonosFijos = this.telefonosFijos.filter(tel => tel.tipo === 'F');

    const actividadEconomica = response.actividadEconomica;
    if (actividadEconomica) {
      this.actividadEconomica = {
        identificador: actividadEconomica.identificador,
        descripcion: actividadEconomica.descripcion
      };
    }

    const facturacionMensual = response.facturacionMensual;
    if (facturacionMensual) {
      this.facturacionMensual = facturacionMensual;
    } else {
      this.facturacionMensual = {
        idFacturacionMensual: null,
        idMoneda: null,
        monto: 0
      };
    }

    const direccion = response.direccion;
    if (direccion) {
      this.direccion = {
        idDepartamento: direccion.idDepartamento || EMPTY,
        idProvincia: direccion.idProvincia || EMPTY,
        idDistrito: direccion.idDistrito || EMPTY,
        idTipoZona:
          direccion.idTipoZona && direccion.idTipoZona !== 'null'
            ? direccion.idTipoZona.toString()
            : EMPTY,
        nombreZona: direccion.nombreZona || EMPTY,
        idTipoVia: direccion.idTipoVia ? direccion.idTipoVia.toString() : EMPTY,
        direccionTexto: direccion.direccionTexto || EMPTY,
        referencia: direccion.referencia || EMPTY
      };
    } else {
      this.direccion = {
        idDepartamento: EMPTY,
        idProvincia: EMPTY,
        idDistrito: EMPTY,
        idTipoZona: EMPTY,
        nombreZona: EMPTY,
        idTipoVia: EMPTY,
        direccionTexto: EMPTY,
        referencia: EMPTY
      };
    }

    const lugarNacimiento = response.lugarNacimiento;

    if (lugarNacimiento) {
      this.lugarNacimiento = {
        idPais: lugarNacimiento.idPais ? lugarNacimiento.idPais.toString() : EMPTY,
        idDepartamento: lugarNacimiento.idDepartamento || EMPTY,
        idProvincia: lugarNacimiento.idProvincia || EMPTY,
        idDistrito: lugarNacimiento.idDistrito || EMPTY
      };
    }
  }
}
