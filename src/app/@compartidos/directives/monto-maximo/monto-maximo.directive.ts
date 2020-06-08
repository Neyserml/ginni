import {
  Directive,
  forwardRef,
  Optional,
  Host,
  SkipSelf,
  HostListener,
  Input,
  ElementRef
} from '@angular/core';
import { FormControlName, NgControl, FormControl, ControlContainer } from '@angular/forms';

@Directive({
  selector: '[ginniMontoMaximo]',
  providers: [
    {
      provide: NgControl,
      useExisting: forwardRef(() => FormControlName)
    }
  ]
})
export class MontoMaximoDirective extends NgControl {
  public _parent: any;

  readonly control: FormControl;

  @Input() formControlName: string;
  @Input() ginniMontoMaximo: boolean;

  @HostListener('keydown', ['$event'])
  onkeydown = $event => {
    if (this.ginniMontoMaximo) {
      this.eventKeyDown($event);
    }
  };

  @HostListener('keyup', ['$event'])
  onKeyUp = () => {
    if (this.ginniMontoMaximo) {
      this.eventKeyUpDrag();
    }
  };

  get formDirective(): any {
    return this._parent ? this._parent.formDirective : null;
  }

  get controlName(): FormControlName {
    return this.formDirective.directives.filter(
      (directive: FormControlName) => directive.name === this.formControlName
    )[0];
  }

  constructor(private el: ElementRef, @Optional() @Host() @SkipSelf() parent: ControlContainer) {
    super();
    this._parent = parent;
  }

  public viewToModelUpdate(): void {}

  public eventKeyDown(event) {
    const value = event.target.value;
    const split = value.split('.');
    if (split.length >= 3) {
      event.target.value = value.slice(0, value.length - 1);
    }
  }

  public eventKeyUpDrag() {
    const value = this.el.nativeElement.value;
    const reg = /^[0-9]+([.][0-9]+)?$/g;
    const split = value.split('.');

    if (value.match(reg) && split.length <= 2) {
      if (value.includes('.')) {
        const enteros = split[0];
        const decimal = split[1];

        if (decimal.length >= 2 || enteros.length >= 15) {
          const maximosEnteros = enteros.slice(0, 15);
          const maximosDecimales = decimal.slice(0, 3);

          this.el.nativeElement.value = `${maximosEnteros}.${maximosDecimales}`;
        }
      } else {
        this.el.nativeElement.value = value.slice(0, 16);
      }
    }
  }
}
