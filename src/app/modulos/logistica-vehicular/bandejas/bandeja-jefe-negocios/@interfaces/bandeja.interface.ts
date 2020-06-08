export interface IListarBandejaRequest {
  pagina: number;
  modoOrden: string;
  orden: string;
  filtro: string;
  celula: string;
}

export interface IBandejaAprobadoRequest {
  pagina: number;
  numeroContrato: string;
}

export interface IDescargaExcelRequest {
  filtro: string;
  celula: string;
}
