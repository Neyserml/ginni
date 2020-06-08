import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { reducers } from './@store';
import { DetalleEffect } from './@store/detalle.effect';
import { DetalleContainer } from './detalle.container';
import { DetalleSandbox } from './detalle.sandbox';
import { DetalleRoutingModule } from './detalle.routing';
import { DetalleApiService } from './detalle-api.service';
import { EvaluacionApiService } from 'app/modulos/logistica-vehicular/detalle/evaluacion/evaluacion-api.service';
import { DetalleRouteComponent } from './detalle-route.component';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { ReactiveFormsModule } from '@angular/forms';
import { DetalleFacadeService } from './detalle-facade.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DetalleRoutingModule,
    CompartidosModule.forRoot(),
    StoreModule.forFeature('asociados', reducers),
    EffectsModule.forFeature([DetalleEffect])
  ],
  declarations: [DetalleContainer, DetalleRouteComponent],
  providers: [
    DetalleSandbox,
    DetalleApiService,
    DetalleFacadeService,
    EvaluacionApiService,
    providersHttpInterceptors
  ]
})
export class DetalleLogisticaVehicularModule {}
