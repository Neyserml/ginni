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
  selector: '[ginniMaximosDecimales]',
  providers: [
    {
      provide: NgControl,
      useExisting: forwardRef(() => FormControlName)
    }
  ]
})
export class MaximosDecimalesDirective extends NgControl {
  public _parent: any;

  readonly control: FormControl;

  @Input() formControlName: string;
  @Input() ginniMaximosDecimales: boolean;

  @HostListener('keydown', ['$event'])
  onKeyDown = $event => {
    if (this.ginniMaximosDecimales) {
      this.eventKeyDown($event);
    }
  };

  @HostListener('keyup', ['$event'])
  onKeyUp = () => {
    if (this.ginniMaximosDecimales) {
      this.eventKeyUpDrag();
    }
  };

  @HostListener('drop', ['$event'])
  onDrag = () => {
    if (this.ginniMaximosDecimales) {
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
    if (event.target.value) {
      const valueSplit = event.target.value.split('.');
      if (valueSplit && valueSplit.length <= 2) {
        if (valueSplit[1] && valueSplit[1].length > 2) {
          event.target.value = event.target.value.slice(0, -1) + '';
        }
      } else {
        event.target.value = event.target.value.slice(0, -1) + '';
      }
    }
  }

  public eventKeyUpDrag() {
    const value = this.el.nativeElement.value;
    if (value) {
      const valueSplit = value.split('.');
      if (valueSplit && valueSplit.length <= 2) {
        if (valueSplit[1] && valueSplit[1].length > 2) {
          this.el.nativeElement.value = this.el.nativeElement.value.slice(0, -1) + '';
        }
      } else {
        this.el.nativeElement.value = this.el.nativeElement.value.slice(0, -1) + '';
      }
    }
  }
}
