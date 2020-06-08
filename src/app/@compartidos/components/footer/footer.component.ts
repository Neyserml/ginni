import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ginni-footer',
  template: `
    <div class="footer"><ginni-svg src="assets/imagenes/iconos/pandero-grey.svg"></ginni-svg></div>
  `,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {}
