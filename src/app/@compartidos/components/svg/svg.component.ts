import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ginni-svg',
  template: `
    <svg-icon [class]="class" [src]="src"></svg-icon>
  `,
  styles: []
})
export class SvgComponent implements OnInit {
  @Input()
  class;
  @Input()
  src;

  constructor() {}

  ngOnInit() {}
}
