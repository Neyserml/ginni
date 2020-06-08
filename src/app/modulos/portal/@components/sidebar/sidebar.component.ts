import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewEncapsulation
} from '@angular/core';

import { fadeInAnimation } from 'app/@compartidos/animations/fadeIn.animation';
import { aplanarMenu } from 'app/@compartidos/utils/helpers';
import { IMenuItem } from 'app/@compartidos/utils/perfiles-items';

@Component({
  selector: 'ginni-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [fadeInAnimation],
  encapsulation: ViewEncapsulation.None
})
export class SidebarComponent implements OnChanges {
  @Input() activeMenu: boolean;
  @Input() activeSubmenu = true;
  @Input() showRouterBack = false;
  @Input() menu: IMenuItem[] = [];
  @Output() activeMenuChange = new EventEmitter();
  @Output() clickedRoute = new EventEmitter<boolean>();
  @Output() routerBack = new EventEmitter();

  public listMenus: IMenuItem[] = [];

  ngOnChanges() {
    if (!this.listMenus.length && this.menu.length) {
      this.listMenus = aplanarMenu(this.menu);
    }
  }
}
