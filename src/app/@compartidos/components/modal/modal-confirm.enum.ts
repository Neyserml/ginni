export enum ModalConfirmEnum {
  Primary = 'primary',
  Secondary = 'secondary',
  Dark = 'dark'
}

export type ButtonColorsType =
  | ModalConfirmEnum.Primary
  | ModalConfirmEnum.Secondary
  | ModalConfirmEnum.Dark;
