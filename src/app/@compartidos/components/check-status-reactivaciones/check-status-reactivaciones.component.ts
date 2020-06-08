import { Component, Input } from '@angular/core';

import { EstadoBandejaEnum } from 'app/modulos/reactivaciones/bandeja/bandeja.enum';

@Component({
  selector: 'ginni-check-status-reactivaciones',
  template: `
    <ng-container [ngSwitch]="status">
      <span *ngSwitchCase="_estadoBandejaEnum.SIN_SIMULACION" class="icon-minus color-gray"></span>
      <span
        *ngSwitchCase="_estadoBandejaEnum.CON_SIMULACION"
        class="icon-check color-gray"
        tooltip="Simulación guardada"
      ></span>
      <span
        *ngSwitchCase="_estadoBandejaEnum.CON_SIMULACION_CONTRATO_GEN"
        class="icon-check color-blue-check"
        tooltip="Reserva de contrato"
      ></span>
      <span
        *ngSwitchCase="_estadoBandejaEnum.PAGO_A_CUENTA"
        class="icon-check color-green-check"
        tooltip="Pagos a cuenta"
      ></span>
    </ng-container>
  `
})
export class CheckStatusReactivacionesComponent {
  @Input() status;

  _estadoBandejaEnum = EstadoBandejaEnum;

  constructor() {}
}
