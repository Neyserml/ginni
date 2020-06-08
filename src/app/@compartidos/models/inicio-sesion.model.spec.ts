import * as CryptoJS from 'crypto-js';
import { InicioSesionModel } from './inicio-sesion.model';

describe('InicioSesionModel', () => {
  it('deberia encriptar con AES y clave "C73DF77EED103A51" correctamente', () => {
    const contrasenia = 'contrasenia';

    const privateKey = 'C73DF77EED103A51';
    const iv = 'D6EE278C0477A392';
    const keyProperties = {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: iv
    };
    const inicioSesionModel = new InicioSesionModel(
      {
        nombreUsuario: 'username',
        contrasenia
      },
      'recaptchaToken'
    );

    expect(
      CryptoJS.AES.decrypt(inicioSesionModel.contrasenia, privateKey, keyProperties).toString(
        CryptoJS.enc.Utf8
      )
    ).toEqual(contrasenia);
  });
});
