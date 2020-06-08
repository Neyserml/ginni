import { FormControl, ValidatorFn } from '@angular/forms';

export const NotEmptyValidator = (control: FormControl): ValidatorFn => {
  const isEmpty = (control.value || '').trim().length === 0;
  const isValid = !isEmpty;

  return (): { [key: string]: any } => {
    return isValid ? null : { empty: true };
  };
};
