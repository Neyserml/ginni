import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChangeContext, Options } from 'ng5-slider';
import { IDoubleSlider } from './models/double-slider.model';

@Component({
  selector: 'ginni-double-slider',
  templateUrl: './double-slider.component.html',
  styleUrls: ['./double-slider.component.scss']
})
export class DoubleSliderComponent implements OnInit {
  @Input() public range: IDoubleSlider = {
    highValue: 100,
    value: 0
  };
  @Input() public options: Options = {
    ceil: 100,
    floor: 0
  };
  @Output() doubleSliderRange: EventEmitter<ChangeContext> = new EventEmitter();
  manualRefresh: EventEmitter<void> = new EventEmitter<void>();
  minValue: number;
  maxValue: number;

  ngOnInit() {
    this.maxValue = this.range.highValue;
    this.minValue = this.range.value;
  }

  refresh() {
    this.manualRefresh.emit();
  }

  public onUserChangeEnd(changeContext: ChangeContext): void {
    this.range = { highValue: changeContext.highValue, value: changeContext.value };
    this.doubleSliderRange.emit(changeContext);
  }
}
