import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { EMPTY } from './consts';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';

interface IDateFormatted {
  year: number;
  month: number;
  day: number;
}

const REGEX_UNDERSCORE = /_/g;
const ERROR_REQUIRED = 'Este campo es obligatorio';

// tslint:disable-next-line:max-line-length
const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;

@Injectable()
export class ValidationService {
  public validateEmail(formControl: FormControl): { [error: string]: any } {
    if (formControl.value === EMPTY || formControl.value === null) {
      return null;
    }

    let subdominios = false;
    const dominio = formControl.value.split('@')[1];

    if (dominio) {
      subdominios = dominio.split('.').length <= 3;
    }

    return EMAIL_REGEXP.test(formControl.value) && subdominios
      ? null
      : { validateEmail: { valid: false } };
  }

  public validateNumber({ value }: FormControl): { [error: string]: any } {
    if (value === EMPTY || value === null) {
      return null;
    }
    if (Number(value).toString() === 'NaN') {
      return {
        number: true
      };
    }
  }

  public validateMonto({ value }: FormControl) {
    if (value) {
      const ingreso = value.toString();
      const ingresoEnteros = ingreso.split('.')[0];
      const ingresoDecimales = ingreso.split('.')[1];
      if (Number(ingreso) < 0) {
        return { negativo: true };
      } else if (ingresoEnteros.length >= 16) {
        return { enteros: true };
      } else if (ingresoDecimales && ingresoDecimales.length > 2) {
        return { decimales: true };
      } else {
        return null;
      }
    }
  }

  public matchingInputs(controlKey: string, matchingControlKey: string) {
    return (group: FormGroup): { [error: string]: any } => {
      const controls = group.controls;
      const controlFirst = controls[controlKey];
      const controlMatch = controls[matchingControlKey];
      if (!controlFirst || !controlMatch) {
        return null;
      }
      if (controlFirst.value !== controlMatch.value) {
        return { mismatch: { valid: false } };
      }
    };
  }

  private convertFormattedToDate = ({ year, month, day }: IDateFormatted) => {
    return new Date(year, month, day);
  };

  private isValidDate = ({ year, month, day }: IDateFormatted) => {
    const date = new Date(year, month, day);
    if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
      return true;
    }
    return false;
  };

  private getDateObject(str: string): IDateFormatted {
    const dateArr = str.split('/').map(Number);
    return {
      year: dateArr[2],
      month: dateArr[1] - 1,
      day: dateArr[0]
    };
  }

  public fechaNacimiento = (min: number, max?: number) => (
    formControl: FormControl
  ): { descripcion: string } => {
    const errorFechaValidacion = this.fechaValidation(formControl);
    if (errorFechaValidacion) {
      return errorFechaValidacion;
    }
    const value = formControl.value;
    const filteredSlash = value.replace(REGEX_UNDERSCORE, '');
    const dateFormatted = this.getDateObject(filteredSlash);

    const date = this.convertFormattedToDate(dateFormatted);
    const now = new Date();

    if (date > now) {
      return { descripcion: 'La fecha de nacimiento debe ser menor a la fecha actual' };
    }
    let subtractDate = new Date();

    subtractDate.setFullYear(subtractDate.getFullYear() - min);
    if (date > subtractDate) {
      return {
        descripcion: `Debe tener como mínimo ${min} años`
      };
    }

    subtractDate = new Date();
    subtractDate.setFullYear(subtractDate.getFullYear() - Number(max));

    if (date < subtractDate) {
      return { descripcion: `Debe tener como máximo ${max} años` };
    }

    return null;
  };

  public fechaMaximaActual = (formControl: FormControl): { descripcion: string } => {
    const errorFechaValidacion = this.fechaValidation(formControl);
    if (errorFechaValidacion) {
      return errorFechaValidacion;
    }
    const value = formControl.value;
    const filteredSlash = value.replace(REGEX_UNDERSCORE, '');
    const dateFormatted = this.getDateObject(filteredSlash);

    const date = this.convertFormattedToDate(dateFormatted);
    const now = new Date();
    this.setearTiempoACero(now);
    if (date >= now) {
      return { descripcion: 'La fecha debe ser menor a la fecha actual' };
    }
    return null;
  };

  private setearTiempoACero(fecha) {
    fecha.setHours(0, 0, 0, 0).toString();
  }

  public fechaValidation = ({ value }: FormControl): { descripcion: string } => {
    if (!value || value === EMPTY) {
      return {
        descripcion: ERROR_REQUIRED
      };
    }
    const filteredSlash = value.replace(REGEX_UNDERSCORE, '');

    if (filteredSlash.length === 10) {
      const dateFormatted = this.getDateObject(filteredSlash);
      if (this.isValidDate(dateFormatted)) {
        return null;
      }
      return {
        descripcion: 'Completar con una fecha válida'
      };
    } else {
      return {
        descripcion: 'Este campo es obligatorio'
      };
    }
  };

  public direccionValidation = (portalSandbox: PortalSandbox) => (
    group: FormGroup
  ): { [key: string]: any } => {
    const { idPais, idDepartamento, idProvincia, idDistrito } = group.controls;

    if (idPais) {
      if (idPais.value === EMPTY) {
        return { idPais: true };
      }
      if (idPais.value !== portalSandbox.ID_PERU) {
        return null;
      }
    }

    if (idDepartamento.value === EMPTY) {
      return { idDepartamento: true };
    }
    if (idProvincia.value === EMPTY) {
      return { idProvincia: true };
    }
    if (idDistrito.value === EMPTY) {
      return { idDistrito: true };
    }
  };

  public ceroPrimerDigitoValidation({ value }: FormControl): { [error: string]: any } {
    if (value && value[0] === '0') {
      return {
        descripcion: 'No debe empezar el monto con cero'
      };
    }
  }

  public esTrue({ value }: FormControl): { [error: string]: boolean } {
    if (!value) {
      return {
        invalido: true
      };
    }
  }
}
