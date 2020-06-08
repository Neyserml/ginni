import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { NotificationTypeEnum } from './notification-type.enum';

@Injectable()
export class NotificationErrorHandlerService {
  private readonly notifier: NotifierService;

  constructor(notifer: NotifierService) {
    this.notifier = notifer;
  }

  showDefault(message: string): void {
    this.notifier.notify(
      NotificationTypeEnum.Default,
      `${NotificationTypeEnum.DefaultTitle}${message}`
    );
  }

  showError(message: string): void {
    this.notifier.notify(
      NotificationTypeEnum.Error,
      `${NotificationTypeEnum.ErrorTitle}: ${message}`
    );
  }

  showInfo(message: string): void {
    this.notifier.notify(
      NotificationTypeEnum.Info,
      `${NotificationTypeEnum.InfoTitle}: ${message}`
    );
  }

  showSuccess(message: string): void {
    this.notifier.notify(
      NotificationTypeEnum.Success,
      `${NotificationTypeEnum.SuccessTitle}: ${message}`
    );
  }

  showWarning(message: string): void {
    this.notifier.notify(
      NotificationTypeEnum.Warning,
      `${NotificationTypeEnum.WarningTitle}: ${message}`
    );
  }
}
