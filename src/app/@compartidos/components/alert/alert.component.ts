import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';

import { AlertType, NotificationTypeEnum } from 'app/@compartidos/services/notification-type.enum';

@Component({
  selector: 'ginni-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnChanges {
  @Input() allowClose = false;
  @Input() disappear = false;
  @Input() show: boolean;
  @Input() type: AlertType;

  @Output() close: EventEmitter<boolean> = new EventEmitter();
  @Output() closeSuccess: EventEmitter<boolean> = new EventEmitter();

  public icon: string;

  constructor() {}

  ngOnChanges() {
    if (this.show && this.disappear) {
      setTimeout(() => {
        this.show = false;
        this.closeSuccess.emit(true);
      }, 8000);
    }
  }

  public getAlertType(type: string): string {
    let icon;
    switch (type) {
      case NotificationTypeEnum.Default:
        icon = NotificationTypeEnum.DefaultIcon;
        break;
      case NotificationTypeEnum.Danger:
        icon = NotificationTypeEnum.DangerIcon;
        break;
      case NotificationTypeEnum.Info:
        icon = NotificationTypeEnum.InfoIcon;
        break;
      case NotificationTypeEnum.Success:
        icon = NotificationTypeEnum.SuccessIcon;
        break;
      case NotificationTypeEnum.Warning:
        icon = NotificationTypeEnum.WarningIcon;
        break;
      default:
        icon = NotificationTypeEnum.OtherIcon;
    }

    return icon;
  }

  public onClose() {
    this.close.emit(false);
  }
}
