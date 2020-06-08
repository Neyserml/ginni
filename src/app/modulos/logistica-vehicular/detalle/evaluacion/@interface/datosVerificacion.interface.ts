export interface IListadoVerificaciones {
  id: number;
  persona: ITipo;
  via: ITipo;
  tipo: ITipo;
  verificador: ITipo;
  tieneAdjunto: boolean;
  urlDocumento: string;
  comentarios: string;
  fechaCreacion: string;
}

export interface IDatosVerificacionRequest {
  idPersona: number;
  idVerificador: number;
  idTipoVerificacion: number;
  idViaVerificacion: number;
  comentarios: string;
}

export interface IDatosVerificacionResponse {
  personaVerificacion: IPersonaVerificacion;
}

export interface IPersonaVerificacion {
  id: number;
  persona: ITipo;
  via: ITipo;
  tipo: ITipo;
  verificador: ITipo;
  comentarios: string;
  fechaCreacion: string;
}

export interface ITipo {
  id: number;
  value: string;
}

export interface IArchivoAdjunto {
  nombreArchivo: string;
  base64Encoded: string;
}

export interface IRadioButton {
  valor: any;
  clave: string;
  value?: boolean;
}

export interface IActualizarVerificacionRequest {
  idVerificador: number;
  idTipoVerificacion: number;
  idTipoViaVerificacion: number;
  comentarios: string;
}
