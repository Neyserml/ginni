import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'ginni-tab-title',
  template: `
    <div #node class="tab-title title-primary">
      <span><ng-content></ng-content></span> <i class="icon-animate icon-chevron-down"></i>
    </div>
  `,
  styles: []
})
export class TabTitleComponent {
  @ViewChild('node', { read: ElementRef })
  node: ElementRef;
}
