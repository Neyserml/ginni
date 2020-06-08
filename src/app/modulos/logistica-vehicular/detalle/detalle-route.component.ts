import { Component, ViewEncapsulation } from '@angular/core';
import { PortalSandbox } from 'app/modulos/portal/portal.sandbox';

@Component({
  selector: 'ginni-detalle-route',
  template: `
    <router-outlet></router-outlet>
  `,
  encapsulation: ViewEncapsulation.None
})
export class DetalleRouteComponent {
  constructor(public portalSandbox: PortalSandbox) {}
}
