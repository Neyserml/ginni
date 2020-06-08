import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ginni-button-icon',
  template: `
    <div class="ginni-button flex-middle-center">
      <span [ngClass]="class" [class]="'button-add__icon ' + 'icon-' + icon + ' ' + color"></span>
      <span class="button-add__text default strong"><ng-content></ng-content></span>
    </div>
  `,
  styleUrls: ['button-icon.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ButtonIconComponent {
  @Input() icon = '';
  @Input() color = '';
  @Input() class = '';
}
