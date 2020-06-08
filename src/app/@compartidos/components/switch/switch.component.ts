import { Component, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'ginni-switch',
  template: `
    <div class="flag-switch">
      <label for="check1" (click)="clickCheck()" [ngClass]="{ active: val || value }"></label>
    </div>
  `,
  styleUrls: ['./switch.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true
    }
  ]
})
export class SwitchComponent implements ControlValueAccessor {
  public val: boolean = null;
  public active: boolean;
  public form = false;

  @Input() value = false;
  @Input() disabled = false;

  @Output() valueChange: EventEmitter<boolean> = new EventEmitter();

  onChangeCb: (_: any) => void = () => {};
  onTouchedCb: () => void = () => {};

  writeValue(value: any): void {
    this.val = value;
    this.form = true;
  }

  registerOnChange(fn: any): void {
    this.onChangeCb = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  public clickCheck() {
    if (!this.disabled) {
      if (this.form) {
        const newValue = !this.val;
        this.val = newValue;
        this.onChangeCb(newValue);
      } else {
        const newValue = !this.value;
        this.value = newValue;
        this.valueChange.emit(newValue);
      }
    }
  }
}
