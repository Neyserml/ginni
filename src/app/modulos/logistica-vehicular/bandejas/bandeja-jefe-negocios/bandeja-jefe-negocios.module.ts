import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BandejaJefeNegociosContainer } from './bandeja-jefe-negocios.container';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { CommonModule } from '@angular/common';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { metaReducers } from 'app/@compartidos/store/meta-reducer';
import { StoreModule } from '@ngrx/store';
import { reducers } from './@store';
import { EffectsModule } from '@ngrx/effects';
import { BanjedaJefeNegociosEffect } from './@store/bandeja-jefe-negocios.effect';
import { BandejaJefeNegociosApiService } from './bandeja-jefe-negocios-api.service';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: BandejaJefeNegociosContainer
  },
  {
    path: 'detalle/:id',
    loadChildren: '../../detalle/detalle.module#DetalleLogisticaVehicularModule'
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    StoreModule.forFeature('bandejaJefeNegocios', reducers, { metaReducers }),
    EffectsModule.forFeature([BanjedaJefeNegociosEffect]),
    CompartidosModule.forRoot()
  ],
  declarations: [BandejaJefeNegociosContainer],
  providers: [providersHttpInterceptors, BandejaJefeNegociosApiService]
})
export class BandejaJefeNegociosModule {}
