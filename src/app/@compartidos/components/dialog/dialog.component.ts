import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';

import { bloquearScroll } from 'app/@compartidos/utils/helpers';

@Component({
  selector: 'ginni-dialog',
  template: `
    <div class="dialog" [ngClass]="{ active: active }">
      <div class="dialog-content">
        <div class="dialog__head">
          <div class="dialog__close-icon" (click)="onClose()">
            <span class="icon-chevron-left"></span>
          </div>
          <div class="dialog__head-title">{{ title }}</div>
        </div>
        <div class="dialog__body" ginniAllPageHeight [addPageHeight]="50">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnChanges, OnInit {
  @Input() active = true;
  @Input() title: string;

  @Output() activeChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  _bloquearScroll = bloquearScroll;

  public ngOnInit(): void {
    this.activarDialog();
  }

  public ngOnChanges() {
    this.activarDialog();
  }

  public activarDialog() {
    this._bloquearScroll(this.active);
  }

  public onClose() {
    this.activeChange.emit(false);
  }
}
