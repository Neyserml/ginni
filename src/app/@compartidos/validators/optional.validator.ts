import { ValidatorFn, AbstractControl, Validators } from '@angular/forms';

export const OptionalValidator = (validators?: (ValidatorFn | null | undefined)[]): ValidatorFn => {
  return (control: AbstractControl): { [key: string]: any } => {
    return control.value ? Validators.compose(validators)(control) : null;
  };
};
