import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { IColumnas } from 'app/@compartidos/interfaces/grillas.interface';

@Component({
  selector: 'ginni-grillas',
  templateUrl: './grillas.component.html'
})
export class GrillasComponent implements OnInit {
  @Input()
  public chevron = false;

  @Input()
  public columnas: IColumnas[];

  @Input()
  public tableIcon = false;

  @Output()
  public columnaSelected: EventEmitter<IColumnas> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  public clickEnColumna(columna: IColumnas) {
    this.columnas.forEach(col => {
      if (col.name !== columna.name) {
        col.focus = false;
        col.asc = null;
      }
    });
    columna.focus = true;
    columna.asc = columna.asc === null ? false : !columna.asc;
    this.columnaSelected.emit(columna);
  }
}
