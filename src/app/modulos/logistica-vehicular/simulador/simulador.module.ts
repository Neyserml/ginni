import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TooltipModule } from 'ng2-tooltip-directive';
import { SimuladorContainer } from './simulador.container';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { ConfiguracionResolve } from 'app/modulos/portal/@guards/configuracion.resolve';
import { SimuladorApiService } from './simulador-api.service';
import { SimuladorContratosComponent } from './contratos/simulador-contratos.component';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { StoreModule } from '@ngrx/store';
import { reducers } from './@store';
import { metaReducers } from 'app/@compartidos/store/meta-reducer';
import { EffectsModule } from '@ngrx/effects';
import { SimuladorEvaluacionCrediticiaEffect } from './@store/simulador.effect';

const routes: Routes = [
  {
    path: '',
    resolve: {
      ConfiguracionResolve
    },
    component: SimuladorContainer
  }
];

@NgModule({
  imports: [
    CommonModule,
    CompartidosModule.forRoot(),
    EffectsModule.forFeature([SimuladorEvaluacionCrediticiaEffect]),
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('simuladorEvaluacionCrediticia', reducers, { metaReducers }),
    TooltipModule
  ],
  declarations: [SimuladorContainer, SimuladorContratosComponent],
  providers: [ConfiguracionResolve, SimuladorApiService, providersHttpInterceptors]
})
export class SimuladorModule {}
