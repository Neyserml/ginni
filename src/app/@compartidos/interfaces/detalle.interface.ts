export interface IBloqueContratoResponse {
  segmento: string;
  numeroDias: string;
  personasId: string[];
}

export interface IDetalleCabeceraResponse {
  fechaActualizacion: string;
  personas: IDetallePersona[];
}

export interface IGetDetalleCabeceraResponse {
  personas: IDetallePersona[];
}

export interface IDetalle {
  segmento: string;
  numeroDias: number;
  fechaActualizacion: string;
  personas: IDetallePersona[];
}

export interface IDetalleCabeceraResponse extends IGetDetalleCabeceraResponse {
  fechaActualizacion: string;
}

export interface IDetallePersona {
  idPersona: string;
  nombrePersona: string;
  tipoDocumento: string;
  tipoPersona: string;
  numeroDocumento: string;
  departamento: string;
  direccion?: string;
  telefonos?: string[];
  telefonosMovil?: string[];
  correo: string;
  nombreRepresentanteLegal?: string;
  correos?: string[];
  genero: string;
  urlFoto: string;
}

export interface IBloqueContrato {
  idBloqueContrato: string;
}
