export interface IColumnasSeguimiento {
  name: string;
  className?: string;
}

export interface ISeguimientoResponse {
  listBandejaHistorial: IListarSeguimiento[];
  numeroPaginas: number;
  totalRegistros: number;
}

export interface IListarSeguimiento {
  evento: string;
  fechaEvento: string;
  comentario: string;
  usuario: string;
}

export interface ISeguimientoRequest {
  codigoContrato: string;
  pagina: number;
  cantidad: number;
}

export interface ISeguimientoDescargarRequest {
  codigoContrato: string;
}
