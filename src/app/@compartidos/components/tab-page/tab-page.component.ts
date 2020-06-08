import { Component, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { ITabsPage } from 'app/@compartidos/interfaces/tabPage.interface';

@Component({
  selector: 'ginni-tab-page',
  templateUrl: './tab-page.component.html',
  styleUrls: ['./tab-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TabPageComponent {
  @Input()
  public tabsPage: ITabsPage[];

  @Output()
  public tabSeleccionada: EventEmitter<string> = new EventEmitter();

  constructor() {}
}
