import * as CryptoJS from 'crypto-js';

export class InicioSesionModel {
  nombreUsuario: string;
  contrasenia: any;
  recaptchaToken: string;

  constructor({ nombreUsuario, contrasenia }, recaptchaToken) {
    const privateKey = 'C73DF77EED103A51';
    const iv = 'D6EE278C0477A392';
    const keyProperties = {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: iv
    };
    this.nombreUsuario = nombreUsuario;
    this.contrasenia = CryptoJS.AES.encrypt(contrasenia, privateKey, keyProperties).toString();
    this.recaptchaToken = recaptchaToken;
  }
}
