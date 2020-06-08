import * as CryptoJS from 'crypto-js';

export class RecuperarContraseniaModel {
  token: string;
  contrasenia: string;

  constructor(data) {
    const privateKey = 'C73DF77EED103A51';
    const iv = 'D6EE278C0477A392';
    const keyProperties = {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: iv
    };

    this.token = data.token;
    this.contrasenia = CryptoJS.AES.encrypt(data.contrasenia, privateKey, keyProperties).toString();
  }
}
