import { Component, Input } from '@angular/core';

@Component({
  selector: 'ginni-tab-bar-item',
  template: `
    <a class="tab-bar-item" [routerLink]="link" routerLinkActive="active">
      <div class="tab-bar-item__button"><span [class]="'icon-' + icon"></span></div>
      <div class="tab-bar-item__text">
        <span>{{ text }}</span>
      </div>
    </a>
  `,
  styleUrls: ['./tab-bar-item.component.scss']
})
export class TabbarItemComponent {
  @Input()
  link: string;

  @Input()
  icon: string;

  @Input()
  text: string;
}
