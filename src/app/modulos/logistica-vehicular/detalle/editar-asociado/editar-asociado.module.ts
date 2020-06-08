import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EditarResolve } from './editar-asociado.resolve';
import { LocalidadesResolve } from 'app/modulos/portal/@guards/localidades.resolve';
import { EditarAsociadoComponent } from './editar-asociado.component';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { ConfiguracionResolve } from 'app/modulos/portal/@guards/configuracion.resolve';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { DetalleComponentesModule } from 'app/modulos/logistica-vehicular/detalle/@componentes/detalle-componentes.module';

const routes: Routes = [
  {
    path: '',
    resolve: {
      tipo: EditarResolve,
      LocalidadesResolve,
      ConfiguracionResolve
    },
    component: EditarAsociadoComponent
  }
];

@NgModule({
  imports: [
    CompartidosModule.forRoot(),
    CommonModule,
    DetalleComponentesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditarAsociadoComponent],
  providers: [EditarResolve, LocalidadesResolve, ConfiguracionResolve, providersHttpInterceptors]
})
export class EditarEvaluacionCrediticiaModule {}
