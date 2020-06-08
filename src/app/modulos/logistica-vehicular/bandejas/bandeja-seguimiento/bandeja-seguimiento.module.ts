import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { reducers } from './@store';
import { BandejaSeguimientoContainer } from './bandeja-seguimiento.container';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { StoreModule } from '@ngrx/store';
import { metaReducers } from 'app/@compartidos/store/meta-reducer';
import { EffectsModule } from '@ngrx/effects';
import { BandejaSeguimientoEffect } from './@store/bandeja-seguimiento.effect';
import { BandejaSeguimientoApiService } from './bandeja-seguimiento-api.service';

const routes: Routes = [
  {
    path: '',
    component: BandejaSeguimientoContainer
  },
  {
    path: 'detalle/:id',
    loadChildren: '../../detalle/detalle.module#DetalleLogisticaVehicularModule'
  }
];

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([BandejaSeguimientoEffect]),
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('bandejaSeguimientoEvaluacion', reducers, { metaReducers }),
    CompartidosModule.forRoot()
  ],
  declarations: [BandejaSeguimientoContainer],
  providers: [providersHttpInterceptors, BandejaSeguimientoApiService]
})
export class BandejaSeguimientoEvaluacionModule {}
