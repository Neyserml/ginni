import { ElementRef } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import Big from 'big.js';
import * as moment from 'moment';
import * as clone from 'lodash/clone';
import * as map from 'lodash/map';

import { IMenuItem, MENU } from './perfiles-items';
import { environment } from 'environments/environment';
import { HASH } from './consts';
import { SIMBOLO_SOL } from '../compartidos.enum';
import { FormGroup } from '@angular/forms';

const typeCache: { [label: string]: boolean } = {};

/**
 * This function coerces a string into a string literal type.
 * Using tagged union types in TypeScript 2.0, this enables
 * powerful typechecking of our reducers.
 *
 * Since every action label passes through this function it
 * is a good place to ensure all of our action labels are unique.
 *
 * @param label
 */
export function type<T>(label: T | ''): T {
  if (typeCache[<string>label]) {
    throw new Error(`tipo de Action "${label}" no es unico`);
  }

  typeCache[<string>label] = true;

  return <T>label;
}

/**
 * Subscribe un evento que se ejecute al cambiar el tamaño de la pantalla
 * @param cb Callback
 */
export const onResizeWindow = (cb: (this: void) => void) => {
  window.addEventListener('resize', cb);
  window.addEventListener('orientationchange', cb);
};

/**
 * Dessubscribe un evento que se habia guardado en onResizeWindow
 * @param cb Callback
 */
export const offResizeWindow = (cb: (this: void) => void) => {
  window.removeEventListener('resize', cb);
  window.removeEventListener('orientationchange', cb);
};

export const esMobile = () => window.innerWidth < 767;

export const esMobileTarget = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
    navigator.userAgent
  );
};

export const esDesktopTarget = (): boolean => {
  return !esMobileTarget();
};

export const esUnSVG = function(url): boolean {
  return url.indexOf('svg') > -1;
};

export function getMenuItemByClave(clave: string, menu: IMenuItem[] = MENU): IMenuItem {
  for (let index = 0; index < menu.length; index++) {
    const item = menu[index];
    if (clave === item.clave) {
      return item;
    }
  }

  return;
}

function convertirItem(item: IMenuItem): IMenuItem {
  let findItem = getMenuItemByClave(item.clave);
  if (!findItem && item.clave) {
    findItem = {
      url: '/portal/pagina-en-construccion'
    };
  }
  if (item.submenu) {
    item.submenu = item.submenu.map(convertirItem);
  }
  findItem = {
    ...item,
    ...findItem
  };

  return findItem;
}

export const unirListMenuServicio = (menuServicio: IMenuItem[]): IMenuItem[] => {
  return menuServicio.map(convertirItem);
};

/**
 * Hacer que el menu sea de solo un nivel
 */
export const aplanarMenu = (menu: IMenuItem[]): IMenuItem[] => {
  const listMenus = [];
  menu.forEach(item => {
    if (item.submenu) {
      listMenus.push.apply(listMenus, item.submenu.filter(subitem => subitem.url));
    } else {
      listMenus.push(item);
    }
  });

  return listMenus;
};

/**
 * Clonar array con sus objetos dentro
 */
export function cloneArray(arr: any[]): any[] {
  return map(arr, clone);
}

export const getParameterByName = (name = '') => {
  const url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

/**
 *
 * @param index primera posicion
 * @param addStr string que va a agregar
 * @param str string donde se va añadir el addStr
 */
export const insertarEnStringPorIndice = (index: number, addStr: string, str: string): string => {
  return str.slice(0, index) + addStr + str.slice(index);
};

export const titleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map(function(word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

/**
 * @param callback función a pasar como parámetro
 */

export const abrirVentanaAdjuntar = (callback): void => {
  const inputElement = document.createElement('input');
  inputElement.setAttribute('type', 'file');
  inputElement.addEventListener('change', (_event: any) => {
    callback();
  });
  inputElement.click();
};

/**
 * Normaliza las tildes de un texto
 * @param str string
 */
export const normalizarTildes = (str: string): string => {
  return str
    .replace(/á/gi, 'a')
    .replace(/é/gi, 'e')
    .replace(/í/gi, 'i')
    .replace(/ó/gi, 'o')
    .replace(/ú/gi, 'u')
    .replace(/ñ/gi, 'n')
    .replace(/Á/gi, 'A')
    .replace(/É/gi, 'E')
    .replace(/Í/gi, 'I')
    .replace(/Ó/gi, 'O')
    .replace(/Ú/gi, 'U')
    .replace(/Ñ/gi, 'N');
};

function blockElement(element: CSSStyleDeclaration): void {
  element.overflow = 'hidden';
  // element.width = '100%';
  // element.height = '100%';
}

function activeElement(element: CSSStyleDeclaration): void {
  element.overflow = '';
  // element.width = '';
  // element.height = '';
}

export const bloquearScroll = (activar): void => {
  const bodyStyle = document.body.style;
  const htmlStyle = document.documentElement.style;
  if (activar) {
    blockElement(bodyStyle);
    blockElement(htmlStyle);
  } else {
    activeElement(bodyStyle);
    activeElement(htmlStyle);
  }
};

/**
 *
 * @param file indica el archivo
 */
export const getPathException = file => {
  return /[.]/.exec(file.name) ? /[^.]+$/.exec(file.name)[0] : undefined;
};

/**
 *
 * @param file Verificará si el archivo es una imagen
 */
export const esImagen = (file: string): boolean => {
  return /\.(jpg|JPG|png|PNG|jpeg|JPEG)$/i.test(file);
};

export const createTitle = (title?: string): string => {
  return title ? title + ' | Ginni' : 'Ginni';
};

export const DROPZONE_ID = '#dropzone';

export const DROPZONE_OPCIONES = {
  url: '/',
  previewsContainer: false,
  autoProcessQueue: false,
  autoQueue: false,
  clickable: '#dropzone > div',
  hiddenInputContainer: 'body',
  createImageThumbnails: false,
  forceFallback: false
};

/**
 * El objeto esta vacio
 */
export const isEmpty = (obj: any): boolean => {
  if (!obj) {
    return true;
  }
  if (Array.isArray(obj)) {
    return obj.length === 0;
  }

  return Object.keys(obj).length === 0;
};

/**
 * El objeto no esta vacio
 */
export const isNotEmpty = (obj: any): boolean => {
  return !isEmpty(obj);
};

/**
 * Convertir en arreglo
 */
export function convertToArray(obj: any): any[] {
  if (!obj) {
    return [];
  }
  if (Array.isArray(obj)) {
    return obj;
  }

  return [obj];
}

export const filtrarRepetidos = (arr: string[]) => (str: string, index: number): boolean =>
  arr.indexOf(str) === index;

export const copiarObjeto = obj => JSON.parse(JSON.stringify(obj));

export const actualizarUppercaseForm = (objeto: any): any => {
  function actualizar(obj) {
    const output = {};
    Object.keys(obj).forEach(key => {
      if (obj[key]) {
        switch (typeof obj[key]) {
          case 'string':
            output[key] = obj[key].toUpperCase();
            break;
          case 'object':
            output[key] = actualizar(obj[key]);
            break;
          default:
            output[key] = obj[key];
            break;
        }
      } else {
        output[key] = obj[key];
      }
    });
    return output;
  }
  return actualizar(objeto);
};

export const extraerOffsetTop = (node: any, top: number = 0): number => {
  const offsetTop = top + node.offsetTop;
  const parent = node.offsetParent;
  if (parent) {
    return extraerOffsetTop(parent, offsetTop);
  }

  return offsetTop;
};

/**
 *
 * @param monedaValor tipo de moneda
 * @param monto monto en string
 */
export const obtenerIngresoDolar = (monedaValor, monto, tipoCambio): number => {
  if (!monto.toString().endsWith('.')) {
    const reg = /^[0-9]+([.][0-9]+)?$/g;
    if (monto.toString().match(reg)) {
      if (monedaValor === SIMBOLO_SOL) {
        monto = Number(monto);
        const tipoCambioDecimal = new Big(tipoCambio);
        const montoMoneda = new Big(monto);

        return montoMoneda.div(tipoCambioDecimal);
      }
    }
  }
};

export function filtrarTelefonos(tel, index) {
  return index === 0 || tel.valor !== '';
}

export function noEsValido(
  caracteresValidar: string,
  permitirCaracteres: boolean,
  value: string
): boolean {
  let regex;
  if (permitirCaracteres) {
    regex = new RegExp('^(' + caracteresValidar + ')+$');
  } else {
    regex = new RegExp('^(?!' + caracteresValidar + ').*$');
  }

  return !regex.test(value);
}

/**
 * @param caracteresValidar Expresión regular
 * @param permitirCaracteres  true solo aceptara los caracteres enviados,
 * false, aceptara todos los caracteres excepto los caracteres enviados
 * @param event evento
 */
export function validarKeydown(caracteresValidar: string, permitirCaracteres: boolean, event) {
  if (caracteresValidar) {
    const controlPresionado = event.ctrlKey;
    const esEventoPega = controlPresionado && (event.keyCode === 67 || event.key === 'v');
    const esEventoCopia = controlPresionado && (event.keyCode === 65 || event.key === 'c');

    if (
      [46, 8, 9, 27, 13].indexOf(event.keyCode) !== -1 ||
      // Allow: Ctrl+A
      esEventoCopia ||
      // Allow: Ctrl+C
      esEventoPega ||
      // Allow: Ctrl+P
      (event.keyCode === 80 && event.ctrlKey === true) ||
      // Allow: Ctrl+X
      (event.keyCode === 88 && event.ctrlKey === true) ||
      // Allow: home, end, left, right
      (event.keyCode >= 35 && event.keyCode <= 39)
    ) {
      // let it happen, don't do anything
      return;
    }

    if (noEsValido(caracteresValidar, permitirCaracteres, event.key)) {
      event.preventDefault();

      return false;
    }
  }
}

export function validarEnNodoControl(
  caracteresValidar: string,
  el: ElementRef,
  permitirCaracteres: boolean,
  control: AbstractControl
): void {
  if (caracteresValidar) {
    setTimeout(() => {
      const node = el.nativeElement;
      if (permitirCaracteres) {
        if (node.value && noEsValido(caracteresValidar, permitirCaracteres, node.value)) {
          const matches = node.value.match(new RegExp(caracteresValidar, 'g'));
          if (matches) {
            control.setValue(matches.join(''));
          } else {
            control.setValue('');
          }
        }
      } else {
        if (node.value) {
          control.setValue(node.value.replace(new RegExp(caracteresValidar, 'g'), ''));
        }
      }
    }, 10);
  }
}

export function isNormalInteger(str): boolean {
  return /^(0|[1-9]\d*)$/.test(str);
}

export function isBetween(x, min, max): boolean {
  return Number(x) >= Number(min) && Number(x) <= Number(max);
}

export function removeLeadingZeros(texto: string): string {
  if (texto.charAt(0) === '0') {
    texto = texto.substr(1);
    if (texto.charAt(0) === '0') {
      return this.removeLeadingZeros(texto);
    } else {
      return texto;
    }
  } else {
    return texto;
  }
}

export function insertCharacterInString(
  texto: string,
  position: number,
  character: string
): string {
  return [texto.slice(0, position), character, texto.slice(position)].join('');
}

export function getEnvironment(): string {
  if (environment.testing) {
    return 'QA';
  } else {
    if (environment.production) {
      return 'PROD';
    } else {
      return 'DEV';
    }
  }
}

export function getVersion(): string {
  return environment.version;
}

export function unique(arrIn: string[]): string[] {
  const arr = [];
  arrIn.forEach(item => {
    if (arr.indexOf(item) === -1) {
      arr.push(item);
    }
  });

  return arr;
}

export function abreviar(completo: string): string {
  if (completo.length > 20) {
    return completo
      .split(' ')
      .map(palabra => {
        const recortada = palabra.substr(0, 4);
        return palabra.length > 6 ? recortada.concat('.') : recortada;
      })
      .join(' ')
      .substr(0, 20);
  } else {
    return completo;
  }
}

export function formatoMonedaSinSimbolo(moneda: string | number, negative = false) {
  return (negative ? '-' : '') + decimalesMoneda(Number(moneda).toFixed(2));
}

export function formatoMoneda(moneda: string | number, negative = false) {
  return (negative ? '- ' : '') + '$ ' + decimalesMoneda(Number(moneda).toFixed(2));
}

export function formatoMonedaSinDecimales(moneda: string | number, negative = false) {
  return (negative ? '-' : '') + '$ ' + decimalesMoneda(Number(moneda).toFixed(0));
}

export function decimalesMoneda(numero: string | number) {
  if (numero) {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}

export function isSafari() {
  const ua = navigator.userAgent.toLowerCase();

  return ua.indexOf('safari') !== -1 ? ua.indexOf('chrome') <= -1 : false;
}

export function dateFormat(date: string): string {
  return date ? moment(date).format('DD/MM/YYYY') : '';
}

export function timeFormat(date: string): string {
  const ampm = moment(date).hour() >= 12 ? 'PM' : 'AM';
  return date ? moment(date).format('HH:mm') + ampm : '';
}

/**
 * Subscribe un evento que se ejecute al cambiar el tamaño de la pantalla
 * @param data Matriz que se filtrará
 * @param order Por default es asc
 * @param value Valor que se va a filtrar
 */
export function sortData(data, order = 'asc', value) {
  if (order === 'asc') {
    return data.sort((a, b) => {
      if (a[value] < b[value]) {
        return -1;
      } // a comes first
      if (a[value] > b[value]) {
        return 1;
      } // b comes first
      return 0;
    });
  } else {
    return data.sort((a, b) => {
      if (a[value] < b[value]) {
        return 1;
      } // b comes first
      if (a[value] > b[value]) {
        return -1;
      } // a comes first
      return 0;
    });
  }
}

export function getIdBloqueContrato(): string {
  const regexIdBloqueContrato = /\d+/g;
  const rutaInicioPosicion = window.location.href.indexOf(HASH);
  const ruta = window.location.href.slice(rutaInicioPosicion);
  return regexIdBloqueContrato.exec(ruta)[0];
}

export function dateIsValid(date) {
  return Object.prototype.toString.call(date) === '[object Date]' ? !isNaN(date.getTime()) : false;
}

export function desactivarControles(form: FormGroup, controls: string[]) {
  controls.map(control => {
    form.get(control).disable();
  });
}

export function activarControles(form: FormGroup, controls: string[]) {
  controls.map(control => {
    form.get(control).enable();
  });
}

/**
 * Capitalizar texto
 */

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
