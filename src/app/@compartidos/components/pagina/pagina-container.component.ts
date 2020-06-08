import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ginni-pagina-container',
  template: `
    <ng-content></ng-content>
  `,
  styleUrls: ['./pagina-container.component.scss']
})
export class PaginaContainerComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
