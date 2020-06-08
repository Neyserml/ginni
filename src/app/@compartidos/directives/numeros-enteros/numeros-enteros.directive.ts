import {
  Directive,
  forwardRef,
  ElementRef,
  Optional,
  Host,
  SkipSelf,
  HostListener,
  Input
} from '@angular/core';
import { FormControlName, NgControl, FormControl, ControlContainer } from '@angular/forms';

import { validarEnNodoControl, validarKeydown } from 'app/@compartidos/utils/helpers';

@Directive({
  selector: '[ginniNumerosEnteros]',
  providers: [
    {
      provide: NgControl,
      useExisting: forwardRef(() => FormControlName)
    }
  ]
})
export class NumerosEnterosDirective extends NgControl {
  public _parent: any;

  readonly control: FormControl;

  @Input() formControlName: string;
  @Input() ginniNumerosEnteros = true;

  @HostListener('keydown', ['$event'])
  onKeyDown = $event => {
    if (this.ginniNumerosEnteros) {
      this.eventKeyDown($event);
    }
  };

  @HostListener('keyup', ['$event'])
  onKeyUp = () => {
    if (this.ginniNumerosEnteros) {
      this.eventKeyUpDrag();
    }
  };

  @HostListener('drop', ['$event'])
  onDrag = () => {
    if (this.ginniNumerosEnteros) {
      this.eventKeyUpDrag();
    }
  };
  _validarKeydown = validarKeydown;
  _validarEnNodoControl = validarEnNodoControl;

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

  constructor(private el: ElementRef, @Optional() @Host() @SkipSelf() parent: ControlContainer) {
    super();
    this._parent = parent;
  }

  public viewToModelUpdate(): void {}

  public eventKeyDown(event) {
    this._validarKeydown('[0-9]', true, event);
  }

  public eventKeyUpDrag() {
    if (this.controlName) {
      const formControl = this.controlName.control;
      this._validarEnNodoControl('[0-9]|[-]', this.el, true, formControl);
    }
  }
}
