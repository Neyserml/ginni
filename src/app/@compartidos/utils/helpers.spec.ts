import {
  abreviar,
  dateFormat,
  dateIsValid,
  decimalesMoneda,
  formatoMoneda,
  formatoMonedaSinSimbolo,
  insertCharacterInString,
  isBetween,
  isEmpty,
  isNormalInteger,
  isNotEmpty,
  isSafari,
  removeLeadingZeros,
  type,
  unirListMenuServicio
} from './helpers';
import { IMenuItem } from './perfiles-items';

describe('helpers', () => {
  describe('type', () => {
    it('deberia poder escribir multiples acciones', () => {
      expect(type('[Test Type] Load')).toEqual('[Test Type] Load');
      expect(type('[Test Type 2] Load')).toEqual('[Test Type 2] Load');
    });

    it('deberia retonar un error cuando se agrega dos acciones son el mismo nombre', () => {
      expect(type('[Test Error] Load')).toEqual('[Test Error] Load');
      expect(function() {
        type('[Test Error] Load');
      }).toThrowError('tipo de Action "[Test Error] Load" no es unico');
    });
  });

  describe('unirListMenuServicio', () => {
    it('deberia llenar el menu del servicio con informacion de la constante MENU', () => {
      const serviceTest: IMenuItem[] = [
        {
          nombre: 'Mi Espacio',
          icono: 'home',
          clave: 'miespacio'
        },
        {
          nombre: 'Bandeja de Trabajo',
          icono: 'inbox',
          clave: 'bandejacelula'
        }
      ];
      expect(unirListMenuServicio(serviceTest)).toEqual([
        {
          nombre: 'Mi Espacio',
          clave: 'miespacio',
          icono: 'home',
          url: '/portal/mi-espacio'
        },
        {
          nombre: 'Bandeja de Trabajo',
          clave: 'bandejacelula',
          icono: 'inbox',
          url: '/portal/bandeja-de-trabajo'
        }
      ]);
    });
    it('deberia agregar la data respectiva cuando hay submenus', () => {
      const serviceTest: IMenuItem[] = [
        {
          nombre: 'Mi Espacio',
          submenu: [
            {
              clave: 'miespacio',
              icono: 'home',
              nombre: 'Mi Espacio'
            }
          ]
        },
        {
          nombre: 'Bandeja de Trabajo',
          icono: 'inbox',
          clave: 'bandejacelula'
        }
      ];
      expect(unirListMenuServicio(serviceTest)).toEqual([
        {
          nombre: 'Mi Espacio',
          submenu: [
            {
              clave: 'miespacio',
              nombre: 'Mi Espacio',
              icono: 'home',
              url: '/portal/mi-espacio'
            }
          ]
        },
        {
          nombre: 'Bandeja de Trabajo',
          clave: 'bandejacelula',
          icono: 'inbox',
          url: '/portal/bandeja-de-trabajo'
        }
      ]);
    });

    it('si no encuentra una clave, deberia ponerle la url de pagina en construccion', () => {
      expect(
        unirListMenuServicio([
          {
            nombre: 'Mov.',
            clave: 'no-existe'
          }
        ])
      ).toEqual([
        {
          nombre: 'Mov.',
          clave: 'no-existe',
          url: '/portal/pagina-en-construccion'
        }
      ]);
    });

    it('debe abreviar cadenas de texto', () => {
      const masDe20 = 'CANCELACION DE UN CREDITO HIPOTECARIO';
      const abreviadoMasDe20 = abreviar(masDe20);
      expect(abreviadoMasDe20).toEqual('CANC. DE UN CRED. HI');

      const justo20 = 'CANCELACION DE CREDITO HIPOTECARIO';
      const abreviadoJusto20 = abreviar(justo20);
      expect(abreviadoJusto20).toEqual('CANC. DE CRED. HIPO.');

      const menosDe20 = 'TODO PAGADO';
      const abreviadoMenosDe20 = abreviar(menosDe20);
      expect(abreviadoMenosDe20).toEqual(menosDe20);
    });

    it('should determine if is not empty', () => {
      const x1 = {};
      const normal1 = isNotEmpty(x1);
      expect(normal1).toBeFalsy();

      const x2 = { not: 'empty' };
      const normal2 = isNotEmpty(x2);
      expect(normal2).toBeTruthy();

      const x3 = [];
      const normal3 = isNotEmpty(x3);
      expect(normal3).toBeFalsy();

      const x4 = ['not', 'empty'];
      const normal4 = isNotEmpty(x4);
      expect(normal4).toBeTruthy();

      const x5 = undefined;
      const normal5 = isNotEmpty(x5);
      expect(normal5).toBeFalsy();
    });

    it('should determine if is empty', () => {
      const x1 = {};
      const normal1 = isEmpty(x1);
      expect(normal1).toBeTruthy();

      const x2 = { not: 'empty' };
      const normal2 = isEmpty(x2);
      expect(normal2).toBeFalsy();

      const x3 = [];
      const normal3 = isEmpty(x3);
      expect(normal3).toBeTruthy();

      const x4 = ['not', 'empty'];
      const normal4 = isEmpty(x4);
      expect(normal4).toBeFalsy();

      const x5 = undefined;
      const normal5 = isEmpty(x5);
      expect(normal5).toBeTruthy();
    });

    it('should determine if is normal integer', () => {
      const x1 = 1;
      const normal1 = isNormalInteger(x1);
      expect(normal1).toBeTruthy();

      const x2 = 'a';
      const normal2 = isNormalInteger(x2);
      expect(normal2).toBeFalsy();
    });

    it('should determine if is between', () => {
      const x1 = 1;
      const max1 = 2;
      const min1 = 0;
      const between1 = isBetween(x1, min1, max1);
      expect(between1).toBeTruthy();

      const x2 = 3;
      const max2 = 2;
      const min2 = 0;
      const between2 = isBetween(x2, min2, max2);
      expect(between2).toBeFalsy();
    });

    it('should remove leading zeros', () => {
      const texto1 = '123';
      const removed1 = removeLeadingZeros(texto1);
      expect(removed1).toEqual('123');

      const texto2 = '1023';
      const removed2 = removeLeadingZeros(texto2);
      expect(removed2).toEqual('1023');

      const texto3 = '10230';
      const removed3 = removeLeadingZeros(texto3);
      expect(removed3).toEqual('10230');

      const texto4 = '102300';
      const removed4 = removeLeadingZeros(texto4);
      expect(removed4).toEqual('102300');

      const texto5 = '0123';
      const removed5 = removeLeadingZeros(texto5);
      expect(removed5).toEqual('123');

      const texto6 = '00123';
      const removed6 = removeLeadingZeros(texto6);
      expect(removed6).toEqual('123');

      const texto7 = '000123';
      const removed7 = removeLeadingZeros(texto7);
      expect(removed7).toEqual('123');
    });

    it('should insert character in string', () => {
      const texto = 'abcdefg';
      const posicion = 3;
      const character = 'xyz';
      const inserted = insertCharacterInString(texto, posicion, character);
      expect(inserted).toEqual('abcxyzdefg');
    });

    it('should format moneda', () => {
      const decimales = 10;
      const moneda = formatoMoneda(decimales);
      expect(moneda).toEqual('$ ' + decimalesMoneda(Number(decimales).toFixed(2)));
    });

    it('should format moneda sin simbolo', () => {
      const decimales = 10;
      const moneda = formatoMonedaSinSimbolo(decimales);
      expect(moneda).toEqual(decimalesMoneda(Number(decimales).toFixed(2)));
    });

    it('should format decimales moneda', () => {
      const numero1 = 123;
      const decimales1 = decimalesMoneda(numero1);
      expect(decimales1).toEqual('123');

      const numero2 = 1234;
      const decimales2 = decimalesMoneda(numero2);
      expect(decimales2).toEqual('1,234');

      const numero3 = 12345;
      const decimales3 = decimalesMoneda(numero3);
      expect(decimales3).toEqual('12,345');

      const numero4 = 123456;
      const decimales4 = decimalesMoneda(numero4);
      expect(decimales4).toEqual('123,456');

      const numero5 = 1234567;
      const decimales5 = decimalesMoneda(numero5);
      expect(decimales5).toEqual('1,234,567');

      const numero6 = 12345678;
      const decimales6 = decimalesMoneda(numero6);
      expect(decimales6).toEqual('12,345,678');

      const decimales7 = decimalesMoneda(undefined);
      expect(decimales7).toBeUndefined();
    });

    it('should not detect if is safari', () => {
      spyOn(navigator.userAgent, 'toLowerCase').and.returnValue('chrome');
      const safari = isSafari();
      expect(safari).toBeFalsy();
    });

    it('should format date', () => {
      const date = '2018-11-07T17:03:29.00Z';
      const formated = dateFormat(date);
      expect(formated).toEqual('07/11/2018');
    });

    it('should not validate date', () => {
      const date = '2018-11-07T17:03:29.00Z';
      const valid = dateIsValid(date);
      expect(valid).toBeFalsy();
    });

    it('should validate date', () => {
      const date = new Date('2020-01-03T17:38:41.909+0000');
      const valid = dateIsValid(date);
      expect(valid).toBeTruthy();
    });
  });
});
