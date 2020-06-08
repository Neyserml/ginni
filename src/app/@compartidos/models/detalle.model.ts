import { IDetallePersona } from '../interfaces/detalle.interface';
import { convertToArray } from '../utils/helpers';

export class DetallePersona {
  idPersona: string;
  nombrePersona: string;
  tipoDocumento: string;
  tipoPersona: string;
  numeroDocumento: string;
  nombreRepresentanteLegal?: string;
  departamento: string;
  direccion?: string;
  telefonos?: string[];
  telefonosMovil?: string[];
  correo: string;
  correos?: string[];
  genero: string;
  urlFoto: string;

  constructor(asociadoPersona: IDetallePersona) {
    this.idPersona = asociadoPersona.idPersona;
    this.nombrePersona = asociadoPersona.nombrePersona;
    this.tipoDocumento = asociadoPersona.tipoDocumento;
    this.tipoPersona = asociadoPersona.tipoPersona;
    this.numeroDocumento = asociadoPersona.numeroDocumento;
    this.nombreRepresentanteLegal = asociadoPersona.nombreRepresentanteLegal;
    this.departamento = asociadoPersona.departamento;
    this.direccion = asociadoPersona.direccion;
    this.telefonos = convertToArray(asociadoPersona.telefonos);
    this.telefonosMovil = convertToArray(asociadoPersona.telefonosMovil);
    this.correo = asociadoPersona.correo;
    this.correos = asociadoPersona.correos;
    this.genero = asociadoPersona.genero;
    this.urlFoto = asociadoPersona.urlFoto;
  }
}
