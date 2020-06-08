import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalleComponent } from './detalle-resueltos.component';

const routes: Routes = [
  {
    path: '',
    component: DetalleComponent,
    children: [
      {
        path: 'info',
        loadChildren: './info/info.module#InfoModule'
      },
      {
        path: 'generar-contrato',
        loadChildren: './generacion-contrato/generacion-contrato.module#GeneracionContratoModule'
      },
      {
        path: 'pagos',
        loadChildren: './pagos/pagos.module#PagosModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetalleResueltosRoutingModule {}
