import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoRoutingModule } from './pedido.routing';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { PedidoContainer } from './pedido.container';
import { PedidoFacadeService } from './pedido-facade.service';

@NgModule({
  imports: [CommonModule, PedidoRoutingModule, CompartidosModule.forRoot()],
  declarations: [PedidoContainer],
  providers: [providersHttpInterceptors, PedidoFacadeService]
})
export class PedidoModule {}
