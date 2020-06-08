import { IDetallePersona } from 'app/@compartidos/interfaces/detalle.interface';

export class DetalleModel implements IDetallePersona {
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

  constructor(detalle: IDetallePersona) {
    this.idPersona = detalle.idPersona;
    this.nombrePersona = detalle.nombrePersona ? detalle.nombrePersona.toUpperCase() : '-';
    this.tipoDocumento = detalle.tipoDocumento ? detalle.tipoDocumento.toUpperCase() : '-';
    this.tipoPersona = detalle.tipoPersona;
    this.numeroDocumento = detalle.numeroDocumento;
    this.departamento = detalle.departamento ? detalle.departamento.toUpperCase() : '-';
    this.direccion = detalle.direccion ? detalle.direccion.toUpperCase() : '-';
    this.telefonos = detalle.telefonos;
    this.correo = detalle.correos[0] ? detalle.correos[0].toUpperCase() : '-';
    this.nombreRepresentanteLegal = detalle.nombreRepresentanteLegal
      ? detalle.nombreRepresentanteLegal.toUpperCase()
      : null;
    this.genero = detalle.genero ? detalle.genero.toUpperCase() : null;
    this.urlFoto = detalle.urlFoto;
  }
}
