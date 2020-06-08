import { Component, Input, EventEmitter, Output } from '@angular/core';

import { fadeInLeftAnimation } from 'app/@compartidos/animations/fadeInLeft.animation';

@Component({
  selector: 'ginni-sidebar-item',
  template: `
    <div class="ginni-sidebar-item">
      <div class="sidebar-item-float" [ngClass]="{ 'active-float': rla.isActive }">
        <span class="sidebar-item__icon sidebar-item__icon-float icon-{{ icon }}"></span>
      </div>
      <a
        (click)="clickRoute.emit(true)"
        [routerLink]="route"
        routerLinkActive="active"
        #rla="routerLinkActive"
        class="sidebar-item"
      >
        <div
          class="sidebar-item__button"
          (mouseenter)="changeShowToggle('active')"
          (mouseleave)="changeShowToggle('inactive')"
        >
          <span class="sidebar-item__icon icon-{{ icon }}"></span>
        </div>
        <div [@fadeInLeftAnimation]="showToggle" class="sidebar-item__text">
          <span>{{ text }}</span>
        </div>
      </a>
    </div>
  `,
  animations: [fadeInLeftAnimation],
  styles: []
})
export class SidebarItemComponent {
  @Input() route;
  @Input() icon;
  @Input() text;
  @Input() disabled = true;
  @Output() clickRoute = new EventEmitter<boolean>();

  public showToggle = 'inactive';
  private collapsarSidebar = () => window.innerWidth > 767;

  changeShowToggle(showToggle) {
    if (!this.disabled) {
      if (this.collapsarSidebar()) {
        this.showToggle = showToggle;
      }
    }
  }
}
