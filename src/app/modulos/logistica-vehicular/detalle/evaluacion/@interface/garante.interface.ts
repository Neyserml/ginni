import { IDireccionLaboral } from '../../@models/laboral.model';

export interface ISubirArchivo {
  filename: string;
  sizeInMB: number;
}

export interface IGaranteDetalle {
  idRelacion: string;
  idPersonaRelacionada: string;
  idPersona: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  idTipoRelacion: string;
  idEstadoCivil: string;
  tipoDocumento: string;
  numeroDocumento: string;
  tipoPersona: string;
  idPaisNacionalidad: string;
  fechaNacimiento: string;
  idSexo: string;
  correo: string;
  celular: string;
  telefonoFijo: string;
  estadoPEP: boolean;
  direccionDomicilio?: IDireccionLaboral;
  aportaIngresos: boolean;
  mensajesAlertas: string[];
  esLegal: boolean;
  tipoGarante?: string;
}

export interface IAgregarGarante {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  idTipoRelacion: string;
  idEstadoCivil: string;
  idBloqueContrato?: string;
  fechaNacimiento: string;
  idSexo: number;
  correo: string;
  celular: string;
  direccionDomicilio: {
    idDepartamento: string;
    idProvincia: string;
    idDistrito: string;
    idTipoZona: string;
    nombreZona: string;
    idTipoVia: string;
    direccionTexto: string;
    referencia: string;
  };
  numeroDocumento: string;
  tipoDocumento: number;
  esLegal: boolean;
  idPersona: string;
  mensajesAlertas: Array<string>;
  seAgrega?: boolean;
}

export interface IBuscarGarante {
  numeroDocumento: string;
  tipoDocumento: string;
  idBloqueContrato: string;
}
