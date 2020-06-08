import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ButtonColorsType, ModalConfirmEnum } from './modal-confirm.enum';

@Component({
  selector: 'ginni-modal-confirm',
  styleUrls: ['./modal-confirm.component.scss'],
  template: `
    <ginni-modal
      class="modal-small reset-body modal-confirm"
      [show]="show"
      [nativeBack]="false"
      [dismissable]="false"
    >
      <div body class="text-center">
        <div class="text">
          <ng-content></ng-content>
        </div>
        <div class="buttons">
          <button
            [class.ui-button-dark]="goColor === modalConfirmEnum.Dark"
            [class.ui-button-primary]="goColor === modalConfirmEnum.Primary"
            class="ui-button"
            ginniButton
            (click)="onGo()"
            [attr.color]="
              goColor === modalConfirmEnum.Primary
                ? 'primary'
                : goColor === modalConfirmEnum.Secondary
                ? 'secondary'
                : null
            "
          >
            {{ goText }}
          </button>
          <button
            [class.ui-button-dark]="backColor === modalConfirmEnum.Dark"
            [class.ui-button-primary]="backColor === modalConfirmEnum.Primary"
            class="ui-button"
            ginniButton
            (click)="onBack()"
            [attr.color]="
              backColor === modalConfirmEnum.Primary
                ? 'primary'
                : backColor === modalConfirmEnum.Secondary
                ? 'secondary'
                : null
            "
          >
            {{ backText }}
          </button>
        </div>
      </div>
    </ginni-modal>
  `,
  encapsulation: ViewEncapsulation.None
})
export class ModalConfirmComponent implements OnInit {
  @Input() backColor: ButtonColorsType;
  @Input() backText: string;
  @Input() goColor: ButtonColorsType;
  @Input() goText: string;
  @Input() show: boolean;

  @Output() back: EventEmitter<boolean> = new EventEmitter();
  @Output() go: EventEmitter<boolean> = new EventEmitter();

  public modalConfirmEnum = ModalConfirmEnum;

  constructor() {}

  ngOnInit() {}

  public onBack() {
    this.back.emit(false);
  }

  public onGo() {
    this.go.emit(false);
  }
}
