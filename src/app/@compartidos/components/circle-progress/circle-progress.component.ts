import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'ginni-circle-progress',
  template: `
    <div
      class="circle-progress"
      [ngClass]="{ 'less-50': percent < 50, small: this.size < 65 }"
      [style.font-size]="fontSize"
    >
      <div class="label-progress">
        <div class="progress-contain"><ng-content></ng-content></div>
      </div>
      <div class="circle">
        <div class="left-side half-circle" [ngStyle]="currentStyles"></div>
        <div class="right-side half-circle" [style.borderColor]="color"></div>
      </div>
      <div class="shadow"></div>
    </div>
  `,
  styleUrls: ['./circle-progress.component.scss']
})
export class CircleProgressComponent implements OnChanges {
  @Input()
  percent: number;
  @Input()
  size: number;
  @Input()
  color: string;

  fontSize = '100px';
  currentStyles = {};

  ngOnChanges() {
    this.currentStyles = {
      transform: 'rotate(' + (360 * this.percent) / 100 + 'deg)',
      borderColor: this.color
    };
    this.fontSize = this.size ? this.size + 'px' : '100px';
  }
}
