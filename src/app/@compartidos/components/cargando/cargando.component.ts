import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ginni-cargando',
  templateUrl: './cargando.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CargandoComponent {
  @Input()
  loading: boolean;
  @Input()
  ginni: boolean;
  @Input()
  opacity = true;
  @Input()
  failed: string;
  @Input()
  className = '';

  constructor() {}
}
