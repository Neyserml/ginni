import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ginni-error-servicio',
  template: `
    <ng-container *ngIf="!mensaje"> <ng-content></ng-content> </ng-container>
    <div *ngIf="mensaje" class="error-container">{{ mensaje }}</div>
  `
})
export class ErrorServicioComponent implements OnInit {
  @Input()
  mensaje: string;

  constructor() {}

  ngOnInit() {}
}
