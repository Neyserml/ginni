import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PedidoContainer } from './pedido.container';

export const ROUTES: Routes = [
  {
    path: '',
    component: PedidoContainer
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class PedidoRoutingModule {}
