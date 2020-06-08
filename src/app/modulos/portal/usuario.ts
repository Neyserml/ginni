export interface IUsuario {
  nombresPersona?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  foto?: string;
  perfil?: string;
  primerNombre?: string;
}

export class Usuario {
  nombresPersona: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  foto: string;
  perfil: string;

  constructor(usuario: IUsuario = {}) {
    this.nombresPersona = usuario.nombresPersona || '';
    this.apellidoPaterno = usuario.apellidoPaterno || '';
    this.apellidoMaterno = usuario.apellidoMaterno || '';
    this.foto = usuario.foto || '';
    this.perfil = usuario.perfil || '';
  }

  get primerNombre() {
    return this.nombresPersona.split(' ')[0] || '';
  }
}
