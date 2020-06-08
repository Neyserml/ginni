export interface ITramiteRequest {
  pagina?: number;
  orden?: string;
  modoOrden?: 'asc' | 'desc';
  filtro?: string;
}
