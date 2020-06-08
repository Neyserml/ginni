export interface IBuscarPersona {
  idPersona: number;
  nombre: string;
  apellidos: string;
}

export interface IListaBusquedaAsociados {
  idPersona: number;
  idTipoDocumento: number;
  nombre: string;
  numeroDocumento: string;
  razonSocial: string;
  tipoDocumento: number;
  tipoPersona: string;
}
