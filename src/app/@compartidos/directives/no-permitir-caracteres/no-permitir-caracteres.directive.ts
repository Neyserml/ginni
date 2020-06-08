import {
  Directive,
  Input,
  forwardRef,
  HostListener,
  Optional,
  Host,
  SkipSelf,
  ElementRef
} from '@angular/core';
import { NgControl, FormControl, FormControlName, ControlContainer } from '@angular/forms';

import { CARACTERES_NO_PERMITIDOS_GENERICO } from 'app/@compartidos/utils/consts';
import { validarEnNodoControl, validarKeydown } from 'app/@compartidos/utils/helpers';

@Directive({
  selector: '[ginniNoPermitirCaracteres]',
  providers: [
    {
      provide: NgControl,
      useExisting: forwardRef(() => FormControlName)
    }
  ]
})
export class NoPermitirCaracteresDirective extends NgControl {
  public _parent: any;

  readonly control: FormControl;

  @Input() formControlName: string;

  @Input()
  ginniNoPermitirCaracteres = true;

  @HostListener('keydown', ['$event'])
  onKeyDown = $event => {
    if (this.ginniNoPermitirCaracteres) {
      this.eventKeyDown($event);
    }
  };

  @HostListener('keyup', ['$event'])
  onKeyUp = () => {
    if (this.ginniNoPermitirCaracteres) {
      this.eventKeyUpDrag();
    }
  };

  @HostListener('drop', ['$event'])
  onDrag = () => {
    if (this.ginniNoPermitirCaracteres) {
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

  viewToModelUpdate(): void {}

  eventKeyDown(event) {
    this._validarKeydown(CARACTERES_NO_PERMITIDOS_GENERICO, false, event);
  }

  eventKeyUpDrag() {
    if (this.controlName) {
      const formControl = this.controlName.control;
      this._validarEnNodoControl(CARACTERES_NO_PERMITIDOS_GENERICO, this.el, false, formControl);
    }
  }
}
