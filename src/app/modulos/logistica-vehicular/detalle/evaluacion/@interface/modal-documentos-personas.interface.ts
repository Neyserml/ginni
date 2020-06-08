export interface IModalDocumentosPersonas {
  listaDocumentos: Array<IListaDocumentos>;
  listaDocumentosAdicionales: Array<IListaDocumentosAdicionales>;
}

export interface IListaDocumentos {
  creditoPersonaDocumentoId?: number;
  nombre: string | '';
  descripcion?: string;
  archivoCargado?: boolean;
  observacion?: string;
  tipoArchivo?: 'pdf' | 'imagen';
  url?: string;
  archivo?: any;
  adicional?: boolean;
  archivoBlob?: Blob;
}

export interface IListaDocumentosAdicionales {
  documentoId: number;
  nombre: string;
  descripcion: string;
  value: boolean;
  id: number;
}

export interface IFile {
  lastModified: number;
  lastModifiedDate: any;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}
