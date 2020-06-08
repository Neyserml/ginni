import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ginni-ver-mas',
  template: `
    <div class="ver-mas" [hidden]="!active"><ng-content></ng-content></div>
    <a class="link" (click)="clickVerMas()">{{ active ? 'Ver menos' : 'Ver más' }}</a>
  `,
  styleUrls: ['./ver-mas.component.scss']
})
export class VerMasComponent {
  @Input()
  active = false;

  @Output()
  activeChange = new EventEmitter();

  public clickVerMas() {
    const value = !this.active;
    this.active = value;
    this.activeChange.emit(value);
  }
}
