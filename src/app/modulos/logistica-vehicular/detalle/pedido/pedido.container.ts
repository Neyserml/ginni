import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { PedidoFacadeService } from './pedido-facade.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ginni-pedido',
  templateUrl: './pedido.container.html',
  encapsulation: ViewEncapsulation.None
})
export class PedidoContainer implements OnInit, OnDestroy {
  public laboral: Array<any>;
  public subscriptions: Subscription[] = [];

  constructor(private facade: PedidoFacadeService) {}

  ngOnInit() {
    this.facade.cargarDatosLaboral('198024');
    this.requestsDemo();
  }

  private requestsDemo() {
    this.subscriptions.push(this.facade.laboral$.subscribe(laboral => (this.laboral = laboral)));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
