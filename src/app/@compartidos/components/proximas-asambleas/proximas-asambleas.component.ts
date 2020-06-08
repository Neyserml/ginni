import { Component, Input, OnInit } from '@angular/core';

import { dateFormat, timeFormat } from 'app/@compartidos/utils/helpers';

@Component({
  selector: 'ginni-proximas-asambleas',
  styleUrls: ['./proximas-asambleas.component.scss'],
  template: `
    <div class="proximas-asambleas">
      <table>
        <thead>
          <tr>
            <th class="text-center">Nro</th>
            <th class="text-center">Fecha</th>
            <th class="text-center">Hora</th>
          </tr>
        </thead>
        <tbody>
          <ng-container *ngIf="proximasAsambleas?.length > 0; else noHay">
            <tr *ngFor="let asamblea of proximasAsambleas">
              <td class="text-center" [class.info]="asamblea.indicadorAsambleaResueltos">
                {{ asamblea?.numeroAsamblea
                }}<span *ngIf="asamblea.indicadorAsambleaResueltos">*</span>
              </td>
              <td class="text-center" [class.info]="asamblea.indicadorAsambleaResueltos">
                {{ _dateFormat(asamblea?.fechaProximaAsamblea) }}
              </td>
              <td class="text-center" [class.info]="asamblea.indicadorAsambleaResueltos">
                {{ _timeFormat(asamblea?.fechaProximaAsamblea) }}
              </td>
            </tr>
          </ng-container>
          <ng-template #noHay>
            <tr>
              <td colspan="3" class="empty-message text-center">
                No hay asambleas pendientes para este contrato
              </td>
            </tr>
          </ng-template>
        </tbody>
      </table>
      <ng-template #guion><span>-</span></ng-template>
      <span *ngIf="proximasAsambleas?.length > 0" class="legend"
        >*Sorteo de contratos resueltos</span
      >
    </div>
  `
})
export class ProximasAsambleasComponent implements OnInit {
  @Input() proximasAsambleas;

  _dateFormat = dateFormat;
  _timeFormat = timeFormat;

  constructor() {}

  ngOnInit() {}
}
