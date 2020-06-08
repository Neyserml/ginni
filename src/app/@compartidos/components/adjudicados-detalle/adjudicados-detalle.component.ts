import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ginni-adjudicados-detalle',
  styleUrls: ['./adjudicados-detalle.component.scss'],
  template: `
    <div class="adjudicados-detalle">
      <table>
        <thead>
          <tr>
            <th class="text-center">Nro</th>
            <th class="text-left">Cuotas por remate</th>
            <th class="text-center">Sorteo</th>
          </tr>
        </thead>
        <tbody>
          <ng-container *ngIf="adjudicadosDetalle?.length > 0; else noHay">
            <tr *ngFor="let adjudicado of adjudicadosDetalle">
              <td class="text-center">
                {{ adjudicado?.numeroAsamblea }}
              </td>
              <td class="text-left">
                <span *ngIf="adjudicado?.cuotasRemate.length > 0; else guion">{{
                  adjudicado?.cuotasRemate.join(' | ')
                }}</span>
              </td>
              <td class="text-center">
                {{ adjudicado?.cuotasSorteo }}
              </td>
            </tr>
          </ng-container>
          <ng-template #noHay>
            <tr>
              <td colspan="3" class="empty-message text-center">
                No hay asambleas anteriores
              </td>
            </tr>
          </ng-template>
        </tbody>
      </table>
      <ng-template #guion><span>-</span></ng-template>
    </div>
  `
})
export class AdjudicadosDetalleComponent implements OnInit {
  @Input() adjudicadosDetalle;

  constructor() {}

  ngOnInit() {}
}
