import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CheckboxComponent } from './checkbox.component';
import { ICheckbox } from './model/checkbox.model';

@Component({
  selector: 'ginni-checkbox-group',
  template: `
    <div class="checkbox-container">
      <div class="checkbox" *ngFor="let checkbox of checkboxes">
        <ginni-checkbox
          [disabled]="disabled"
          [label]="checkbox.label"
          [value]="checkbox.value"
          (valueChange)="clickCheckbox(checkbox.label)"
        ></ginni-checkbox>
      </div>
    </div>
  `,
  styles: [
    `
      .checkbox-container {
        display: flex;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-box;
        display: -webkit-flex;
        justify-content: start;
        list-style: none;
        margin: 0;
        padding: 0;
        -webkit-flex-flow: row wrap;
      }

      .checkbox {
        height: 30px;
        width: 50px;
        margin: 4px 60px 24px 0;
      }
    `
  ]
})
export class CheckboxGroupComponent implements OnInit {
  @Input() public checkboxes: ICheckbox[] = [];
  @Input() public disabled = false;

  @Output() public valueChange: EventEmitter<ICheckbox[]> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  public addCheckbox(checkbox: CheckboxComponent) {
    this.checkboxes.push(checkbox);
  }

  public clickCheckbox(label) {
    this.checkboxes.forEach(checkbox => {
      if (label === checkbox.label) {
        checkbox.value = !checkbox.value;
      }
    });
    this.valueChange.emit(this.checkboxes);
  }
}
