import { FormElement } from '../compartidos.enum';

export interface IForm {
  disabled?: boolean;
  formControlName: string;
  grillas: string;
  element:
    | FormElement.INPUT
    | FormElement.SELECT
    | FormElement.DATE
    | FormElement.CHECKBOX
    | FormElement.TEXT;
  label: string;
  maxLength?: string;
  noCaracteresEspeciales?: boolean;
  options?: any;
  obligatorio: boolean;
  soloNumeros?: boolean;
  validaciones: any[];
  value: string;
}
