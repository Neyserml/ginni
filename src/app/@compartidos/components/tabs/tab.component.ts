import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  ContentChild,
  OnInit,
  EventEmitter
} from '@angular/core';
import { collapseInDownAnimation } from 'app/@compartidos/animations/collapseInDown.animation';
import { TabTitleComponent } from './tab-title.component';

@Component({
  selector: 'ginni-tab',
  template: `
    <div #tab class="tab">
      <div class="tab-head" [ngClass]="{ 'active-chevron': active }">
        <ng-content select="[title]"></ng-content>
      </div>
      <div class="tab-content" *ngIf="active" @collapseInDownAnimation>
        <div class="tab-body"><ng-content></ng-content></div>
      </div>
    </div>
  `,
  styles: [],
  animations: [collapseInDownAnimation]
})
export class TabComponent implements OnInit {
  @ViewChild('tab', { read: ElementRef })
  tabNode: ElementRef;

  @ContentChild(TabTitleComponent) tabTitleComponent: TabTitleComponent;

  @Input()
  tabTitle: string;

  public active = false;

  public onClick: EventEmitter<TabComponent> = new EventEmitter();

  @Input()
  forceActive: boolean;

  @Input()
  defaultCollapse = true;

  public ngOnInit() {
    if (this.tabTitleComponent) {
      this.bindClickTabTitle();
    }
  }

  private bindClickTabTitle() {
    if (this.tabTitleComponent.node) {
      const element: Node = this.tabTitleComponent.node.nativeElement;
      element.addEventListener('click', () => {
        this.onClick.emit(this);
      });
    }
  }
}
