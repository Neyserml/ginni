import { CookieStorage } from 'app/@compartidos/utils/storage';
import { SESION_ACTUAL } from 'app/@compartidos/utils/consts';
import * as moment from 'moment';

export class Sesion {
  token: string;
  vidaToken: number;
  refreshToken: string;
  fechaExpiracion?: Date;
  fechaActual: Date;

  constructor(sesion?: SesionResponsePayload) {
    if (sesion) {
      this.vidaToken = sesion.vidaToken;
      this.token = sesion.token;
      this.refreshToken = sesion.refreshToken;
      this.fechaActual = moment(sesion.fechaActual).toDate();
      if (sesion.fechaExpiracion) {
        this.fechaExpiracion = sesion.fechaExpiracion;
      }
    }
  }

  /**
   * Guardar sesion
   */
  public guardar(): void {
    if (this.fechaExpiracion) {
      CookieStorage.set(SESION_ACTUAL, this, new Date(this.fechaExpiracion));
    } else {
      this.setCookieStorage();
    }
  }

  /**
   * Actualizar tiempo de expiracion
   */
  public actualizarTiempo(): void {
    if (this.vidaToken) {
      this.setCookieStorage();
    }
  }

  private setCookieStorage() {
    const fechaActual = moment(this.fechaActual).toDate();
    const fechaAExpirar = moment(this.vidaToken).toDate();
    this.fechaExpiracion = fechaAExpirar;
    const expiracion = Math.ceil((fechaAExpirar.getTime() - fechaActual.getTime()) / 1000);
    CookieStorage.set(SESION_ACTUAL, this, expiracion);
  }

  /**
   * Eliminar sesion
   */
  public eliminar(): void {
    CookieStorage.remove(SESION_ACTUAL);
  }
}

export interface SesionResponsePayload {
  token: string;
  refreshToken: string;
  vidaToken: number;
  fechaExpiracion?: Date;
  fechaActual: Date;
}
