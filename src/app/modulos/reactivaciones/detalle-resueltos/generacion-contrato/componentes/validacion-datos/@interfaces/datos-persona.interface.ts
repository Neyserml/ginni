import { ITelefono } from 'app/modulos/logistica-vehicular/detalle/@models/personal.model';

export interface IObtenerDatosPersona {
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
}

export interface ITelefonos {
  id: number;
  valor: string;
  anexo: string;
  tipo: string;
  idAmbito: string;
}

export interface IDireccion {
  idDepartamento: string;
  idProvincia: string;
  idDistrito: string;
  idTipoZona: string;
  nombreZona: string;
  idTipoVia: string;
  referencia: string;
  direccionTexto: string;
  nombreDepartamento?: string;
  nombreDistrito?: string;
}

export interface IInformacionRelevante {
  pep: boolean;
  uif: boolean;
  lavadoActivos: boolean;
  actividadMinera: boolean;
}
