import { Component } from '@angular/core';
import { TabsComponent } from './tabs.component';

@Component({
  selector: 'ginni-tab-control',
  template: `
    <div class="tab-control">
      <ng-content></ng-content>
      <ul class="nav nav-tabs smaller">
        <li class="nav-item" *ngFor="let tab of tabs; let i = index" (click)="selectTab(tab, i)">
          <a [ngClass]="{ active: tab.active }" class="nav-link"
            >{{ tab.tabTitle }}<ng-content select="fp-tab-title"></ng-content
          ></a>
        </li>
      </ul>
    </div>
  `,
  styles: []
})
export class TabControlComponent {
  public tabs;
  constructor(private tabsComponent: TabsComponent) {
    tabsComponent.addTabControl(this);
  }

  selectTab($tab) {
    this.tabsComponent.selectTab($tab);
  }
}
