import { Component } from '@angular/core';

@Component({
  selector: 'ginni-pagina-full',
  template: `
    <div [ginniAllPageHeight]="54"><ng-content></ng-content></div>
    <ginni-footer></ginni-footer>
  `,
  styles: []
})
export class PaginaFullComponent {}
