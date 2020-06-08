import {
  Directive,
  forwardRef,
  Optional,
  Host,
  SkipSelf,
  HostListener,
  Input
} from '@angular/core';
import { FormControlName, NgControl, FormControl, ControlContainer } from '@angular/forms';

@Directive({
  selector: '[ginniMaximosEnteros]',
  providers: [
    {
      provide: NgControl,
      useExisting: forwardRef(() => FormControlName)
    }
  ]
})
export class MaximosEnterosDirective extends NgControl {
  public _parent: any;

  readonly control: FormControl;

  @Input() formControlName: string;
  @Input() ginniMaximosEnteros: boolean;

  @HostListener('keydown', ['$event'])
  onKeyDown = $event => {
    if (this.ginniMaximosEnteros) {
      this.eventKeyDown($event);
    }
  };

  get formDirective(): any {
    return this._parent ? this._parent.formDirective : null;
  }

  get controlName(): FormControlName {
    if (this.formDirective) {
      return this.formDirective.directives.filter(
        (directive: FormControlName) => directive.name === this.formControlName
      )[0];
    }
  }

  constructor(@Optional() @Host() @SkipSelf() parent: ControlContainer) {
    super();
    this._parent = parent;
  }

  public viewToModelUpdate(): void {}

  public eventKeyDown(event) {
    const value = event.target.value;
    if (value) {
      const reg = /^[0-9]+([.][0-9]+)?$/g;
      const split = value.split('.');

      if (value.match(reg) && !value.endsWith('.') && split.length <= 2) {
        if (value.includes('.')) {
          const enteros = split[0];
          const decimal = split[1];

          if (decimal.length >= 2 || enteros.length >= 15) {
            const maximosEnteros = enteros.slice(0, 15);

            const maximosDecimales = decimal.slice(0, 1);
            event.target.value = `${maximosEnteros}.${maximosDecimales}`;
          }
        } else {
          event.target.value = value.slice(0, 15);
        }
      } else if (split.length > 2 && value.endsWith('.')) {
        event.target.value = value.slice(0, value.length - 1);
      }
    }
  }
}
