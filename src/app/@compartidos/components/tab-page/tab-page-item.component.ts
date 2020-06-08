import { Component, OnChanges, Input, EventEmitter, Output } from '@angular/core';
import { ITabsPage } from 'app/@compartidos/interfaces/tabPage.interface';

@Component({
  selector: 'ginni-tab-page-item',
  templateUrl: './tab-page-item.component.html'
})
export class TabPageItemComponent implements OnChanges {
  @Input()
  public tabsPage: ITabsPage[];

  @Output()
  public tabSeleccionada: EventEmitter<string> = new EventEmitter();

  public state = {};

  constructor() {}

  ngOnChanges() {
    this.tabsPage.map(tab => {
      this.state[tab.nombre] = tab.active;
    });
  }

  public onClickChangeTab(tab: string) {
    const tabs = this.state;
    Object.keys(this.state).forEach(function(key) {
      tabs[key] = key === tab;
    });
    this.tabSeleccionada.emit(tab);
  }
}
