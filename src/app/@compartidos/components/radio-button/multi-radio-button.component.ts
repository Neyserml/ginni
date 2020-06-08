import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ginni-multi-radio-button',
  template: `
    <label class="radio-label" [ngClass]="{ checked: value }">
      <div class="radio-label-content" [style.display]="direction === 'left' ? 'block' : 'none'">
        {{ label }}
      </div>
      <div class="radio-container">
        <div class="radio-outer-circle"></div>
        <div class="radio-inner-circle"></div>
      </div>
      <div class="radio-label-content" [style.display]="direction === 'right' ? 'block' : 'none'">
        {{ label }}
      </div>
    </label>
  `
})
export class MultiRadioButtonComponent implements OnInit {
  @Input()
  label;
  @Input()
  value;
  @Input()
  direction: 'left' | 'right' = 'left';

  @Output()
  valueChange: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
