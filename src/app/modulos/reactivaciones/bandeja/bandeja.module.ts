import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TooltipModule } from 'ng2-tooltip-directive';
import { Ng5SliderModule } from 'ng5-slider';

import { reducers } from './@store';
import { BandejaEffect } from './@store/bandeja.effect';
import { BandejaContainer } from './bandeja.container';
import { BandejaService } from './bandeja.service';
import { CompartidosModule } from 'app/@compartidos/compartidos.module';
import { providersHttpInterceptors } from 'app/@compartidos/services/interceptors';
import { metaReducers } from 'app/@compartidos/store/meta-reducer';
import { DetalleResueltosService } from 'app/modulos/reactivaciones/detalle-resueltos/detalle-resueltos.service';

const routes: Routes = [
  {
    path: '',
    component: BandejaContainer
  },
  {
    path: 'detalle',
    data: { breadcrumb: 'Ingreso al caso' },
    loadChildren: '../detalle-resueltos/detalle-resueltos.module#DetalleModule'
  }
];

@NgModule({
  imports: [
    FormsModule,
    TooltipModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('bandejaReactivaciones', reducers, { metaReducers }),
    EffectsModule.forFeature([BandejaEffect]),
    CompartidosModule.forRoot(),
    Ng5SliderModule
  ],
  declarations: [BandejaContainer],
  providers: [BandejaService, DetalleResueltosService, providersHttpInterceptors]
})
// @ts-ignore
export class BandejaModule {}
