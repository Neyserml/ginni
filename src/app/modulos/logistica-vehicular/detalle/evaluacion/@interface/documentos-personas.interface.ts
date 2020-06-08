export interface IDocumentosPersonas {
  documentos: IListaDocumentosPersonas[];
  idCreditoPersona: number;
  idPersona: number;
  idTipoDocumento: string;
  garantiaReal: boolean;
  nombre: string;
  numeroDocumento: string;
  razonSocial: string;
  readOnly: boolean;
  tipo: string;
  tipoDocumento: string;
  tipoPersona: string;
  accionGarante?: string;
  verificaciones: Array<IVerificaciones>;
}

export interface IListaDocumentosPersonas {
  archivoCargado: boolean;
  descripcion: string;
  id: number;
  idCreditoPersona: number;
  nombre: string;
  url: string;
}

interface IVerificaciones {
  id: number;
  descripcion: string;
  estado: boolean;
  creditoPersonaId: number;
}

export interface IBotonAccionRequest {
  bloqueContratoId: number;
  comentario: string;
}

export interface IMensaje {
  mensaje: string;
}

export interface ICheckboxesRequest {
  id: number;
  valorCheckbox: string;
}
