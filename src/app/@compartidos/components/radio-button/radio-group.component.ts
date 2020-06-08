import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { RadioButtonComponent as RadioButton } from './radio-button.component';

@Component({
  selector: 'ginni-radio-group',
  template: `
    <ng-content></ng-content>
  `
})
export class RadioGroupComponent implements OnInit {
  @Input() public value;

  @Output() public valueChange: EventEmitter<string> = new EventEmitter();

  private radioButtons: RadioButton[] = [];

  public addRadioButton(radioButton: RadioButton) {
    this.radioButtons.push(radioButton);
  }

  constructor() {}

  ngOnInit() {}

  public clickRadio(radioValue) {
    this.radioButtons.forEach(radioButton => {
      if (radioValue !== radioButton.value) {
        radioButton.activado = false;
      }
    });
    this.valueChange.emit(radioValue);
  }
}
