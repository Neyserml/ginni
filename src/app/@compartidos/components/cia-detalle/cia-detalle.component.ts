import { Component, Input, OnInit } from '@angular/core';
import { formatoMoneda } from 'app/@compartidos/utils/helpers';

@Component({
  selector: 'ginni-cia-detalle',
  styleUrls: ['./cia-detalle.component.scss'],
  template: `
    <div class="cia-detalle">
      <table>
        <thead>
          <tr>
            <th></th>
            <th class="text-right">Por pagar</th>
            <th class="text-right">Pagado</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let cia of ciaDetalle">
            <td class="lateral-header">
              CI"{{ cia?.ci }}"<span *ngIf="cia?.conAsterisco">*</span>
            </td>
            <td class="text-right">
              <span *ngIf="cia?.montoPorPagar !== 0.0; else guion">{{
                _formatoMoneda(cia?.montoPorPagar)
              }}</span>
            </td>
            <td class="text-right">
              <span *ngIf="cia?.montoPagado !== 0.0; else guion">{{
                _formatoMoneda(cia?.montoPagado)
              }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <ng-template #guion><span>-</span></ng-template>
      <span class="legend">*Exonerable a la entrega del bien</span>
    </div>
  `
})
export class CiaDetalleComponent implements OnInit {
  @Input() ciaDetalle;

  _formatoMoneda = formatoMoneda;

  constructor() {}

  ngOnInit() {}
}
