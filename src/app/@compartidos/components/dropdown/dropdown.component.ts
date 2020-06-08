import { Component, Input } from '@angular/core';

import { fadeInDownAnimation } from 'app/@compartidos/animations/fadeInDown.animation';

@Component({
  selector: 'ginni-dropdown',
  template: `
    <div class="dropdown">
      <span
        class="dropdown-button icon-chevron-down"
        (click)="toggleDropdown()"
        [ngClass]="{ active: active, 'long-text': longText }"
      ></span>
      <div class="dropdown-content" *ngIf="active" @fadeInDownAnimation>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  animations: [fadeInDownAnimation],
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  @Input() longText: boolean;

  public active = false;

  public toggleDropdown() {
    this.active = !this.active;
    if (this.active) {
      document.body.addEventListener('click', this.onBlur);
    }
  }

  public onBlur = event => {
    if (event.target.closest('.dropdown')) {
      return;
    } else {
      this.active = false;
      document.body.removeEventListener('click', this.onBlur);
    }
  };
}
