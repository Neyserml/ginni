import { ICargoOcupacion } from './editar.interface';
import { IIngresoMensualNeto } from './ingresos.model';
import { EMPTY } from 'app/@compartidos/utils/consts';
import { TiposPersona } from '../detalle.enum';

export interface IPersonaRelacionadaItem {
  idPersona: number;
  idPersonaRelacionada: number;
  idRelacion: number;
  nombre: string;
  tipoRelacion: string;
  tipoDocumento: string;
  idTipoDocumento: number;
  numeroDocumento: string;
}

export interface IPersonaRelacionada {
  mensajesAlertas?: Array<string>;
  esLegal?: boolean;
  idPersonaRelacionada?: number;
  tipoDocumento?: string;
  numeroDocumento?: string;
  idRelacion?: string;
  idPersona?: string;
  tipoPersona?: TiposPersona.NATURAL | TiposPersona.JURIDICO;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  idTipoRelacion: string;
  idEstadoCivil: string;
  idPaisNacionalidad: string;
  fechaNacimiento: string;
  idSexo: string;
  correo: string;
  celular: string;
  telefonoFijo: string;
  estadoPEP: boolean;
  direccionDomicilio: IDireccion;
  aportaIngresos: boolean;
  informacionLaboral: IInformacionLaboral;
}

export interface IPayloadRelacionado {
  body: IPersonaRelacionada;
}

interface IDireccion {
  idDepartamento: string;
  idProvincia: string;
  idDistrito: string;
  idTipoZona: string;
  nombreZona: string;
  idTipoVia: string;
  direccionTexto: string;
  referencia?: string;
}

interface IInformacionLaboral {
  idTipoTrabajador?: string;
  centroTrabajo?: string;
  cargoOcupacion: ICargoOcupacion;
  fechaIngresoTrabajo: string;
  correoLaboral: string;
  ingresoMensualNeto?: IIngresoMensualNeto;
}

export class PersonaRelacionada implements IPersonaRelacionada {
  mensajesAlertas?: Array<string>;
  esLegal?: boolean;
  idPersonaRelacionada?: number;
  idRelacion?: string = EMPTY;
  idPersona?: string = EMPTY;
  nombres: string = EMPTY;
  apellidoPaterno: string = EMPTY;
  apellidoMaterno: string = EMPTY;
  idTipoRelacion: string = EMPTY;
  idEstadoCivil: string = EMPTY;
  idPaisNacionalidad: string = EMPTY;
  fechaNacimiento: string = EMPTY;
  idSexo: string = EMPTY;
  correo: string = EMPTY;
  celular: string = EMPTY;
  telefonoFijo: string = EMPTY;
  estadoPEP = false;
  direccionDomicilio: IDireccion = {
    idDepartamento: EMPTY,
    idProvincia: EMPTY,
    idDistrito: EMPTY,
    idTipoZona: EMPTY,
    nombreZona: EMPTY,
    idTipoVia: EMPTY,
    direccionTexto: EMPTY,
    referencia: EMPTY
  };
  aportaIngresos = false;
  informacionLaboral: IInformacionLaboral = {
    idTipoTrabajador: EMPTY,
    centroTrabajo: EMPTY,
    cargoOcupacion: null,
    fechaIngresoTrabajo: EMPTY,
    correoLaboral: EMPTY,
    ingresoMensualNeto: {
      idMoneda: 1,
      monto: 0
    }
  };

  constructor(personaRelacionada, esTipoNatural, esTipoJuridico) {
    if (personaRelacionada) {
      this.mensajesAlertas = personaRelacionada.mensajesAlertas;
      this.esLegal = personaRelacionada.esLegal;
      this.idPersonaRelacionada = personaRelacionada.idPersonaRelacionada || EMPTY;
      this.nombres = personaRelacionada.nombres || EMPTY;
      this.apellidoPaterno = personaRelacionada.apellidoPaterno || EMPTY;
      this.apellidoMaterno = personaRelacionada.apellidoMaterno || EMPTY;

      if (esTipoNatural) {
        this.idTipoRelacion =
          Number(personaRelacionada.idTipoRelacion) === 1 ||
          Number(personaRelacionada.idTipoRelacion) === 16
            ? personaRelacionada.idTipoRelacion
            : EMPTY;
      } else if (esTipoJuridico) {
        this.idTipoRelacion = personaRelacionada.idTipoRelacion || '';
      }

      this.idEstadoCivil = personaRelacionada.idEstadoCivil || EMPTY;
      this.idPaisNacionalidad = personaRelacionada.idPaisNacionalidad || EMPTY;
      this.fechaNacimiento = personaRelacionada.fechaNacimiento || EMPTY;
      this.idSexo = personaRelacionada.idSexo || EMPTY;
      this.correo = personaRelacionada.correo || EMPTY;
      this.celular = personaRelacionada.celular || EMPTY;
      this.telefonoFijo = personaRelacionada.telefonoFijo || EMPTY;
      this.estadoPEP = personaRelacionada.estadoPEP || false;
      this.aportaIngresos = personaRelacionada.aportaIngresos || false;

      personaRelacionada.direccionDomicilio = personaRelacionada.direccionDomicilio || {};

      this.direccionDomicilio.idDepartamento =
        personaRelacionada.direccionDomicilio.idDepartamento || EMPTY;
      this.direccionDomicilio.idProvincia =
        personaRelacionada.direccionDomicilio.idProvincia || EMPTY;
      this.direccionDomicilio.idDistrito =
        personaRelacionada.direccionDomicilio.idDistrito || EMPTY;
      this.direccionDomicilio.idTipoZona =
        personaRelacionada.direccionDomicilio.idTipoZona || EMPTY;

      this.direccionDomicilio.nombreZona =
        personaRelacionada.direccionDomicilio.nombreZona || EMPTY;
      this.direccionDomicilio.idTipoVia = personaRelacionada.direccionDomicilio.idTipoVia || EMPTY;
      this.direccionDomicilio.direccionTexto =
        personaRelacionada.direccionDomicilio.direccionTexto || EMPTY;
      this.direccionDomicilio.referencia =
        personaRelacionada.direccionDomicilio.referencia || EMPTY;

      personaRelacionada.informacionLaboral = personaRelacionada.informacionLaboral || {};

      this.informacionLaboral.idTipoTrabajador =
        personaRelacionada.informacionLaboral.idTipoTrabajador || EMPTY;
      this.informacionLaboral.centroTrabajo =
        personaRelacionada.informacionLaboral.centroTrabajo || EMPTY;

      const cargoOcupacion = personaRelacionada.informacionLaboral.cargoOcupacion;
      this.informacionLaboral.cargoOcupacion = {
        identificador: cargoOcupacion ? cargoOcupacion.identificador || EMPTY : EMPTY,
        descripcion: cargoOcupacion ? cargoOcupacion.descripcion || EMPTY : EMPTY
      };

      const ingresoMensualNeto = personaRelacionada.informacionLaboral.ingresoMensualNeto;

      this.informacionLaboral.ingresoMensualNeto = {
        idMoneda: ingresoMensualNeto ? ingresoMensualNeto.idMoneda || 1 : 1,
        monto: ingresoMensualNeto ? ingresoMensualNeto.monto || EMPTY : EMPTY
      };

      this.informacionLaboral.fechaIngresoTrabajo =
        personaRelacionada.informacionLaboral.fechaIngresoTrabajo || EMPTY;
      this.informacionLaboral.correoLaboral =
        personaRelacionada.informacionLaboral.correoLaboral || EMPTY;
    }
  }
}
