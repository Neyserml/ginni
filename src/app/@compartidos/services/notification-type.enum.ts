export enum NotificationTypeEnum {
  Default = 'default',
  DefaultIcon = 'shield2',
  DefaultTitle = '',
  Danger = 'danger',
  DangerIcon = 'x-circle2',
  DangerTitle = 'Peligro',
  Error = 'error',
  ErrorTitle = 'Error',
  Info = 'info',
  InfoIcon = 'alert-circle2',
  InfoTitle = 'Información',
  OtherIcon = 'minus-circle2',
  Success = 'success',
  SuccessIcon = 'check-guardado2',
  SuccessTitle = 'Éxito',
  Warning = 'warning',
  WarningIcon = 'alert-triangle2',
  WarningTitle = 'Advertencia'
}

export type AlertType =
  | NotificationTypeEnum.Default
  | NotificationTypeEnum.Danger
  | NotificationTypeEnum.Info
  | NotificationTypeEnum.Success
  | NotificationTypeEnum.Warning;
