import {
  Component,
  OnChanges,
  AfterContentInit,
  QueryList,
  ContentChildren,
  Input,
  AfterContentChecked
} from '@angular/core';
import { TabComponent as Tab, TabComponent } from './tab.component';
import { TabControlComponent as TabControl } from './tab-control.component';
import * as animateScrollTo from 'animated-scroll-to';

@Component({
  selector: 'ginni-tabs',
  template: `
    <div>
      <ng-content></ng-content>
      <div class="tab-content"><ng-content select="fp-tab"></ng-content></div>
    </div>
  `,
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit, OnChanges, AfterContentChecked {
  @ContentChildren(Tab)
  tabs = new QueryList<Tab>();

  @Input()
  multiExpand = false;

  @Input()
  activeTabs = true;

  public tabControl: TabControl;
  private init = false;
  public cacheLength: number;

  constructor() {}

  public ngAfterContentInit() {
    this.init = true;
    this.tabs.forEach(tab => {
      tab.onClick.subscribe(this.selectTab);
    });
    this.cacheLength = this.tabs.length;

    if (this.activeTabs) {
      this.desactivarTabs();
    } else {
      this.showAllTabs(true);
    }
  }

  public ngAfterContentChecked() {
    if (this.tabs.length !== this.cacheLength) {
      this.tabs.forEach(tab => {
        if (tab.onClick.observers.length === 0) {
          tab.onClick.subscribe(this.selectTab);
        }
      });
      this.cacheLength = this.tabs.length;
    }
  }

  private showAllTabs(init?: boolean) {
    this.tabs.forEach(tab => {
      tab.active = init ? tab.defaultCollapse : true;
    });
  }

  public addTabControl(tabControl: TabControl) {
    this.tabControl = tabControl;
  }

  public selectTab = (tab: Tab) => {
    if (this.activeTabs || tab.forceActive) {
      const active = !tab.active;
      if (!this.multiExpand) {
        this.desactivarTabs();
      }
      tab.active = active;
      this.scroll(tab);
    }
  };

  private desactivarTabs() {
    if (!this.multiExpand) {
      this.tabs.forEach(tabContent => {
        tabContent.active = false;
      });
    }
  }

  private scroll(tabContent: TabComponent) {
    if (tabContent.tabNode) {
      let scrollComponent;

      if (tabContent.tabNode.nativeElement.offsetTop) {
        scrollComponent = tabContent.tabNode.nativeElement.offsetTop;
      } else {
        // para simulador
        scrollComponent = 350;
      }
      setTimeout(() => {
        animateScrollTo.default(scrollComponent, {});
      }, 300);
    }
  }

  ngOnChanges() {
    if (this.init) {
      if (this.activeTabs) {
        this.desactivarTabs();
      } else {
        this.showAllTabs();
      }
    }
  }
}
