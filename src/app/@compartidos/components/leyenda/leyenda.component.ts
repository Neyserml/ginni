import { Component, Input } from '@angular/core';
import { IProp } from 'app/@compartidos/models/prop.interface';
import { cloneArray } from 'app/@compartidos/utils/helpers';

@Component({
  selector: 'ginni-leyenda',
  templateUrl: './leyenda.component.html',
  styles: []
})
export class LeyendaComponent {
  @Input()
  public listarLeyenda: IProp[];

  public get obtenerLeyenda(): IProp[][] {
    const output = [];
    const tiposCategoria = cloneArray(this.listarLeyenda);
    while (tiposCategoria.length > 0) {
      output.push(tiposCategoria.splice(0, 4));
    }
    return output;
  }
}
