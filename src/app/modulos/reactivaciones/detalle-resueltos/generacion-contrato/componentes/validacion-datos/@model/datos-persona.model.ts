import {
  IObtenerDatosPersona,
  IDireccion,
  IInformacionRelevante
} from '../@interfaces/datos-persona.interface';
import { ITelefono } from 'app/modulos/logistica-vehicular/detalle/@models/personal.model';

export class DatosPersona implements IObtenerDatosPersona {
  identificador: number;
  nombres: string;
  apePaterno: string;
  apeMaterno: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefonos: ITelefono[];
  telefonosFijos: ITelefono[];
  celulares: ITelefono[];
  correo: string;
  ruc: string;
  idEstadoCivil: string;
  fechaNacimiento: string;
  idPaisNacionalidad: string;
  idSexo: string;
  direccion: IDireccion;
  informacionRelevante: IInformacionRelevante;

  constructor(datosPersona: IObtenerDatosPersona) {
    const informacionRelevante = datosPersona.informacionRelevante;
    const direccion = datosPersona.direccion;

    this.identificador = datosPersona.identificador;
    this.nombres = datosPersona.nombres || '';
    this.apeMaterno = datosPersona.apeMaterno || '';
    this.apePaterno = datosPersona.apePaterno || '';
    this.tipoDocumento = datosPersona.tipoDocumento || '';
    this.numeroDocumento = datosPersona.numeroDocumento || '';
    this.correo = datosPersona.correo || '';
    this.ruc = datosPersona.ruc || '';
    this.idEstadoCivil = datosPersona.idEstadoCivil ? datosPersona.idEstadoCivil.toString() : '';
    this.fechaNacimiento = datosPersona.fechaNacimiento || '';
    this.idPaisNacionalidad = datosPersona.idPaisNacionalidad
      ? datosPersona.idEstadoCivil.toString()
      : '';
    this.idSexo = datosPersona.idSexo ? datosPersona.idSexo.toString() : '';
    this.telefonos = datosPersona.telefonos;
    this.telefonosFijos = datosPersona.telefonos;
    this.celulares = datosPersona.telefonos;

    // pasando nulls o undefinded a string vacios en teléfonos
    this.telefonos.map(telefono => (telefono.valor ? null : (telefono.valor = '')));

    this.celulares = this.celulares.filter(tel => tel.tipo === 'M');
    this.telefonosFijos = this.telefonosFijos.filter(tel => tel.tipo === 'F');

    if (direccion) {
      this.direccion = {
        idDepartamento: direccion.idDepartamento || '',
        idProvincia: direccion.idProvincia || '',
        idDistrito: direccion.idDistrito || '',
        idTipoZona:
          direccion.idTipoZona && direccion.idTipoZona !== 'null'
            ? direccion.idTipoZona.toString()
            : '',
        nombreZona: direccion.nombreZona || '',
        idTipoVia: direccion.idTipoVia ? direccion.idTipoVia.toString() : '',
        direccionTexto: direccion.direccionTexto || '',
        referencia: direccion.referencia || ''
      };
    } else {
      this.direccion = {
        idDepartamento: '',
        idProvincia: '',
        idDistrito: '',
        idTipoZona: '',
        nombreZona: '',
        idTipoVia: '',
        direccionTexto: '',
        referencia: ''
      };
    }

    this.informacionRelevante = {
      pep: informacionRelevante.pep || false,
      uif: informacionRelevante.uif || false,
      lavadoActivos: informacionRelevante.lavadoActivos || false,
      actividadMinera: informacionRelevante.actividadMinera || false
    };
  }
}
