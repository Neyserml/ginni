import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetalleContainer } from './detalle.container';
import { DetalleRouteComponent } from './detalle-route.component';

export const DETALLE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'evaluacion'
  },
  {
    path: '',
    component: DetalleRouteComponent,
    data: { breadcrumb: 'Detalle' },
    children: [
      {
        path: 'evaluacion',
        component: DetalleContainer,
        children: [
          {
            path: '',
            redirectTo: 'crediticia'
          },
          {
            path: 'crediticia',
            loadChildren: './evaluacion/evaluacion.module#EvaluacionCrediticiaModule'
          },
          {
            path: 'pedido',
            data: { breadcrumb: 'Pedido' },
            loadChildren: './pedido/pedido.module#PedidoModule'
          }
        ]
      },
      {
        path: 'editar/:idPersona',
        data: { breadcrumb: 'Editar' },
        loadChildren: './editar-asociado/editar-asociado.module#EditarEvaluacionCrediticiaModule'
      },
      {
        path: 'ver/:idPersona',
        data: { breadcrumb: 'Ver' },
        loadChildren: './editar-asociado/editar-asociado.module#EditarEvaluacionCrediticiaModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(DETALLE_ROUTES)],
  exports: [RouterModule]
})
export class DetalleRoutingModule {}
