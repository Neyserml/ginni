import * as Cookies from 'js-cookie';

interface IStorage {
  set: Function;
  get: Function;
  remove: Function;
}

export class Storage implements IStorage {
  public STORAGE: any;

  /**
   * @param STORAGE type storage (sessionStorage | localStorage)
   */
  constructor(STORAGE = window.sessionStorage) {
    this.STORAGE = STORAGE;
  }

  public set(key, value) {
    if (key && typeof value !== 'undefined') {
      this.STORAGE[key] = JSON.stringify(value);
    }
  }
  public get(key) {
    const value = this.STORAGE[key];

    return value ? JSON.parse(value) : undefined;
  }
  public remove(key) {
    delete this.STORAGE[key];
  }
}

export class StorageCookie implements IStorage {
  public set(key, value, expires) {
    Cookies.set(key, JSON.stringify(value), { expires });
  }
  public get(key) {
    const value = Cookies.get(key);

    return value ? JSON.parse(value) : undefined;
  }
  public remove(key) {
    Cookies.remove(key);
  }
}

export const CookieStorage = new StorageCookie();
export const LocalStorage = new Storage(window.localStorage);
export const SessionStorage = new Storage(window.sessionStorage);
