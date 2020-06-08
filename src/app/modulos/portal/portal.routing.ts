import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilesResolve } from './@guards/perfiles.resolve';
import { PortalContainer } from './portal.container';
import { PortalGuard } from './portal.guard';

export const PORTAL_ROUTES: Routes = [
  {
    path: '',
    component: PortalContainer,
    canActivate: [PortalGuard],
    resolve: {
      valid: PerfilesResolve
    },
    children: [
      { path: 'mi-espacio', loadChildren: './mi-espacio/mi-espacio.module#MiEspacioModule' },
      {
        path: 'bandeja-de-trabajo',
        data: { breadcrumb: 'bandejacelula' },
        loadChildren:
          '../logistica-vehicular/bandejas/bandeja-funcionario/bandeja-funcionario.module#BandejaFuncionarioModule'
      },
      {
        path: 'bandeja-de-reactivaciones',
        data: { breadcrumb: 'Bandeja de resueltos' },
        loadChildren: 'app/modulos/reactivaciones/bandeja/bandeja.module#BandejaModule'
      },
      {
        path: 'bandeja-de-trabajo-evaluacion',
        data: { breadcrumb: 'bandejaseguimientoevaluacion' },
        loadChildren:
          '../logistica-vehicular/bandejas/bandeja-seguimiento/bandeja-seguimiento.module#BandejaSeguimientoEvaluacionModule'
      },
      {
        path: 'bandeja-de-trabajo-negocios',
        data: { breadcrumb: 'bandeja de jefe de negocios' },
        loadChildren:
          '../logistica-vehicular/bandejas/bandeja-jefe-negocios/bandeja-jefe-negocios.module#BandejaJefeNegociosModule'
      },
      {
        path: 'simulador',
        loadChildren: '../logistica-vehicular/simulador/simulador.module#SimuladorModule'
      },
      {
        path: 'pagina-en-construccion',
        loadChildren:
          './pagina-en-construccion/pagina-en-construccion.module#PaginaEnConstruccionModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(PORTAL_ROUTES)],
  exports: [RouterModule]
})
export class PortalRoutingModule {}
