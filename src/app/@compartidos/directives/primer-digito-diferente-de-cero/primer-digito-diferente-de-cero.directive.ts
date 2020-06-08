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

@Directive({
  selector: '[ginniPrimerDigitoDiferenteDeCero]',
  providers: [
    {
      provide: NgControl,
      useExisting: forwardRef(() => FormControlName)
    }
  ]
})
export class PrimerDigitoDiferenteDeCeroDirective extends NgControl {
  public _parent: any;

  readonly control: FormControl;

  @Input() formControlName: string;
  @Input() ginniPrimerDigitoDiferenteDeCero: boolean;

  @HostListener('keydown', ['$event'])
  onKeyDown = $event => {
    if (this.ginniPrimerDigitoDiferenteDeCero) {
      this.eventKeyDown($event);
    }
  };

  @HostListener('keyup', ['$event'])
  onKeyUp = () => {
    if (this.ginniPrimerDigitoDiferenteDeCero) {
      this.eventKeyUpDrag();
    }
  };

  @HostListener('drop', ['$event'])
  onDrag = () => {
    if (this.ginniPrimerDigitoDiferenteDeCero) {
      this.eventKeyUpDrag();
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

  constructor(private el: ElementRef, @Optional() @Host() @SkipSelf() parent: ControlContainer) {
    super();
    this._parent = parent;
  }

  public viewToModelUpdate(): void {}

  public eventKeyDown(event) {
    const reg = /^0+/gi;
    if (event.target.value.match(reg)) {
      event.target.value = event.target.value.replace(reg, '');
    }
  }

  public eventKeyUpDrag() {
    let value = this.el.nativeElement.value;
    const reg = /^0+/gi;
    if (value.match(reg)) {
      value = value.replace(reg, '');
    }
  }
}
