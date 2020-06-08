import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ginni-input-date',
  template: `
    <div class="input-group input-group--separate">
      <input
        [textMask]="{ mask: mask }"
        class="form-control"
        type="text"
        [(ngModel)]="value"
        [attr.disabled]="disable ? true : null"
        (ngModelChange)="updateDate($event)"
      />
      <div class="input-group-append">
        <div class="input-group-text"><i class="icon-calendar1"></i></div>
      </div>
    </div>
  `,
  styleUrls: ['./input-date.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDateComponent),
      multi: true
    }
  ]
})
export class InputDateComponent implements ControlValueAccessor {
  @Input() disable;

  public value: string;
  public mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  onChangeCb: (_: any) => void = () => {};
  onTouchedCb: () => void = () => {};

  constructor() {}

  writeValue(value: any): void {
    this.value = String(value);
  }

  registerOnChange(fn: any): void {
    this.onChangeCb = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  updateDate(value): void {
    this.onChangeCb(value);
  }

  setDisabledState(isDisabled: boolean): void {
    this.disable = isDisabled;
  }
}
