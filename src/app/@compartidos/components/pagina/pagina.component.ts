import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ginni-pagina',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./pagina.component.scss']
})
export class PaginaComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
