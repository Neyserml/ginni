import { ICargoOcupacion } from './editar.interface';
import { EMPTY } from 'app/@compartidos/utils/consts';

export interface IInformacionLaboralResponse {
  centroTrabajo: string;
  cargoOcupacion: ICargoOcupacion;
  idTipoTrabajador: string;
  fechaIngresoTrabajo: string;
  direccion: IDireccionLaboral;
  contacto: IContacto;
  estadoPEP: boolean;
  estadoUIF: boolean;
  estadoPLA: boolean;
  estadoAM: boolean;
}

export interface IDireccionLaboral {
  idDepartamento?: string;
  idProvincia?: string;
  idDistrito?: string;
  idTipoZona?: any;
  nombreZona?: string;
  idTipoVia?: any;
  direccionTexto?: string;
  referencia?: string;
}

export interface IContacto {
  idTelefono: number;
  numeroTelefono: string;
  anexo: string;
  correoElectronico: string;
}

export class LaboralModel implements IInformacionLaboralResponse {
  centroTrabajo: string;
  cargoOcupacion: ICargoOcupacion;
  idTipoTrabajador: string;
  fechaIngresoTrabajo: string;
  direccion: IDireccionLaboral;
  contacto: IContacto = {
    idTelefono: null,
    numeroTelefono: null,
    anexo: null,
    correoElectronico: null
  };
  estadoPEP: boolean;
  estadoUIF: boolean;
  estadoPLA: boolean;
  estadoAM: boolean;

  constructor(response: IInformacionLaboralResponse) {
    this.centroTrabajo = response.centroTrabajo;
    if (response.cargoOcupacion && response.cargoOcupacion.identificador) {
      this.cargoOcupacion = response.cargoOcupacion;
    }
    this.idTipoTrabajador = response.idTipoTrabajador || EMPTY;
    this.fechaIngresoTrabajo = response.fechaIngresoTrabajo;
    this.contacto = response.contacto || this.contacto;
    this.estadoPEP = response.estadoPEP || false;
    this.estadoUIF = response.estadoUIF;
    this.estadoPLA = response.estadoPLA;
    this.estadoAM = response.estadoAM;

    const direccion = response.direccion || {};
    this.direccion = {
      idDepartamento: direccion.idDepartamento || EMPTY,
      idProvincia: direccion.idProvincia || EMPTY,
      idDistrito: direccion.idDistrito || EMPTY,
      idTipoZona: direccion.idTipoZona ? direccion.idTipoZona.toString() : EMPTY,
      nombreZona: direccion.nombreZona || EMPTY,
      idTipoVia: direccion.idTipoVia ? direccion.idTipoVia.toString() : EMPTY,
      direccionTexto: direccion.direccionTexto || EMPTY,
      referencia: direccion.referencia || EMPTY
    };
  }
}
