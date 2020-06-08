import {
  Component,
  forwardRef,
  Input,
  ViewEncapsulation,
  Output,
  OnInit,
  EventEmitter
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ginni-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent implements ControlValueAccessor, OnInit {
  public val;

  @Input() disabled = false;
  @Input() label = '';
  @Input() type = '';
  @Input() value = false;
  @Input() noText = false;

  @Output() valueChange: EventEmitter<boolean> = new EventEmitter();

  onChangeCb: (_: any) => void = () => {};
  onTouchedCb: () => void = () => {};

  constructor() {}

  ngOnInit() {
    this.val = this.value;
  }

  writeValue(value: any): void {
    this.val = value;
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChangeCb = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public clickCheck() {
    if (!this.disabled) {
      const value = !this.val;
      this.val = value;
      this.value = value;
      this.onChangeCb(value);
      this.valueChange.emit(value);
    }
  }
}
