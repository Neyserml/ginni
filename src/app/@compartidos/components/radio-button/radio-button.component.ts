import { Component, OnInit, Input } from '@angular/core';
import { RadioGroupComponent } from './radio-group.component';

@Component({
  selector: 'ginni-radio-button',
  styles: [
    `
      .bold {
        color: black !important;
        font-weight: bold !important;
      }
    `
  ],
  template: `
    <label class="radio-label" [ngClass]="{ checked: activado }" (click)="clickRadio()">
      <div class="radio-label-content" [style.display]="direction === 'left' ? 'block' : 'none'">
        <span [class.bold]="bold">
          {{ label }}
        </span>
      </div>
      <div class="radio-container">
        <div class="radio-outer-circle"></div>
        <div class="radio-inner-circle"></div>
      </div>
      <div class="radio-label-content" [style.display]="direction === 'right' ? 'block' : 'none'">
        <span [class.bold]="bold">
          {{ label }}
        </span>
      </div>
    </label>
  `
})
export class RadioButtonComponent implements OnInit {
  @Input() bold = false;
  @Input() label;
  @Input() value;
  @Input() direction: 'left' | 'right' = 'left';

  public activado = false;

  constructor(private radioGroup: RadioGroupComponent) {}

  ngOnInit() {
    this.radioGroup.addRadioButton(this);
    if (this.value) {
      this.activado = true;
    } else {
      this.activado = false;
    }
  }

  public clickRadio() {
    this.activado = true;
    if (this.activado) {
      this.radioGroup.clickRadio(this.value);
    } else {
      this.radioGroup.clickRadio(null);
    }
  }
}
