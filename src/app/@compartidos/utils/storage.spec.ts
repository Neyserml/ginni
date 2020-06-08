import { Storage, StorageCookie } from './storage';

describe('storage', () => {
  describe('Storage', () => {
    const DATA_NAME = 'DATA_NAME';
    const data = 'private';
    const storage = new Storage();
    const cookieStorage = new StorageCookie();

    describe('localstorage y sessionstorage', () => {
      it('deberia ser construido por defecto con sessionStorage', () => {
        expect(storage.STORAGE).toEqual(window.sessionStorage);
      });

      it('deberia poder agregar y extraer', () => {
        storage.set(DATA_NAME, data);
        expect(storage.get(DATA_NAME)).toEqual(data);
      });

      it('deberia poder eliminarse', () => {
        storage.remove(DATA_NAME);
        expect(storage.get(DATA_NAME)).toBeUndefined();
      });
    });

    describe('cookie', () => {
      it('deberia poder agregar y extraer', () => {
        cookieStorage.set(DATA_NAME, data, 50);
        expect(cookieStorage.get(DATA_NAME)).toEqual(data);
      });

      it('deberia poder eliminarse', () => {
        cookieStorage.remove(DATA_NAME);
        expect(cookieStorage.get(DATA_NAME)).toBeUndefined();
      });
    });
  });
});
