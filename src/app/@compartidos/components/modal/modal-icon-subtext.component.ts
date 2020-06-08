import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

import { IconType, ModalIconSubtextEnum } from './modal-icon-subtext.enum';

@Component({
  selector: 'ginni-modal-icon-subtext',
  styleUrls: ['./modal-icon-subtext.component.scss'],
  template: `
    <ginni-modal
      class="modal-small reset-body modal-icon-subtext"
      [show]="show"
      [nativeBack]="false"
      [dismissable]="false"
    >
      <div body class="text-center">
        <ng-container *ngIf="loading; else enviado">
          <ginni-cargando [loading]="true"></ginni-cargando>
        </ng-container>
        <ng-template #enviado>
          <div title>
            <ng-container *ngIf="icon" [ngSwitch]="icon">
              <img
                *ngSwitchCase="modalIconSubtextEnum.Alert"
                src="assets/imagenes/alert-triangle-azul-copy.svg"
                class="alert-triangle-azul-copy"
              />
              <img
                *ngSwitchCase="modalIconSubtextEnum.Check"
                src="assets/imagenes/group-9-copy-2.svg"
                class="Group-9-Copy-2"
              />
            </ng-container>
          </div>
          <div class="text"><ng-content select="[text]"></ng-content></div>
          <div class="subtext"><ng-content select="[subtext]" class="subtext"></ng-content></div>
          <div class="endtext"><ng-content select="[endtext]" class="endtext"></ng-content></div>
          <div class="button">
            <button
              class="modal-button ui-button"
              ginniButton
              (click)="onClose()"
              color="{{ buttonColor }}"
            >
              {{ buttonText }}
            </button>
          </div>
        </ng-template>
      </div>
    </ginni-modal>
  `,
  encapsulation: ViewEncapsulation.None
})
export class ModalIconSubtextComponent implements OnInit {
  @Input() buttonColor: string;
  @Input() buttonText: string;
  @Input() icon: IconType;
  @Input() loading: boolean;
  @Input() show: boolean;

  @Output() close: EventEmitter<boolean> = new EventEmitter();

  public modalIconSubtextEnum = ModalIconSubtextEnum;

  constructor() {}

  ngOnInit() {}

  public onClose() {
    this.close.emit(false);
  }
}
